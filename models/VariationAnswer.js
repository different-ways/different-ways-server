"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const VariationAnswerSch = new Schema({
  aid: {
    type: ObjectId,
    required: true
  },
  vid: {
    type: ObjectId,
    required: true
  }
}, {collection: 'variationanswer'});

const VariationAnswer = mongoose.model('VariationAnswer', VariationAnswerSch);
module.exports = VariationAnswer;