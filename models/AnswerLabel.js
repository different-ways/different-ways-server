"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const AnswerLabelSch = new Schema({
  aid: {
    type: ObjectId,
    required: true
  },
  lid: {
    type: ObjectId,
    required: true
  }
}, {collection: 'answerlabel'});

const AnswerLabel = mongoose.model('AnswerLabel', AnswerLabelSch);
module.exports = AnswerLabel;