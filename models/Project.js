"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const AnswerSch = new Schema({
  text: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    default: ''
  },
  labels: {
    required: true,
    default: [],
    type: [{lid: ObjectId, _id : false}]
  },
  variations: {
    required: true,
    default: [],
    type: [{vid: ObjectId, _id : false}]
  }
});

const QuestionSch = new Schema({
  text: {
    type: String,
    required: true
  },
  answers: {
    required: true,
    default: [],
    type: [AnswerSch]
  },
  labels: {
    required: true,
    default: [],
    type: [{lid: ObjectId, _id : false}]
  },
});

const LabelSch = new Schema({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true,
    default: "midnightblue"
  }
});

const VariationSch = new Schema({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true,
    default: "midnightblue"
  }
});

const ProjectSch = new Schema({
  name: {
    type: String,
    required: true
  },
  questions: [QuestionSch],
  labels: [LabelSch],
  variations: [VariationSch]
}, {collection: 'project'});

const Project = mongoose.model('Project', ProjectSch);
module.exports = Project;