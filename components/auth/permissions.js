"use strict";

module.exports = {
  view: {
    role: ["view-roles", "manage-roles"],
    user: ["view-users", "manage-users"],
    me: [null]
  },
  create: {
    role: ["manage-roles"],
    user: ["manage-users"],
    userRole: ["manage-users"]
  },
  edit: {
    role: ["manage-roles"],
    user: ["manage-users"],
  },
  delete: {
    role: ["manage-roles"],
    user: ["manage-users"],
    userRole: ["manage-users"],
  },
  auth: {
    me: [null]
  }
};