var User = require("../models/user");

exports.create = function (req, res) {
  var user = new User(req.body);
  
  user.save(function (err, doc){
    if(err) return res.status(500).send(err);
    res.send("User saved successfully:\n" + doc);
  });
};

exports.findAll = function (req, res) {
  
  User.find({}, function(err, users){
    if(err) return res.status(500).send(err);
    if(!users.length) return res.status(404).send({err: "User not found"});
    res.send("User find successfully:\n" + users);
  });
    
};

exports.findOne = function (req, res) {
  
  var id = req.params.id;
  console.log(id);
  
  User.findById(id, function (err, user) {
    if(err) return res.status(500).send(err);
    if(!user) return res.status(404).send({ err: "User not found"});
    res.send("User find successfully:\n" + user);
  });
    
};

exports.findByName = function (req, res) {
  var username = req.params.username;
  console.log(username);
  
  User.findOne({ "name": username }, function (err, user) {
    if(err) return res.status(500).send(err);
    if(!user) return res.status(404).send({ err: "User not found"});
    res.send("User find successfully:\n" + user);
  });
  
};

exports.findByIdAndUpdate = function (req, res) {
  
  var id = req.params.id;
  
  User.findByIdAndUpdate(id, req.body, {new: true}, function (err, user) {
    if(err) return res.status(500).send(err);
    res.send("User findByIdAndUpdate successfully:\n" + user);
  });
};

exports.findByNameAndUpdate = function (req, res) {
  
  var name = req.params.username;
  
  User.findOneAndUpdate({ "name": name }, req.body, {new: true}, function (err, user){
    if(err) return res.status(500).send(err);
    res.send("User findOneUpdate successfully:\n" + user);
  });
};

exports.delete = function (req, res) {
    
};

exports.deleteAll = function(req, res) {
    
};