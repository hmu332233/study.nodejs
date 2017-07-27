module.exports = function () {
  var mysql = require('mysql')
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'o2'
  })

    // mysql 접속
  connection.connect()

  return connection
}
