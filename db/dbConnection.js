const mysql = require('mysql2');
// To protect SQL user and password credentials, a separate file has been created and is being referenced in the connection call below
// The credentials file is included in the .gitignore file so it is not exposed on GitHub
const credentials = require("./credentials")

// Connect to database
const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        // MySQL username,
        user: credentials.user,
        // MySQL password
        password: credentials.password,
        database: 'company'
    },
    console.log('Connected to the company database.')
);

module.exports = db;