"use strict";
const project = require('./projects');
const question = require('./questions');
const answer = require('./answers');
const labels = require('./labels');
const variations = require('./variations');
const perm = require('./permissions');

function checkPermission(req, res, action, entityType) {
  const accept = req.app.components.auth.can(perm, req.user, action, entityType);
  if (!accept) {
    res.status(403).json({msg: 'Not allowed'});
  }
  return accept;
}

module.exports = {
  addProject(req, res) {
    if (!checkPermission(req, res, 'create', 'project')) return;
    project.add(req.body)
        .then(pr => res.json(pr))
        .catch(err => res.status(err.status || 500).json(err));
  },
  editProject(req, res) {
    if (!checkPermission(req, res, 'edit', 'project')) return;
    project.edit(req.params.id, req.body)
        .then(pr => res.json(pr));
  },
  deleteProject(req, res) {
    if (!checkPermission(req, res, 'delete', 'project')) return;
    project.delete(req.params.id)
        .then(result => res.json(result))
        .catch(err => res.status(err.status || 500).json(err));
  },
  getProject(req, res) {
    if (!checkPermission(req, res, 'view', 'project')) return;
    project.get(req.params.id)
        .then(pr => res.json(pr[0]))
        .catch(err => res.status(err.status || 500).json(err));
  },
  listProjects(req, res) {
    if (!checkPermission(req, res, 'view', 'project')) return;
    project.list()
        .then(prs => res.json(prs))
        .catch(err => res.status(err.status || 500).json(err));
  },
  addQuestion(req, res) {
    if (!checkPermission(req, res, 'create', 'question')) return;
    question.add(req.params.pid, req.body)
        .then(q => res.json(q))
        .catch(err => res.status(err.status || 500).json(err));
  },
  editQuestion(req, res) {
    if (!checkPermission(req, res, 'edit', 'question')) return;
    question.edit(req.params.pid, req.params.id, req.body)
        .then(q => res.json(q))
        .catch(err => res.status(err.status || 500).json(err));
  },
  removeQuestion(req, res) {
    if (!checkPermission(req, res, 'delete', 'question')) return;
    question.delete(req.params.pid, req.params.id)
        .then(q => res.json(q))
        .catch(err => res.status(err.status || 500).json(err));
  },
  getQuestion(req, res) {
    if (!checkPermission(req, res, 'view', 'question')) return;
    question.get(req.params.pid, req.params.id)
        .then(q => res.json(q[0]))
        .catch(err => res.status(err.status || 500).json(err));
  },
  addLabel(req, res) {
    if (!checkPermission(req, res, 'create', 'label')) return;
    labels.add(req.params.pid, req.body)
        .then(label => res.json(label))
        .catch(err => {console.error(err); res.status(err.status || 500).json(err) });
  },
  editLabel(req, res) {
    if (!checkPermission(req, res, 'edit', 'label')) return;
    labels.edit(req.params.pid, req.params.id, req.body)
        .then(label => res.json(label))
        .catch(err => res.status(err.status || 500).json(err));
  },
  removeLabel(req, res) {
    if (!checkPermission(req, res, 'delete', 'label')) return;
    labels.delete(req.params.pid, req.params.id)
        .then(label => res.json(label))
        .catch(err => res.status(err.status || 500).json(err));
  },
  getLabel(req, res) {
    if (!checkPermission(req, res, 'view', 'label')) return;
    labels.get(req.params.pid, req.params.id)
        .then(label => res.json(label))
        .catch(err => res.status(err.status || 500).json(err));
  },
  addVariation(req, res) {
    if (!checkPermission(req, res, 'create', 'variation')) return;
    variations.add(req.params.pid, req.body)
        .then(label => res.json(label))
        .catch(err => {console.error(err); res.status(err.status || 500).json(err) });
  },
  editVariation(req, res) {
    if (!checkPermission(req, res, 'edit', 'variation')) return;
    variations.edit(req.params.pid, req.params.id, req.body)
        .then(label => res.json(label))
        .catch(err => res.status(err.status || 500).json(err));
  },
  removeVariation(req, res) {
    if (!checkPermission(req, res, 'delete', 'variation')) return;
    variations.delete(req.params.pid, req.params.id)
        .then(label => res.json(label))
        .catch(err => res.status(err.status || 500).json(err));
  },
  getVariation(req, res) {
    if (!checkPermission(req, res, 'view', 'variation')) return;
    variations.get(req.params.pid, req.params.id)
        .then(label => res.json(label))
        .catch(err => res.status(err.status || 500).json(err));
  },
  addAnswer(req, res) {
    if (!checkPermission(req, res, 'create', 'answer')) return;
    answer.add(req.params.pid, req.params.qid, req.body)
        .then(a => res.json(a))
        .catch(err => res.status(err.status || 500).json(err));
  },
  editAnswer(req, res) {
    if (!checkPermission(req, res, 'edit', 'answer')) return;
    answer.edit(req.params.pid, req.params.qid, req.params.id, req.body)
        .then(a => res.json(a))
        .catch(err => res.status(err.status || 500).json(err));
  },
  removeAnswer(req, res) {
    if (!checkPermission(req, res, 'delete', 'answer')) return;
    answer.delete(req.params.pid, req.params.qid, req.params.id)
        .then(pr => res.json(pr))
        .catch(err => res.status(err.status || 500).json(err));
  },
  getAnswer(req, res) {
    if (!checkPermission(req, res, 'view', 'answer')) return;
    answer.get(req.params.pid, req.params.qid, req.params.id)
        .then(a => res.json(a))
        .catch(err => res.status(err.status || 500).json(err));
  },
  addLabelToQuestion(req, res) {
    if (!checkPermission(req, res, 'create', 'questionLabel')) return;
    labels.addToQuestion(req.params.qid, req.params.lid)
        .then(label => res.json(label))
        .catch(err => res.status(err.status || 500).json(err));
  },
  removeLabelFromQuestion(req, res) {
    if (!checkPermission(req, res, 'delete', 'questionLabel')) return;
    labels.removeFromQuestion(req.params.qid, req.params.lid)
        .then(label => res.json(label))
        .catch(err => res.status(err.status || 500).json(err));
  },
  addLabelToAnswer(req, res) {
    if (!checkPermission(req, res, 'create', 'answerLabel')) return;
    labels.addToAnswer(req.params.aid, req.params.lid)
        .then(label => res.json(label))
        .catch(err => res.status(err.status || 500).json(err));
  },
  removeLabelFromAnswer(req, res) {
    if (!checkPermission(req, res, 'delete', 'answerLabel')) return;
    labels.removeFromAnswer(req.params.aid, req.params.lid)
        .then(label => res.json(label))
        .catch(err => res.status(err.status || 500).json(err));
  },
  addAnswerIntoVariation(req, res) {
    if (!checkPermission(req, res, 'create', 'answerVariation')) return;
    variations.addToAnswer(req.params.aid, req.params.vid)
        .then(label => res.json(label))
        .catch(err => res.status(err.status || 500).json(err));
  },
  removeAnswerFromVariation(req, res) {
    if (!checkPermission(req, res, 'delete', 'answerVariation')) return;
    variations.removeFromAnswer(req.params.aid, req.params.vid)
        .then(label => res.json(label))
        .catch(err => res.status(err.status || 500).json(err));
  },

};
