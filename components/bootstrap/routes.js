const express = require('express');
const router = express.Router();
const controller = require("./controller");

router.get('/first-time', controller.isFirstTime);
router.post('/do-bootstrap', controller.bootstrap);

module.exports = router;