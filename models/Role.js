"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const RoleSch = new Schema({
  name: {
    type: String,
    required: true,
  },
  capabilities: {
    type: [String],
    required: true,
    default: []
  },
}, {collection: 'role'});

const Role = mongoose.model('Role', RoleSch);
module.exports = Role;