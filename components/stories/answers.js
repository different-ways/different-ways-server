"use strict";
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

function extractAnswer(project, qid, aid) {
  console.log(project)
  for (const q of project.questions) {
    if (qid.equals(q._id)) {
      for (const a of q.answers) {
        if (aid.equals(a._id)) {
          return a;
        }
      }
    }
  }
  return null;
}

module.exports = {
  add(pid, qid, {text, link}) {
    qid = ObjectId(qid);
    const Project = mongoose.model('Project');
    const toAdd = {
      _id: ObjectId(),
      text,
      link,
    };
    return new Promise((resolve, reject) => {
      return Project.findOneAndUpdate(
          {_id: pid, "questions._id": qid},
          {$push: {"questions.$.answers": toAdd}},
          {new: true, fields: {_id: 0, questions: 1}})
          .then(project => {
            resolve(extractAnswer(project, qid, toAdd._id))
          }).catch(reject);
    });

  },
  edit(pid, qid, aid, {text, link}) {
    qid = ObjectId(qid);
    aid = ObjectId(aid);
    const Project = mongoose.model('Project');
    const update = {};
    if (text !== undefined) {
      update["questions.$[qu].answers.$[ans].text"] = text;
    }
    if (link !== undefined) {
      update["questions.$[qu].answers.$[ans].link"] = link;
    }
    console.log(update);
    return new Promise((resolve, reject) => {
      mongoose.connection.db.command({
        update: Project.collection.name,
        updates: [
          {
            q: { _id: ObjectId(pid) },
            u: { $set: update },
            arrayFilters: [{"qu._id": qid}, {"ans._id": aid}],
          }
        ]
      }).catch(reject).then(
          this.get(pid, qid, aid).catch(reject).then(resolve)
      );
      // return Project.findOneAndUpdate(
      //     { _id: ObjectId(pid) },
      //     { $set: update },
      //     {
      //       arrayFilters: [{"qu._id": qid}, {"ans._id": aid}],
      //       returnNewDocument: true,
      //       projection: {_id: 0, questions: 1}
      //     })
      //     .then(project => {
      //       resolve(extractAnswer(project, qid, aid))
      //     }).catch(reject);
    });
  },
  delete(pid, qid, id) {
    pid = ObjectId(pid);
    qid = ObjectId(qid);
    id = ObjectId(id);
    const Project = mongoose.model('Project');
    const AnswerLabel = mongoose.model('AnswerLabel');
    const VariationAnswer = mongoose.model('VariationAnswer');
    return Promise.all([
      Project.update(
          {_id: pid, "questions._id": qid},
          {$pull: {"questions.$.answers": {_id: id}}}
      ).exec(),
      AnswerLabel.remove({aid: id}).exec(), // remove labels from the answer
      VariationAnswer.remove({aid: id}).exec() // remove variations from the answer
    ]);
  },
  get(pid, qid, aid) {
    return new Promise((resolve, reject) => {
      const Project = mongoose.model('Project');
      return Project.aggregate([
        {$match: {_id: ObjectId(pid)}},
        {$project: {_id: 0, questions: 1}},
        {$unwind: "$questions"},
        {$match: {"questions._id": ObjectId(qid)}},
        {$unwind: {
          path: "$questions.answers",
          preserveNullAndEmptyArrays: true
        }},
        {$match: {"questions.answers._id": ObjectId(aid)}},
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
        {$project: {_id: 0, "questions.answers": 1}},
      ]).exec().catch(reject).then(pr => resolve(pr[0].questions.answers));
    });
  }
};