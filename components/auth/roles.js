"use strict";
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  allCapabilities() {
    return mongoose.model("Role").CAPABILITIES;
  },
  add(role) {
    return mongoose.model("Role").create({name: role.name, capabilities: role.capabilities})
  },
  edit(rid, {name, capabilities}) {
    const Role = mongoose.model("Role");
    const update = {};
    if (name) {
      update.name = name
    }
    if (capabilities) {
      if (Array.isArray(capabilities)) {
        update.capabilities = capabilities;
      } else {
        const toAdd = [];
        const toRemove = [];
        for (const cap of Object.keys(capabilities)) {
          if (!Role.includes(cap)) continue;
          if (capabilities[cap]) {
            toAdd.push(cap)
          } else {
            toRemove.push(cap)
          }
        }
        if (toAdd.length > 0) update['$addToSet'] = { capabilities: { $each: toAdd } };
        if (toRemove.length > 0) update['$pull'] = { capabilities: { $in: toRemove } };
      }
    }
    return Role.findByIdAndUpdate(rid, update, {new: true}).exec();
  }
  ,
  delete(rid) {
    return new Promise((resolve, reject) => {
      rid = ObjectId(rid);
      mongoose.model("Role")
        .deleteOne({_id: rid}).exec().catch(reject).then(() => {
          mongoose.model("User")
            .update({roles: rid},
                {$pull: {roles: rid }}).exec().catch(reject).then(resolve);
        })
    });
  },
  addToUser(uid, rid) {
    return mongoose.model("User")
        .update({_id: ObjectId(uid)},
            {$addToSet: {roles: ObjectId(rid) }}).exec()
  },
  removeFromUser(uid, rid) {
    return mongoose.model("User")
        .update({_id: ObjectId(uid)},
            {$pull: {roles: ObjectId(rid) }}).exec()
  },
  get(rid) {

  },
  getAll() {
    return mongoose.model("Role").find({}).exec()
  }
};