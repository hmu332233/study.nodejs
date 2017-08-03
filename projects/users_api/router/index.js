var express = require('express');
var router = express.Router();

var users_controller = require('../controller/users.controller.js');


router.post("/users", users_controller.create );
router.get("/users", users_controller.findAll );
router.get("/users/username/:username", users_controller.findByName );
router.get("/users/:id", users_controller.findOne ) ;
router.put("/users/:id", users_controller.findByIdAndUpdate );
router.put("/users/username/:username", users_controller.findByNameAndUpdate );
router.delete("/users/", users_controller.deleteAll );
router.delete("/users/username/:username", users_controller.delete );


module.exports = router;