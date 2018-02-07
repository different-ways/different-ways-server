"use strict";
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

function extractQuestion(project, qid) {
  for (const el of project.questions) {
    if (qid.equals(el._id)) {
      return el;
    }
  }
  return null;
}

module.exports = {
  add(pid, {text}) {
    const Project = mongoose.model('Project');
    const toAdd = {
      _id: ObjectId(),
      text,
      answers: [],
    };
    return new Promise((resolve, reject) => {
      return Project.findByIdAndUpdate(
          pid,
          {$push: {questions: toAdd}},
          {new: true, fields: {_id: 0, questions: 1}})
          .then(project => {
            resolve(extractQuestion(project, toAdd._id))
          }).catch(reject);
    });

  },
  edit(pid, id, {text}) {
    id = ObjectId(id);
    const Project = mongoose.model('Project');
    return new Promise((resolve, reject) => {
      return Project.findOneAndUpdate(
          { _id: ObjectId(pid), "questions._id": id },
          { $set: {"questions.$.text": text} },
          {new: true, fields: {_id: 0, questions: 1}})
          .then(project => {
            resolve(extractQuestion(project, id))
          }).catch(reject);
    });
  },
  delete(pid, id) {
    pid = ObjectId(pid);
    id = ObjectId(id);
    const Project = mongoose.model('Project');
    return Project.update(
        {_id: pid, "questions._id": id},
        {$pull: {questions: {_id: id}}}
    ).exec()
  },
  get(pid, id) {
    return new Promise((resolve, reject) => {
      const Project = mongoose.model('Project');
      return Project.aggregate([
        {$match: {_id: ObjectId(pid)}},
        {$project: {_id: 0, questions: 1}},
        {$unwind: "$questions"},
        {$match: {"questions._id": ObjectId(id)}},
      ]).exec().then(pr => resolve(pr[0].questions)).catch(reject);
    })
  },
};