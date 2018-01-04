"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSch = new Schema({
  text: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true,
    default: ''
  }
});

const QuestionSch = new Schema({
  text: {
    type: String,
    required: true
  },
  answers: [AnswerSch]
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