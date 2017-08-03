var express = require('express');
var router = express.Router();

var users_controller = require('../controller/users.controller.js');

// Create
router.post("/users", users_controller.create );

// Find All
router.get("/users", users_controller.findAll );

// Find One
router.get("/users/username/:username", users_controller.findOne );

// Find By Name
router.get("/users/:id", users_controller.findByName ) ;

// GET A USER, THEN UPDATE
router.put("/users/:id", users_controller.findByIdAndUpdate );

// FIND BY ID AND UPDATE
router.put("/users/:id", users_controller.findByNameAndUpdate );

// FIND AND UPDATE
router.put("/users/username/:username", users_controller.findByNameAndUpdate );

// REMOVE ALL
router.delete("/users/", users_controller.deleteAll );

// FIND AND REMOVE
router.delete("/users/username/:username", users_controller.delete );


module.exports = router;