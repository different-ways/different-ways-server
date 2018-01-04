"use strict";
const project = require('./projects');
const question = require('./questions');

module.exports = {
  addProject(req, res) {
    project.add(req.body).then(pr => res.json(pr))
  },
  editProject(req, res) {
    project.edit(req.params.id, req.body).then(pr => res.json(pr));
  },
  deleteProject(req, res) {

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

  },
  removeQuestion(req, res) {

  },
  getQuestion(req, res) {
    const pr = question.get(req.params.pid, req.params.id);
    pr.then(q =>{
      res.json(q[0])
    })

  },
  addLabel(req, res) {

  },
  editLabel(req, res) {

  },
  removeLabel(req, res) {

  },
  getLabel(req, res) {

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

  },
  editAnswer(req, res) {

  },
  removeAnswer(req, res) {

  },
  getAnswer(req, res) {

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
