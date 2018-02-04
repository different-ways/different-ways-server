"use strict";
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const initializer = require('./loader/initializer');
const enviroment = require('./config/environment');

const app = express();

app.use(cors({origin: enviroment.corsOrigin}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

initializer.init(app).then(() => {
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(function(err, req, res, next) {
    const errorInfo = {};
    errorInfo.message = err.message;
    errorInfo.error = req.app.get('env') === 'development' ? err : {};
    errorInfo.status = err.status || 500;
    res.json(errorInfo);
  });
});

module.exports = app;
