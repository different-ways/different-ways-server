"use strict";
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

function extractVariation(project, vid) {
  for (const el of project.variations) {
    if (vid.equals(el._id)) {
      return el;
    }
  }
  return null;
}

module.exports = {
  add(pid, {name, color}) {
    const Project = mongoose.model('Project');
    const toAdd = {
      _id: ObjectId(),
      name,
      color,
    };
    return new Promise((resolve, reject) => {
      return Project.findByIdAndUpdate(
          pid,
          {$push: {variations: toAdd}},
          {new: true, fields: {_id: 0, variations: 1}})
          .then(project => {
            resolve(extractVariation(project, toAdd._id))
          }).catch(reject);
    });

  },
  edit(pid, id, {name, color}) {
    id = ObjectId(id);
    const update = {};
    if (name !== undefined) {
      update["variations.$.name"] = name
    }
    if (color !== undefined) {
      update["variations.$.color"] = color
    }
    const Project = mongoose.model('Project');
    return new Promise((resolve, reject) => {
      return Project.findOneAndUpdate(
          { _id: ObjectId(pid), "variations._id": id },
          { $set: update },
          {new: true, fields: {_id: 0, variations: 1}})
          .then(project => {
            resolve(extractVariation(project, id))
          }).catch(reject);
    });
  },
  delete(pid, vid) {
    pid = ObjectId(pid);
    vid = ObjectId(vid);
    const Project = mongoose.model('Project');
    return mongoose.connection.db.command({
      update: Project.collection.name,
      updates: [{
        q: {_id: pid},
        u: {
          $pull: {
            variations: {_id: vid},
            "questions.$[].answers.$[].variations": {vid},
          }
        }
      }]
    });
  },
  get(pid, id) {
    const Project = mongoose.model('Project');
    return new Promise((resolve, reject) => {
      return Project.aggregate([
        {$match: {_id: ObjectId(pid)}},
        {$project: {_id: 0, labels: 1}},
        {$unwind: "variations"},
        {$match: {"variations._id": ObjectId(id)}},
      ]).exec()
          .then(pr => resolve(pr.variations))
          .catch(reject);
    });
  },
  addToAnswer(pid, qid, aid, vid) {
    const Project = mongoose.model('Project');
    qid = ObjectId(qid);
    aid = ObjectId(aid);
    vid = ObjectId(vid);
    return mongoose.connection.db.command({
      update: Project.collection.name,
      updates: [
        {
          q: { _id: ObjectId(pid) },
          u: { $push: {"questions.$[qu].answers.$[ans].variations": {vid}} },
          arrayFilters: [{"qu._id": qid}, {"ans._id": aid, "ans.variations.vid": {$not: {$eq: vid}}}],
        }
      ]
    })
  },
  removeFromAnswer(pid, qid, aid, vid) {
    const Project = mongoose.model('Project');
    qid = ObjectId(qid);
    aid = ObjectId(aid);
    vid = ObjectId(vid);
    return mongoose.connection.db.command({
      update: Project.collection.name,
      updates: [
        {
          q: { _id: ObjectId(pid) },
          u: { $pull: {"questions.$[qu].answers.$[ans].variations": {vid}} },
          arrayFilters: [{"qu._id": qid}, {"ans._id": aid}],
        }
      ]
    })
  },
};