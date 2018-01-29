const express = require('express');
const router = express.Router();
const controller = require("./controller");

router.post('/user', controller.addUser);
router.patch('/user/:id', controller.editUser);
router.delete('/user/:id', controller.deleteUser);
router.get('/user/:id', controller.getUser);
router.get('/user', controller.getUsers);
router.get('/userList', controller.listUsers);

router.post('/login', controller.login);
router.post('/logout', controller.logout);

router.post('/role', controller.addRole);
router.patch('/role/:id', controller.editRole);
router.delete('/role/:id', controller.deleteRole);
router.get('/role/:id', controller.getRole);
router.get('/role', controller.getRoles);
// router.get('/auth/roleList', controller.listRoles);

router.post('/roleUser/:uid/:rid', controller.addRoleToUser);
router.delete('/roleUser/:uid/:rid', controller.removeRoleFromUser);

module.exports = router;