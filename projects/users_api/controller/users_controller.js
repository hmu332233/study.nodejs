var users = [
  {
    id: 1,
    name: 'alice'
  },
  {
    id: 2,
    name: 'bek'
  },
  {
    id: 3,
    name: 'chris'
  }
];

exports.index = function (req, res) {
  res.json(users);
};

exports.show = function (req, res) {
  var id = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(400).json({error: 'Incorrect id'});
  }
  
  var user = users.filter(function(user){
    return user.id === id
  });
  
  if(!user){
    console.log(res.status(400).json({error: 'Unknown user'}));
    return;
  }
  res.json(user);
};

exports.create = function (req, res) {
  var name = req.body.name;
  console.log(name);
  
  if (!name.length) {
    return res.status(400).json({error: 'Incorrenct name'});
  }
  
  var id = users.reduce((maxId, user) => {
   return user.id > maxId ? user.id : maxId
  }, 0) + 1;
  
  var new_user = {
    id: id,
    name: name
  };
  
  users.push(new_user);
  return res.status(201).json(new_user);
};

exports.destory = function (req, res) {
  var id = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(400).json({error: 'Incorrect id'});
  }
  
  var userIdx = users.findIndex(function (user){
    return user.id === id;
  });
  if (userIdx === -1) {
    return res.status(404).json({error: 'Unknown user'});
  }

  users.splice(userIdx, 1);
  //서버에서 성공했는데 응답할 바디가 없을 경우 204
  res.status(204).send();
};


// exports.new = function (req, res) {
    
// };

// exports.edit = function (req, res) {
    
// };

// exports.update = function (req, res) {
    
// };
