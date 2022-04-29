const mysql = require('mysql2');
const credentials = require("./credentials")

// Connect to database
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        // Your MySQL username,
        user: credentials.user,
        // Your MySQL password
        password: credentials.password,
        database: 'election'
    },
    console.log('Connected to the election database.')
);

module.exports = db;