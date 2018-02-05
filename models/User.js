"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSch = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  roles: [
    {type: ObjectId, ref: 'Role'}
  ]
}, {collection: 'user'});

const User = mongoose.model('User', UserSch);
module.exports = User;