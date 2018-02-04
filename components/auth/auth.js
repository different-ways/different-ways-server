"use strict";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secret = require('../../config/environment').secret;
const mongoose = require('mongoose');
const users = require('./users');

module.exports = {
  login(username_or_email, password) {
    const User = mongoose.model('User');
    return new Promise((resolve, reject) => {
      User.aggregate([
          {$match: {$or: [{username: username_or_email}, {email: username_or_email}]}},
          {$lookup: {
            from: "role",
            localField: "roles",
            foreignField: '_id',
            as: 'roles'
          }}
        ]).exec()
        .catch(reject)
        .then(user => {
          user = user[0];
          if (!user) return reject({msg: "User not found", status: 400});
          bcrypt.compare(password, user.password)
              .then((cmp) => {
                if (!cmp) return reject({msg: "Wrong password", status: 400});
                // expire in 15 days
                const tokenExpiration = Math.floor(Date.now()) + 1000*60*60*24*15;
                jwt.sign({sub: user._id, exp: tokenExpiration/1000}, secret, (err, token) => {
                  if (err) {
                    return reject({msg: "Something went wrong", status: 500})
                  }
                  delete user.password;
                  module.exports.mergeCapabilities(user);
                  user.capabilities = [...user.capabilities];
                  return resolve({token, user, tokenExpiration})
                })
              })
              .catch(() => reject({msg: "Wrong password", status: 400}));
        });
    })
  },
  determineUser(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, function(err, decoded) {
        if (decoded && decoded.sub) {
          users.get(decoded.sub)
              .then(user => {
                if (!user) return reject({msg: "Invalid"});
                module.exports.mergeCapabilities(user);
                resolve(user);
              })
              .catch(e => reject("Invalid"))
        } else {
          reject({msg: "Invalid"})
        }
      });
    });
  },
  mergeCapabilities(user) {
    const caps = new Set();
    const add = caps.add.bind(caps);
    for (const role of user.roles) {
      role.capabilities.forEach(add);
    }
    user.capabilities = caps;
    return caps;
  }
};