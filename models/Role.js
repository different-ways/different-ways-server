"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CAPABILITIES = [
    "manage-projects",
    "manage-labels",
    "manage-variations",
    "manage-questions",
    "manage-answers",
    "manage-answer-labels",
    "manage-answer-variations",
    "manage-users",
    "view-users",
    "manage-roles",
    "view-roles",
];

const RoleSch = new Schema({
  name: {
    type: String,
    required: true,
  },
  capabilities: {
    type: [{type: String, enum: CAPABILITIES}],
    required: true,
    default: []
  },
}, {collection: 'role'});

const Role = mongoose.model('Role', RoleSch);
Role.CAPABILITIES = CAPABILITIES;
module.exports = Role;