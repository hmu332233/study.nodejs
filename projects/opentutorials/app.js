var express = require('express')
var app = express()
var session = require('express-session')
var bodyParser = require('body-parser')
var bkfd2Password = require("pbkdf2-password")
var hasher = bkfd2Password();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  ,FacebookStrategy = require('passport-facebook').Strategy;

var MySQLStore = require('express-mysql-session')(session);
 
//----view-----------
var engine = require('ejs-locals');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('ejs', engine);
//-------------------
var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'o2'
};

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'o2'
});

//mysql 접속
connection.connect();

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(session({
  secret: '123456', // 암호화 key값
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore(options)
}));

app.use(passport.initialize());
app.use(passport.session());



app.get('/auth/login', function (req, res){
  res.render('auth/login.html.ejs');
})


//여기서 정의한 함수가 사용자 인증에 사용된다
passport.use(new LocalStrategy(
  function(username, pwd, done) {

    var sql = 'SELECT * FROM users WHERE authId=?';
    connection.query(sql, ['local:'+username],function(err, results) {
        // console.log(results);
        if(err && results.size > 0){
            console.log('err');
            return done('There is no user.');
        }
        
        var user = results[0];

        var opts = {
          password: pwd,
          salt: user.salt
        }
        
        return hasher(opts, function(err, pass, salt, hash) {
          if(hash === user.password){
            console.log('LocalStrategy',user);
            done(null, user);
          } else {
            done(null,false);
          }
        })
    });

  }
));

passport.use(new FacebookStrategy({
    clientID: 'test',
    clientSecret: 'test',
    callbackURL: '/auth/facebook/callback',
    profileFields:['displayName','email']
  },
  function(accessToken, refreshToken, profile, done) {
    
    console.log(profile);
    var authId = 'facebook:'+profile.id;
    var sql = 'SELECT * FROM users WHERE authId=?';
    connection.query(sql,[authId], function(err, results) {
        
        //사용자가 있다면
        if(results.size > 0){
            done(null,results[0])
        } else {
        //사용자가 없다면
            var new_user = {
              'authId': authId,
              'displayName': profile.displayName,
              'email': 'test'
            }
        
            var sql = 'INSERT INTO users SET ?'
            connection.query(sql,new_user,function(err, results) {
                if(err){
                    console.log(err);
                    done('err');
                } else {
                    done(null,new_user);    
                }
            })
        }
    })

  }
));


passport.serializeUser(function(user, done) {
  console.log('serializeUser',user);
  done(null, user.authId);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser',id);
  
  var sql = 'SELECT * FROM users WHERE authId=?';
  connection.query(sql,[id],function(err, results) {
    //   console.log(results);
      if(err){
          console.log(err);
          done('err');
      } else {
        //   console.log('login!');
          done(null, results[0]);
      }
  });
  
});


app.post( '/auth/login',  
          passport.authenticate(
            //local 이라는 인증 방식이 사용됨 만약 facebook을 사용중이면 facebook을 입력하면된다.
            'local', 
            { 
              //로그인에 성공하면 redirect 되는 url
              successRedirect: '/welcome',
              //로그인에 실패하면 redirect 되는 url
              failureRedirect: '/auth/login',
              //실패했을 시, 메세지를 띄우기 위함
              failureFlash: false 
            }
          )
);

app.get( '/auth/facebook',
          passport.authenticate('facebook',{ scope: 'email' })
);
          
app.get( '/auth/facebook/callback',
          passport.authenticate(
            'facebook',
            { 
              successRedirect: '/welcome',
              failureRedirect: '/auth/login' 
            }
          )
);
          

app.get('/auth/register', function (req, res){
  res.render('auth/register.html.ejs');
})

app.post('/auth/register', function (req, res,next){
  
  var opts = {
    password: req.body.password
  }
  
  hasher(opts, function(err, pass, _salt, hash) {
    var user = {
      authId: 'local:'+req.body.username,
      username: req.body.username,
      password: hash,
      displayName: req.body.displayName,
      salt: _salt
    }
    
    
    //sql문을 일일이 작성할 필요없이 다음과 같이 객체만 넣으면 자동으로 넣어준다.
    var sql = 'INSERT INTO users SET ?'
    connection.query(sql, user, function(err, results){
        if(err){
            console.log(err);
            res.status(500);
        } else {
            req.login(user,function(err){
            if(err) return next(err);
                return res.redirect('/welcome')
            });
        }
    });
    
    })
})

app.get('/welcome', function (req, res) {
  
  if(req.user)  
    res.send(`
      <h1>welcome, ${req.user.displayName}</h1>
      <a href='/auth/logout'>logout</a>
    `)
  else
    res.send(`
      <h1>welcome</h1>
      <li><a href='/auth/login'>login</a></li>
      <li><a href='/auth/register'>register</a></li>
    `)
})

app.get('/auth/logout', function (req, res){
  req.logout();
  req.session.save(function(){
    res.redirect('/welcome');  
  });
})


app.listen(process.env.PORT, function () {
  console.log('Connected!')
})
