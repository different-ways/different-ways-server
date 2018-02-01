"use strict";
const users = require('./users');
const roles = require('./roles');
const auth = require('./auth');

module.exports = {
  addUser(req, res) {
    users.add(req.body)
        .then(user => res.json(user)).catch(err => res.status(500).json(err));
  },
  editUser(req, res) {
    users.edit(req.params.id, req.body)
        .then(user => res.json(user)).catch(err => res.status(500).json(err));
  },
  deleteUser(req, res) {
    users.delete(req.params.id)
        .then(result => res.json(result)).catch(err => res.status(500).json(err));
  },
  getUser(req, res) {
    users.get(req.params.id)
        .then(user => res.json(user)).catch(err => res.status(500).json(err));
  },
  me(req, res) {
    if (!req.user) {
      return res.status(403).json({msg: 'Not authenticated'})
    }
    delete req.user.password;
    req.user.capabilities = [...req.user.capabilities];
    return res.json(req.user)
  },
  getUsers(req, res) {
    users.getAll()
        .then(users => res.json(users)).catch(err => res.status(500).json(err));
  },
  listUsers(req, res) {
    users.list()
        .then(users => res.json(users)).catch(err => res.status(500).json(err));
  },
  login(req, res) {
    auth.login(req.body.username_or_email, req.body.password)
        .then(user => res.json(user)).catch(err => res.status(500).json(err));
  },
  logout(req, res) {
    res.json({})
  },
  addRole(req, res) {
    roles.add(req.body)
        .then(role => res.json(role)).catch(err => res.status(500).json(err));
  },
  editRole(req, res) {
    roles.edit(req.params.id, req.body)
        .then(role => res.json(role)).catch(err => res.status(500).json(err));
  },
  deleteRole(req, res) {
    roles.delete(req.params.id)
        .then(result => res.json(result)).catch(err => res.status(500).json(err));
  },
  getRole(req, res) {
    roles.get(req.params.id)
        .then(role => res.json(role)).catch(err => res.status(500).json(err));
  },
  getRoles(req, res) {
    roles.getAll()
        .then(roles => res.json(roles)).catch(err => res.status(500).json(err));
  },
  addRoleToUser(req, res) {
    roles.addToUser(req.params.uid, req.params.rid)
        .then(result => res.json(result)).catch(err => res.status(500).json(err));
  },
  removeRoleFromUser(req, res) {
    roles.removeFromUser(req.params.uid, req.params.rid)
        .then(result => res.json(result)).catch(err => res.status(500).json(err));
  },
};