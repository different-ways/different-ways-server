"use strict";

module.exports = {
  isFirstTime(req, res) {
    req.app.components.bootstrap.isFirstTime()
        .then(result => res.json(result))
        .catch(err => res.status(err.status || 500).json(err));
  },
  bootstrap(req, res) {
    req.app.components.bootstrap.doBootstrap(req.body)
        .then(result => res.json(result))
        .catch(err => res.status(err.status || 500).json(err));
  },
};