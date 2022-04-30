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
    const sql = `INSERT INTO departments (department_name)
    VALUES (?)`;
    const params = [departmentName]
    db.query(sql, params, (err, rows) => {
        if (err) {
            console.log(err)
        }
        console.log('Department Added')
        viewDepartments()
    })
}

module.exports = {
    viewDepartments,
    addDepartment
}