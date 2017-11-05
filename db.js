var mysql = require("mysql2");
var config = require("./config")

module.exports = {
  pool: mysql.createPool({
    connectionLimit: 150,
    multipleStatements: true,
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database
  })
}
