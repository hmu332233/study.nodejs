// 외부에서 쓸 수 있도록 넘김
module.exports = function (passport) {
  var bkfd2Password = require('pbkdf2-password')
  var hasher = bkfd2Password()
  var connection = require('../config/db')()
  var router = require('express').Router()

  router.get('/logout', function (req, res) {
    req.logout()
    req.session.save(function () {
      res.redirect('/welcome')
    })
  })

  router.post('/login',
              passport.authenticate(
                // local 이라는 인증 방식이 사용됨 만약 facebook을 사용중이면 facebook을 입력하면된다.
                'local',
                {
                  // 로그인에 성공하면 redirect 되는 url
                  successRedirect: '/welcome',
                  // 로그인에 실패하면 redirect 되는 url
                  failureRedirect: '/auth/login',
                  // 실패했을 시, 메세지를 띄우기 위함
                  failureFlash: false
                }
              )
    )

  router.get('/facebook',
              passport.authenticate('facebook', { scope: 'email' })
    )

  router.get('/facebook/callback',
              passport.authenticate(
                'facebook',
                {
                  successRedirect: '/welcome',
                  failureRedirect: '/auth/login'
                }
              )
    )

  router.post('/register', function (req, res, next) {
    var opts = {
      password: req.body.password
    }

    hasher(opts, function (err, pass, _salt, hash) {
      var user = {
        authId: 'local:' + req.body.username,
        username: req.body.username,
        password: hash,
        displayName: req.body.displayName,
        salt: _salt
      }

        // sql문을 일일이 작성할 필요없이 다음과 같이 객체만 넣으면 자동으로 넣어준다.
      var sql = 'INSERT INTO users SET ?'
      connection.query(sql, user, function (err, results) {
        if (err) {
          console.log(err)
          res.status(500)
        } else {
          req.login(user, function (err) {
            if (err) return next(err)
            return res.redirect('/welcome')
          })
        }
      })
    })
  })

  router.get('/login', function (req, res) {
    res.render('auth/login.html.ejs')
  })

  router.get('/register', function (req, res) {
    res.render('auth/register.html.ejs')
  })

  return router
}
