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
  delete(pid, id) {
    pid = ObjectId(pid);
    id = ObjectId(id);
    const Project = mongoose.model('Project');
    const VariationAnswer = mongoose.model('VariationAnswer');
    return Promise.all([
      Project.update(
          {_id: pid, "variations._id": id},
          {$pull: {variations: {_id: id}}}
      ).exec(),
      VariationAnswer.remove({vid: id}).exec() // remove labels from all answers
    ]);
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
  addToAnswer(aid, vid) {
    const VariationAnswer = mongoose.model('VariationAnswer');
    try {
      aid = ObjectId(aid);
      vid = ObjectId(vid);
    } catch (err) {
      return Promise.reject({status: 400})
    }
    return VariationAnswer.create({aid, vid})
  },
  removeFromAnswer(aid, vid) {
    const VariationAnswer = mongoose.model('VariationAnswer');
    try {
      aid = ObjectId(aid);
      vid = ObjectId(vid);
    } catch (err) {
      return Promise.reject({status: 400})
    }
    return VariationAnswer.deleteOne({aid, vid}).exec()
  },
};