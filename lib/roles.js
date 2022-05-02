const db = require("../db/dbConnection")

// This function views all of the roles in the database
// It selects the roles id, title and salary to be viewed
// the department name is extracted using the foreign key in the schema and JOINED to the table
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
    viewRoles
}