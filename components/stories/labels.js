"use strict";
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

function extractLabel(project, lid) {
  for (const el of project.labels) {
    if (lid.equals(el._id)) {
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
          {$push: {labels: toAdd}},
          {new: true, fields: {_id: 0, labels: 1}})
          .then(project => {
            resolve(extractLabel(project, toAdd._id))
          }).catch(reject);
    });

  },
  edit(pid, id, {name, color}) {
    id = ObjectId(id);
    const update = {};
    if (name !== undefined) {
      update["labels.$.name"] = name
    }
    if (color !== undefined) {
      update["labels.$.color"] = color
    }
    const Project = mongoose.model('Project');
    return new Promise((resolve, reject) => {
      return Project.findOneAndUpdate(
          { _id: ObjectId(pid), "labels._id": id },
          { $set: update },
          {new: true, fields: {_id: 0, labels: 1}})
          .then(project => {
            resolve(extractLabel(project, id))
          }).catch(reject);
    });
  },
  delete(pid, lid) {
    pid = ObjectId(pid);
    lid = ObjectId(lid);
    const Project = mongoose.model('Project');
    return mongoose.connection.db.command({
      update: Project.collection.name,
      updates: [{
        q: {_id: pid},
        u: {
          $pull: {
            labels: {_id: lid},
            "questions.$[].labels": {lid},
            "questions.$[].answers.$[].labels": {lid},
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
        {$unwind: "labels"},
        {$match: {"labels._id": ObjectId(id)}},
      ]).exec()
        .then(pr => resolve(pr[0].labels))
        .catch(reject);
    });
  },
  addToAnswer(pid, qid, aid, lid) {
    const Project = mongoose.model('Project');
    qid = ObjectId(qid);
    aid = ObjectId(aid);
    lid = ObjectId(lid);
    return mongoose.connection.db.command({
      update: Project.collection.name,
      updates: [
        {
          q: { _id: ObjectId(pid) },
          u: { $push: {"questions.$[qu].answers.$[ans].labels": {lid: lid}} },
          arrayFilters: [{"qu._id": qid}, {"ans._id": aid, "ans.labels.lid": {$not: {$eq: lid}}}],
        }
      ]
    })
  },
  removeFromAnswer(pid, qid, aid, lid) {
    const Project = mongoose.model('Project');
    qid = ObjectId(qid);
    aid = ObjectId(aid);
    lid = ObjectId(lid);
    return mongoose.connection.db.command({
      update: Project.collection.name,
      updates: [
        {
          q: { _id: ObjectId(pid) },
          u: { $pull: {"questions.$[qu].answers.$[ans].labels": {lid}} },
          arrayFilters: [{"qu._id": qid}, {"ans._id": aid}],
        }
      ]
    })
  },
  addToQuestion(pid, qid, lid) {
    qid = ObjectId(qid);
    lid = ObjectId(lid);
    const Project = mongoose.model('Project');
    return Project.update(
        {_id: ObjectId(pid), "questions._id": qid, "questions.$.labels.lid": {$not: {$eq: lid}}},
        {$push: {"questions.$.labels": {lid} }}
    ).exec();
  },
  removeFromQuestion(pid, qid, lid) {
    qid = ObjectId(qid);
    lid = ObjectId(lid);
    const Project = mongoose.model('Project');
    return Project.update(
        {_id: ObjectId(pid), "questions._id": qid},
        {$pull: {"questions.$.labels": {lid} }}
    ).exec();
  }

};