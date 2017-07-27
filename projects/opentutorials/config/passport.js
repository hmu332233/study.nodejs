
module.exports = function (app) {
  var connection = require('./db')()
  var bkfd2Password = require('pbkdf2-password')
  var passport = require('passport')
  var LocalStrategy = require('passport-local').Strategy
  var FacebookStrategy = require('passport-facebook').Strategy
  var hasher = bkfd2Password()

  app.use(passport.initialize())
  app.use(passport.session())

// 여기서 정의한 함수가 사용자 인증에 사용된다
  passport.use(new LocalStrategy(
  function (username, pwd, done) {
    var sql = 'SELECT * FROM users WHERE authId=?'
    connection.query(sql, ['local:' + username], function (err, results) {
        // console.log(results);
      if (err && results.size > 0) {
        console.log('err')
        return done('There is no user.')
      }

      var user = results[0]

      var opts = {
        password: pwd,
        salt: user.salt
      }

      return hasher(opts, function (err, pass, salt, hash) {
        if (hash === user.password) {
          console.log('LocalStrategy', user)
          done(null, user)
        } else {
          done(null, false)
        }
      })
    })
  }
  ))

  passport.use(new FacebookStrategy({
    clientID: 'test',
    clientSecret: 'test',
    callbackURL: '/auth/facebook/callback',
    profileFields: ['displayName', 'email']
  },
  function (accessToken, refreshToken, profile, done) {
    console.log(profile)
    var authId = 'facebook:' + profile.id
    var sql = 'SELECT * FROM users WHERE authId=?'
    connection.query(sql, [authId], function (err, results) {
        // 사용자가 있다면
      if (results.size > 0) {
        done(null, results[0])
      } else {
        // 사용자가 없다면
        var new_user = {
          'authId': authId,
          'displayName': profile.displayName,
          'email': 'test'
        }

        var sql = 'INSERT INTO users SET ?'
        connection.query(sql, new_user, function (err, results) {
          if (err) {
            console.log(err)
            done('err')
          } else {
            done(null, new_user)
          }
        })
      }
    })
  }
  ))

  passport.serializeUser(function (user, done) {
    console.log('serializeUser', user)
    done(null, user.authId)
  })

  passport.deserializeUser(function (id, done) {
    console.log('deserializeUser', id)

    var sql = 'SELECT * FROM users WHERE authId=?'
    connection.query(sql, [id], function (err, results) {
    //   console.log(results);
      if (err) {
        console.log(err)
        done('err')
      } else {
        //   console.log('login!');
        done(null, results[0])
      }
    })
  })

  return passport
}
