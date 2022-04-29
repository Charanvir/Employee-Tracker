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

module.exports = { viewDepartments }