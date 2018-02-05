const project = require('./projects');
const question = require('./questions');
const answer = require('./answers');
const labels = require('./labels');
const variations = require('./variations');

class Stories {
  constructor(app) {
    this.app = app;
    this.project = project;
    this.questions = question;
    this.answers = answer;
    this.labels = labels;
    this.variations = variations;
  }

  init() {

  }
}

module.exports = Stories;