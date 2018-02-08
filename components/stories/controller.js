"use strict";
const project = require('./projects');
const question = require('./questions');
const answer = require('./answers');
const labels = require('./labels');
const variations = require('./variations');
const perm = require('./permissions');
const {BODY, makeController} = require('../util');

module.exports = {
  // PROJECTS
  ...makeController({
      addProject: {
        action: project.add,
        params: [BODY],
        actionType: 'create',
      },
      editProject: {
        action: project.edit,
        params: ['id', BODY],
        actionType: 'edit',
      },
      deleteProject: {
        action: project.delete,
        params: ['id'],
        actionType: 'delete',
      },
      getProject: {
        action: project.get,
        params: ['id'],
      },
      listProjects: {
        action: project.list,
      },
    },
    {entityType: 'project', permissions: perm}),


  // QUESTIONS
  ...makeController({
      addQuestion: {
        action: question.add,
        params: ['pid', BODY],
        actionType: 'create',
      },
      editQuestion: {
        action: question.edit,
        params: ['pid', 'id', BODY],
        actionType: 'edit',
      },
      removeQuestion: {
        action: question.delete,
        params: ['pid', 'id'],
        actionType: 'delete',
      },
      getQuestion: {
        action: question.get,
        params: ['pid', 'id'],
      },
    },
    {entityType: 'question', permissions: perm}),

  // LABELS
  ...makeController({
      addLabel: {
        action: labels.add,
        params: ['pid', BODY],
        actionType: 'create',
      },
      editLabel: {
        action: labels.edit,
        params: ['pid', 'id', BODY],
        actionType: 'edit',
      },
      removeLabel: {
        action: labels.delete,
        params: ['pid', 'id'],
        actionType: 'delete',
      },
      getLabel: {
        action: labels.get,
        params: ['pid', 'id'],
      },
    },
    {entityType: 'label', permissions: perm}),

  // VARIATIONS
  ...makeController({
      addVariation: {
        action: variations.add,
        params: ['pid', BODY],
        actionType: 'create',
      },
      editVariation: {
        action: variations.edit,
        params: ['pid', 'id', BODY],
        actionType: 'edit',
      },
      removeVariation: {
        action: variations.delete,
        params: ['pid', 'id'],
        actionType: 'delete',
      },
      getVariation: {
        action: variations.get,
        params: ['pid', 'id'],
      },
    },
    {entityType: 'variation', permissions: perm}),

  // ANSWERS
  ...makeController({
        addAnswer: {
          action: answer.add,
          params: ['pid', 'qid', BODY],
          actionType: 'create',
        },
        editAnswer: {
          action: answer.edit,
          params: ['pid', 'qid', 'id', BODY],
          actionType: 'edit',
        },
        removeAnswer: {
          action: answer.delete,
          params: ['pid', 'qid', 'id'],
          actionType: 'delete',
        },
        getAnswer: {
          action: answer.get,
          params: ['pid', 'qid', 'id'],
        },
      },
      {entityType: 'answer', permissions: perm}),

  // LABEL TO QUESTION
  ...makeController({
        addLabelToQuestion: {
        action: labels.addToQuestion,
        params: ['pid', 'qid', 'lid'],
        actionType: 'create',
      },
      removeLabelFromQuestion: {
        action: labels.removeFromQuestion,
        params: ['pid', 'qid', 'lid'],
        actionType: 'delete',
      },
    },
    {entityType: 'questionLabel', permissions: perm}),

  // LABEL TO ANSWER
  ...makeController({
      addLabelToAnswer: {
        action: labels.addToAnswer,
        params: ['pid', 'qid', 'aid', 'lid'],
        actionType: 'create',
      },
      removeLabelFromAnswer: {
        action: labels.removeFromAnswer,
        params: ['pid', 'qid', 'aid', 'lid'],
        actionType: 'delete',
      },
    },
    {entityType: 'answerLabel', permissions: perm}),

  // VARIATION TO ANSWER
  ...makeController({
      addAnswerIntoVariation: {
        action: variations.addToAnswer,
        params: ['pid', 'qid', 'aid', 'vid'],
        actionType: 'create',
      },
      removeAnswerFromVariation: {
        action: variations.removeFromAnswer,
        params: ['pid', 'qid', 'aid', 'vid'],
        actionType: 'delete',
      },
    },
    {entityType: 'answerVariation', permissions: perm}),
};
