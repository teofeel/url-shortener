const mysql = require('mysql2')
const dotenv = require('dotenv').config()

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT
})

connection.connect((err)=>{
    if(err) throw err
    else console.log('DB is working')
})

module.exports = {connection}