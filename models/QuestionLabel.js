"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const QuestionLabelSch = new Schema({
  qid: {
    type: ObjectId,
    required: true
  },
  lid: {
    type: ObjectId,
    required: true
  }
}, {collection: 'questionlabel'});

const QuestionLabel = mongoose.model('QuestionLabel', QuestionLabelSch);
module.exports = QuestionLabel;