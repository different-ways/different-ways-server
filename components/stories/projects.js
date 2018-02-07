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
    return mongoose.model("Project").deleteOne({_id: ObjectId(id)}).exec()
  },
  get(id) {
    const Project = mongoose.model('Project');
    return Project.findById(id).exec();
  },
  list() {
    const project = mongoose.model('Project');
    return project.find({}, {name: true});
  }
};