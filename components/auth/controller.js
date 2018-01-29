"use strict";
const users = require('./users');

module.exports = {
  addUser(req, res) {
    users.add(req.body).then(user => res.json(user)).catch(err => res.status(500).json(err));
  },
  editUser(req, res) {
    users.edit(req.params.id, req.body).then(user => res.json(user)).catch(err => res.status(500).json(err));
  },
  deleteUser(req, res) {
    users.delete(req.params.id).then(result => res.json(result)).catch(err => res.status(500).json(err));
  },
  getUser(req, res) {
    users.get(req.params.id).then(user => res.json(user)).catch(err => res.status(500).json(err));
  },
  getUsers(req, res) {
    users.getAll().then(users => res.json(users)).catch(err => res.status(500).json(err));
  },
  listUsers(req, res) {

  },
  login(req, res) {

  },
  logout(req, res) {

  },
  addRole(req, res) {

  },
  editRole(req, res) {

  },
  deleteRole(req, res) {

  },
  getRole(req, res) {

  },
  getRoles(req, res) {

  },
  addRoleToUser(req, res) {

  },
  removeRoleFromUser(req, res) {

  },
};