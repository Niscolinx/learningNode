const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'learning-node',
    password: 'munisco6869'
})

module.exports = pool.promise()