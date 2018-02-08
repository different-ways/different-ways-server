"use strict";
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  BODY: {req: 'body'},
  checkPermission(req, res, action, entityType, perm) {
    const accept = req.app.components.auth.can(perm, req.user, action, entityType);
    if (!accept) {
      res.status(403).json({msg: 'Not allowed'});
    }
    return accept;
  },
  strToObjectId(res, strIds) {
    try {
      return strIds.map(ObjectId);
    } catch (err) {
      res.status(400).json({status: 400, msg: "Invalid ObjectId", payload: strIds});
      return [];
    }
  },
  sendResponse(promise, res, successCode=200) {
    promise
        .then(result => res.status(successCode).json(result))
        .catch(err => res.status(err.status || 500).json(err));
  },
  makeSingleController({action, params=[], actionType='view', entityType, permissions=null, successCode=200}) {
    let m = module.exports;
    return (req, res) => {
      const actionParams = [];
      for (const param of params) {
        if (typeof param === 'string') {
          try {
            actionParams.push(ObjectId(req.params[param]))
          } catch (err) {
            res.status(400).json({status: 400, msg: "Invalid ObjectId", val: req.params[param]});
          }
        } else if (typeof param === 'object') {
          if (param.req) {
            actionParams.push(req[param.req]);
          } else if (param.val) {
            actionParams.push(param.val);
          }
        } else {
          actionParams.push(null);
        }
      }
      if (permissions) {
        if (!m.checkPermission(req, res, actionType, entityType, permissions)) return;
      }
      return m.sendResponse(action(...actionParams), res, successCode)
    }
  },
  makeController(handlers, defaults) {
    const controller = {};
    for (let [handlerName, handler] of Object.entries(handlers)) {
      handler = Object.assign({}, defaults, handler);
      controller[handlerName] = module.exports.makeSingleController(handler);
    }
    return controller;
  }
};