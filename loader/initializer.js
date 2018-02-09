"use strict";
const mongoose = require('mongoose');
const config = require('../config/environment-example');
const loader = require('./componentLoader');

function init(app, socketio) {
  app.cwd = process.cwd();

  app.models = {};
  app.db = mongoose.connection;
  app.components = {};
  app.routes = {};
  if (socketio) {
    app.messageHandlers = {};
  }

  mongoose.connect(config.mongoUrl);

  return new Promise((resolve, reject) => {
    app.db.once('open', (err) => {
      if (err) {
        console.error("Could not connect to database");
        console.error(err);
        return reject(err);
      }
      // dynamically load app components
      loader.loadComponents(app, socketio);
      resolve();
    });
  });
}

module.exports = {
  init
};