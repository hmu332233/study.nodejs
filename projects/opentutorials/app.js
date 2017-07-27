var app = require('./config/express')()

// passport
var passport = require('./config/passport')(app)

app.get('/welcome', function (req, res) {
  if (req.user) {
    res.send(`
      <h1>welcome, ${req.user.displayName}</h1>
      <a href='/auth/logout'>logout</a>
    `)
  } else {
    res.send(`
      <h1>welcome</h1>
      <li><a href='/auth/login'>login</a></li>
      <li><a href='/auth/register'>register</a></li>
    `)
  }
})

app.get('/new', function (req, res) {
  console.log('test')
  res.render('topic/new.html.ejs')
})

// route
var auth = require('./routes/auth')(passport)
app.use('/auth', auth)

var topic = require('./routes/topic')()
app.use('/topic', topic)

app.listen(process.env.PORT, function () {
  console.log('Connected!')
})
