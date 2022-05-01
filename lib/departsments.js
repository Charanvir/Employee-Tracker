const db = require("../db/dbConnection")

const viewDepartments = function () {
    const sql = `SELECT * FROM departments`;
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err)
        }
        console.table(rows)
    })
}

const addDepartment = function (departmentName) {
    const sql = `INSERT INTO departments (name)
    VALUES (?)`;
    const params = [departmentName]
    db.query(sql, params, (err, rows) => {
        if (err) {
            console.log(err)
        }
        console.log(`${departmentName} added to database`)
    })
}

module.exports = {
    viewDepartments,
    addDepartment,
}