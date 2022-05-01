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

module.exports = {
    viewRoles,
}