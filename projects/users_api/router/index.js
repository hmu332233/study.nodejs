var express = require('express');
var router = express.Router();

var users_controller = require('../controller/users_controller.js');

router.get('/users', users_controller.index);
router.get('/users/:id', users_controller.show);
router.post('/users', users_controller.create);
router.delete('/users/:id', users_controller.destory);

module.exports = router;