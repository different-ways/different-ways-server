"use strict";
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  add({username, email, password}) {
    const Users = mongoose.model("User");
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10).catch(reject).then(hashed => {
        Users.create({username, email, password: hashed}).then(resolve).catch(reject);
      });
    });
  },
  edit(id, {username, email, password}) {
    const Users = mongoose.model("User");
    let update = {};
    if (typeof username === 'string') {
      update.username = username
    }
    if (typeof email === 'string') {
      update.email = email
    }
    return new Promise((resolve, reject) => {
      if (typeof password === 'string') {
        bcrypt.hash(password, 10)
          .then(hashed => {
            update.password = hashed;
            Users.findByIdAndUpdate(id, update, {new: true}).exec().then(resolve).catch(reject);
          })
          .catch(reject);
      } else {
        Users.findByIdAndUpdate(id, update, {new: true}).exec().then(resolve).catch(reject);
      }
    });
  },
  delete(id) {
    return mongoose.model("User").deleteOne({_id: ObjectId(id)}).exec()
  },
  get(id) {
    return new Promise((resolve, reject) => {
      return mongoose.model("User").aggregate([
        {$match: {_id: ObjectId(id)}},
        {$project: {password: 0}},
        {$lookup: {
          from: "role",
          localField: "roles",
          foreignField: '_id',
          as: 'roles'
        }},
      ]).exec().then(users => resolve(users[0])).catch(reject);
    });
  },
  getAll() {
    return mongoose.model("User").aggregate([
        {$project: {password: 0}},
        {$lookup: {
          from: "role",
          localField: "roles",
          foreignField: '_id',
          as: 'roles'
        }},
    ]).exec();
  },
  list() {

  },
  count() {
    return mongoose.model("User").count({}).exec();
  }
};