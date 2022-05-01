const db = require("../db/dbConnection")

const viewRoles = function () {
    const sql = `SELECT roles.id, roles.title, roles.salary, departments.name
            AS department_name
            FROM roles
            LEFT JOIN departments
            ON roles.department_id = departments.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err)
        }
        return console.table(rows)
    })
};

const addRole = function (title, salary, departmentID) {
    const sql = `INSERT INTO roles (title, salary, department_id)
    VALUES (?,?,?)`;
    const params = [title, salary, departmentID]
    db.query(sql, params, (err, rows) => {
        if (err) {
            console.log(err)
        }
        console.log(`${title} was added to the database!`)
    })
}


module.exports = {
    viewRoles,
    addRole
}