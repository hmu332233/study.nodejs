module.exports = function () {
  var router = require('express').Router()
  var connection = require('../config/db')()

  router.get('/new', function (req, res) {
    res.render('topic/new.html.ejs')
  })

  router.get('/:id/edit', function (req, res) {
    var id = req.params.id
    var sql = 'SELECT * FROM topic WHERE id=?'
    var params = [id]

    if (id) {
      connection.query(sql, params, function (error, results, fields) {
        if (error) {
          res.status(500).send('Internal Server Error')
        } else {
          res.render('topic/edit.html.ejs', {topic: results[0]})
        }
      })
    } else {
      res.status(400).send('No id')
    }
  })

  router.get('/', function (req, res) {
    var sql = 'SELECT * FROM topic'
    connection.query(sql, function (error, results, fields) {
      if (error) throw error

      for (var i = 0; i < results.length; i++) {
        console.log(results[i].title)
      }

      res.render('topic/index.html.ejs', {topics: results})
    })
  })

  router.get('/:id', function (req, res) {
    var id = req.params.id
    var sql = 'SELECT * FROM topic WHERE id=?'
    var params = [id]
    connection.query(sql, params, function (error, results, fields) {
      if (error) throw error

      res.render('topic/show.html.ejs', {topic: results[0]})
    })
  })

  router.post('/', function (req, res) {
    var title = req.body.title
    var content = req.body.content

    var sql = 'INSERT INTO topic (title, content, author) VALUES(?, ?, ?)'
    var params = [title, content, 'test']
    connection.query(sql, params, function (err, results, fields) {
      if (err) {
        console.log(err)
        res.status(500).send('Internal Server Error')
      } else {
        console.log(results.insertId)
        res.redirect('/topic/' + results.insertId)
      }
    })
  })

  router.put('/:id', function (req, res) {
    var id = req.params.id
    var title = req.body.title
    var content = req.body.content

    var sql = 'UPDATE topic SET title=?, content=? WHERE id=?'
    var params = [title, content, id]
    connection.query(sql, params, function (err, results, fields) {
      if (err) {
        console.log(err)
        res.status(500).send('Internal Server Error')
      } else {
        res.redirect('/topic/' + id)
      }
    })
  })

  router.get('/:id/delete', function (req, res) {
    var id = req.params.id

    var sql = 'DELETE FROM topic WHERE id=?'
    var params = [id]
    connection.query(sql, params, function (err, rows, fields) {
      if (err) {
        console.log(err)
      } else {
        console.log(rows)
        res.redirect('/topic')
      }
    })
  })

  return router
}
