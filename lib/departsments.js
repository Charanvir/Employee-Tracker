const db = require("../db/dbConnection")


// This function is called to view all of the departments in the database
const viewDepartments = function () {
    // This selects everything in the departments table within the database (*) wildcard selects ALL
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err)
        }
        // console.table formats the information in a neat and concise table
        console.table(rows)
    })
}

// This function adds a department to the database
const addDepartment = function (departmentName) {
    // This sql command has a default value inserted as ?, which the params below will fill when sent as a query. It takes user input and adds that as a param into the database
    const sql = `INSERT INTO departments (name)
    VALUES (?)`;
    const params = [departmentName]
    db.query(sql, params, (err, rows) => {
        if (err) {
            console.log(err)
        }
        // Shows the user that a department they entered has been added
        console.log(`${departmentName} added to database`)
    })
}

module.exports = {
    viewDepartments,
    addDepartment,
}