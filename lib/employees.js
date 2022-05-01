const db = require("../db/dbConnection")

const viewEmployees = function () {
    // const sql = `
    // SELECT emp.employee_id, emp.first_name, emp.last_name, emp.manager_id, manager.first_name AS manager_firstName, manager.last_name AS manger_lastName, roles.title AS role_title, roles.salary, departments.name AS department
    // FROM employees emp
    // RIGHT JOIN roles on emp.roles_id = roles.id
    // JOIN departments ON departments.id = roles.department_id
    // JOIN employees manager ON emp.manager_id = manager.employee_id`;

    const sql = `
    SELECT emp.employee_id, emp.first_name AS First_Name, emp.last_name AS Last_Name, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager, roles.title As Role_Title, roles.salary  AS Salary, departments.name AS Department
    FROM employees manager 
    RIGHT JOIN employees emp ON emp.manager_id = manager.employee_id 
    JOIN roles ON emp.roles_id = roles.id 
    JOIN departments ON departments.id = roles.department_id`
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err)
        }
        return console.table(rows)
    })
}

module.exports = {
    viewEmployees
}