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
    const Project = mongoose.model('Project');
    return new Promise((resolve, reject) => {
      return Project.findOneAndUpdate(
          { _id: ObjectId(pid), "questions._id": ObjectId(id) },
          { $set: {"questions.$.text": text} },
          {new: true, fields: {_id: 0, questions: 1}})
          .then(project => {
            resolve(extractQuestion(project, toAdd._id))
          }).catch(reject);
    });
  },
  delete(pid, id) {
    pid = ObjectId(pid);
    id = ObjectId(id);
    const Project = mongoose.model('Project');
    const QuestionLabel = mongoose.model('QuestionLabel');
    return Promise.all([
        Project.update(
            {_id: pid, "questions._id": id},
            {$pull: {questions: {_id: id}}}
        ).exec(),
        QuestionLabel.deleteOne({qid: id}).exec() // remove labels from the question
    ]);
  },
  get(pid, id) {
    const Project = mongoose.model('Project');
    return Project.aggregate([
      {$match: {_id: ObjectId(pid)}},
      {$project: {_id: 0, questions: 1}},
      {$unwind: "$questions"},
      {$match: {"questions._id": ObjectId(id)}},
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
        _id: "$questions._id",
        text: {$first: "$questions.text"},
        labels: {$first: "$questions.labels"},
        answers: {$push: "$questions.answers"}
      }}
    ]).exec();
  },
};