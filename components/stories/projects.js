"use strict";
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  add({name}) {
    const Project = mongoose.model('Project');
    return Project.create({name})
  },
  edit(id, {name}) {
    const project = mongoose.model('Project');
    return project.findByIdAndUpdate(id, {name}, {new: true}).exec();
  },
  delete(id) {

  },
  get(id) {
    const Project = mongoose.model('Project');
    return Project.aggregate([
      {$match: {_id: ObjectId(id)}},
      {$unwind: {
        path: "$questions",
        preserveNullAndEmptyArrays: true
      }},
      {$lookup: {
        from: "questionlabel",
        localField: "questions._id",
        foreignField: 'qid',
        as: 'questions.labels'
      }},
      {$unwind: {
        path: "$questions.answers",
        preserveNullAndEmptyArrays: true
      }},
      {$lookup: {
        from: "answerlabel",
        localField: "questions.answers._id",
        foreignField: 'aid',
        as: 'questions.answers.labels'
      }},
      {$lookup: {
        from: "variationanswer",
        localField: "questions.answers._id",
        foreignField: 'aid',
        as: 'questions.answers.variations'
      }},
      {$group: {
        _id: {pid: "$_id", qid: "$questions._id"},
        name: {$first: "$name"},
        labels: {$first: "$labels"},
        variations: {$first: "$variations"},
        questions: {$first: "$questions"},
        answers: {$push: "$questions.answers"}
      }},
      {$group: {
        _id: "$_id.pid",
        name: {$first: "$name"},
        labels: {$first: "$labels"},
        variations: {$first: "$variations"},
        questions: {$push: {_id: "$_id.qid", text: "$questions.text", labels: "$questions.labels", answers: "$answers"}}
      }}
    ]).exec();
  },
  list() {
    const project = mongoose.model('Project');
    return project.find({}, {name: true});
  }
};