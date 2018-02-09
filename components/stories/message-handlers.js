"use strict";
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Stories = require('./index');

module.exports = {
  'follow-project'({user, socket, component}, {pid}, ack) {
    try {
      pid = ObjectId(pid);
      component.project.get(pid)
          .then(project => {
            if (!project) {
              return ack({error: {status: 404, msg: "Not found"}})
            }
            ack({data: project});
            socket.join(`stories/project/${pid}`);
          })
          .catch(err => ack({error: {status: err.status || 500, msg: err.msg}}));

    } catch (err) {
      return ack({error: {status: 400, msg: "invalid ObjectId "+pid}})
    }
  }
};