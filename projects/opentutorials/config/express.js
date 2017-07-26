module.exports = function(){
    
  var express = require('express')
  var app = express()
  var session = require('express-session')
  var bodyParser = require('body-parser')
  var MySQLStore = require('express-mysql-session')(session);
 
  //----view-----------
  var engine = require('ejs-locals');

  app.set('views', 'views');
  app.set('view engine', 'ejs');
  app.engine('ejs', engine);
  //-------------------
  
  app.use(bodyParser.json()) // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
  
  var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'o2'
  };
  
  app.use(session({
    secret: '123456', // 암호화 key값
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore(options)
  }));
    
  return app;
}