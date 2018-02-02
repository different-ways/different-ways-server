"use strict";
const project = require('./projects');
const question = require('./questions');
const answer = require('./answers');
const labels = require('./labels');
const variations = require('./variations');

module.exports = {
  addProject(req, res) {
    project.add(req.body).then(pr => res.json(pr))
  },
  editProject(req, res) {
    project.edit(req.params.id, req.body).then(pr => res.json(pr));
  },
  deleteProject(req, res) {
    project.delete(req.params.id)
        .then(result => res.json(result))
        .catch(err => res.status(err.status || 500).json(err));
  },
  getProject(req, res) {
    const pr = project.get(req.params.id);
    pr.then(pr =>{
      res.json(pr[0])
    })
  },
  listProjects(req, res) {
    project.list().then(prs => res.json(prs))
  },
  addQuestion(req, res) {
    question.add(req.params.pid, req.body).then(q => res.json(q));
  },
  editQuestion(req, res) {
    question.edit(req.params.pid, req.params.id, req.body).then(q => res.json(q));
  },
  removeQuestion(req, res) {
    question.delete(req.params.pid, req.params.id).then(q => res.json(q));
  },
  getQuestion(req, res) {
    const pr = question.get(req.params.pid, req.params.id);
    pr.then(q =>{
      res.json(q[0])
    })

  },
  addLabel(req, res) {
    labels.add(req.params.pid, req.body)
        .then(label => res.json(label))
        .catch(err => {console.error(err); res.status(err.status || 500).json(err) });
  },
  editLabel(req, res) {
    labels.edit(req.params.pid, req.params.id, req.body)
        .then(label => res.json(label))
        .catch(err => res.status(err.status || 500).json(err));
  },
  removeLabel(req, res) {
    labels.delete(req.params.pid, req.params.id)
        .then(label => res.json(label))
        .catch(err => res.status(err.status || 500).json(err));
  },
  getLabel(req, res) {
    labels.get(req.params.pid, req.params.id)
        .then(label => res.json(label))
        .catch(err => res.status(err.status || 500).json(err));
  },
  addVariation(req, res) {

  },
  editVariation(req, res) {

  },
  removeVariation(req, res) {

  },
  getVariation(req, res) {

  },
  addAnswer(req, res) {
    answer.add(req.params.pid, req.params.qid, req.body).then(a => res.json(a));
  },
  editAnswer(req, res) {
    answer.edit(req.params.pid, req.params.qid, req.params.id, req.body).then(a => res.json(a));
  },
  removeAnswer(req, res) {
    answer.delete(req.params.pid, req.params.qid, req.params.id).then(pr => res.json(pr));
  },
  getAnswer(req, res) {
    answer.get(req.params.pid, req.params.qid, req.params.id).then(a => res.json(a));
  },
  addLabelToQuestion(req, res) {

  },
  removeLabelFromQuestion(req, res) {

  },
  addLabelToAnswer(req, res) {

  },
  removeLabelFromAnswer(req, res) {

  },
  addAnswerIntoVariation(req, res) {

  },
  removeAnswerFromVariation(req, res) {

  },

};
