var express = require('express');
var app = express();


app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


app.get('/topic',function(req,res){
//   res.json(req.query); 
    var topics = ['JS','Nodejs','Express']
    var id = req.query.id
    
    var output = `
      <a href="/topic?id=0">JavaScript</a><br>
      <a href="/topic?id=1">Nodejs</a><br>
      <a href="/topic?id=2">Express</a><br><br>
      ${topics[id]}
      `
    
    res.send(output);
});

app.get('/topic/:id',function(req,res){
//   res.json(req.query); 
    var topics = ['JS','Nodejs','Express']
    var id = req.params.id
    
    var output = `
      <a href="/topic/0">JavaScript</a><br>
      <a href="/topic/1">Nodejs</a><br>
      <a href="/topic/2">Express</a><br><br>
      ${topics[id]}
      `
    
    // res.send(output);
    res.send(req.params.id);
});

app.get('/test/:id/:mode',function(req,res){
//   res.json(req.query); 
    var id = req.params.id
    var mode = req.params.mode
    res.send(id + "," + mode);
});

app.listen(process.env.PORT, function(){
    console.log("Express server has started on port 3000")
});

