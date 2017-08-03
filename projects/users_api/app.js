const express = require('express');
const app = express();


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

/*외부에서 접근 가능*/
app.use(express.static('public'));

app.get('/users', function (req, res){
  res.json(users);
});

app.get('/users/:id', function(req, res){
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
});

app.listen(process.env.PORT, function (){
   console.log('server start!'); 
});