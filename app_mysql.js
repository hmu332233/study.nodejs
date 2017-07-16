var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs'); //파일을 사용하기 위한 것

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'o2'
});

//mysql 접속
connection.connect();

//POST를 사용해도 req에서 데이터를 사용할 수 있게해줌
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.methodOverride())

app.set('views', './views_mysql');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


app.get('/topic/new',function(req,res){
    
    res.render('new.html'); 
});

app.get('/topic/:id/edit',function(req,res){
    var id = req.params.id;
    var sql = 'SELECT * FROM topic WHERE id=?'
    var params = [id]
    
    if(id){
        connection.query(sql, params, function (error, results, fields) {
          if (error) {
            res.status(500).send('Internal Server Error');
          }else{
            res.render('edit.html.ejs',{topic: results[0]} ); 
          }
        });
    } else {
        res.status(400).send('No id');
    }
    
});



app.get('/topic',function(req,res){
 
    var sql = 'SELECT * FROM topic'
    connection.query(sql, function (error, results, fields) {
      if (error) throw error;
      
      for(var i =0 ; i< results.length ; i++){
          console.log(results[i].title);
      }
      
      res.render('index.html.ejs',{topics: results});
    });
    

});


app.get('/topic/:id',function(req,res){
    var id = req.params.id;
    var sql = 'SELECT * FROM topic WHERE id=?'
    var params = [id]
    connection.query(sql, params, function (error, results, fields) {
      if (error) throw error;
      
      res.render('show.html.ejs',{topic: results[0]});
    });
});


app.post('/topic',function(req,res){
    var title = req.body.title;
    var content = req.body.content;
    
    var sql = 'INSERT INTO topic (title, content, author) VALUES(?, ?, ?)';
    var params = [title,content,'test'];
    connection.query(sql, params, function(err, results, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log(results.insertId);
        res.redirect('/topic/'+results.insertId); 
      }
    });
});



app.put('/topic/:id',function(req,res){
    
    var id = req.params.id;
    var title = req.body.title;
    var content = req.body.content;
    
    var sql = 'UPDATE topic SET title=?, content=? WHERE id=?';
    var params = [title, content, id];
    connection.query(sql, params, function(err, results, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/topic/'+id); 
      }
    });
});


app.get('/topic/:id/delete',function(req,res){
    
    var id = req.params.id;
    
    var sql = 'DELETE FROM topic WHERE id=?';
    var params = [id];
    connection.query(sql, params, function(err, rows, fields){
      if(err){
        console.log(err);
      } else {
        console.log(rows);
        res.redirect('/topic');
      }
    });


});


app.listen(process.env.PORT, function(){
   console.log('Connected, 3000 port!'); 
});

