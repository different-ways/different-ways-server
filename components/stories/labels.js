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
    console.log(update)
    const Project = mongoose.model('Project');
    return new Promise((resolve, reject) => {
      return Project.findOneAndUpdate(
          { _id: ObjectId(pid), "labels._id": id },
          { $set: update },
          {new: true, fields: {_id: 0, labels: 1}})
          .then(project => {
            console.log("theen");
            resolve(extractLabel(project, id))
          }).catch(reject);
    });
  },
  delete(pid, id) {
    pid = ObjectId(pid);
    id = ObjectId(id);
    const Project = mongoose.model('Project');
    const QuestionLabel = mongoose.model('QuestionLabel');
    const AnswerLabel = mongoose.model('AnswerLabel');
    return Promise.all([
      Project.update(
          {_id: pid, "labels._id": id},
          {$pull: {labels: {_id: id}}}
      ).exec(),
      QuestionLabel.remove({lid: id}).exec(), // remove labels from all questions
      AnswerLabel.remove({lid: id}).exec() // remove labels from all answers
    ]);
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
        .then(pr => resolve(pr.labels))
        .catch(reject);
    });
  },
};