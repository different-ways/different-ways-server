"use strict";
const users = require('./users');
const roles = require('./roles');
const auth = require('./auth');
const perm = require('./permissions');

function checkPermission(req, res, action, entityType) {
  const accept = req.app.components.auth.can(perm, req.user, action, entityType);
  if (!accept) {
    res.status(403).json({msg: 'Not allowed'});
  }
  return accept;
}

module.exports = {
  addUser(req, res) {
    if (!checkPermission(req, res, 'create', 'user')) return;
    users.add(req.body)
        .then(user => res.json(user))
        .catch(err => res.status(err.status || 500).json(err));
  },
  editUser(req, res) {
    if (!checkPermission(req, res, 'edit', 'user')) return;
    users.edit(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(err => res.status(err.status || 500).json(err));
  },
  deleteUser(req, res) {
    if (!checkPermission(req, res, 'delete', 'user')) return;
    users.delete(req.params.id)
        .then(result => res.json(result))
        .catch(err => res.status(err.status || 500).json(err));
  },
  getUser(req, res) {
    if (!checkPermission(req, res, 'view', 'user')) return;
    users.get(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(err.status || 500).json(err));
  },
  me(req, res) {
    if (!checkPermission(req, res, 'view', 'me')) return;
    if (!req.user) {
      return res.status(403).json({msg: 'Not authenticated'})
    }
    delete req.user.password;
    req.user.capabilities = [...req.user.capabilities];
    return res.json(req.user)
  },
  getUsers(req, res) {
    if (!checkPermission(req, res, 'view', 'user')) return;
    users.getAll()
        .then(users => res.json(users))
        .catch(err => res.status(err.status || 500).json(err));
  },
  listUsers(req, res) {
    if (!checkPermission(req, res, 'view', 'user')) return;
    users.list()
        .then(users => res.json(users))
        .catch(err => res.status(err.status || 500).json(err));
  },
  login(req, res) {
    if (!checkPermission(req, res, 'auth', 'me')) return;
    auth.login(req.body.username_or_email, req.body.password)
        .then(user => res.json(user))
        .catch(err => res.status(err.status || 500).json(err));
  },
  logout(req, res) {
    if (!checkPermission(req, res, 'auth', 'me')) return;
    res.json({})
  },
  addRole(req, res) {
    if (!checkPermission(req, res, 'create', 'role')) return;
    roles.add(req.body)
        .then(role => res.json(role))
        .catch(err => res.status(err.status || 500).json(err));
  },
  editRole(req, res) {
    if (!checkPermission(req, res, 'edit', 'role')) return;
    roles.edit(req.params.id, req.body)
        .then(role => res.json(role))
        .catch(err => res.status(err.status || 500).json(err));
  },
  deleteRole(req, res) {
    if (!checkPermission(req, res, 'delete', 'role')) return;
    roles.delete(req.params.id)
        .then(result => res.json(result))
        .catch(err => res.status(err.status || 500).json(err));
  },
  getRole(req, res) {
    if (!checkPermission(req, res, 'view', 'role')) return;
    roles.get(req.params.id)
        .then(role => res.json(role))
        .catch(err => res.status(err.status || 500).json(err));
  },
  getRoles(req, res) {
    if (!checkPermission(req, res, 'view', 'role')) return;
    roles.getAll()
        .then(roles => res.json(roles))
        .catch(err => res.status(err.status || 500).json(err));
  },
  addRoleToUser(req, res) {
    if (!checkPermission(req, res, 'create', 'userRole')) return;
    roles.addToUser(req.params.uid, req.params.rid)
        .then(result => res.json(result))
        .catch(err => res.status(err.status || 500).json(err));
  },
  removeRoleFromUser(req, res) {
    if (!checkPermission(req, res, 'delete', 'userRole')) return;
    roles.removeFromUser(req.params.uid, req.params.rid)
        .then(result => res.json(result))
        .catch(err => res.status(err.status || 500).json(err));
  },
};