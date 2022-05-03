const db = require("../db/dbConnection")

// This function views all of the databases employees from the employees table
const viewEmployees = function () {
    // Since the sql call is using the same column within the table twice, using a SQL function, the employees ID, first name and last name were broken down into two further variables
    // the emp variable is the employees name, while the manager variable is used to view the manager that the employee might have
    // RIGHT JOIN is used so that all of the employees are represented, when just JOIN is used, sich as for roles and departments, only employees that have a manager are represented
    // RIGHT JOIN adds the managers to the right of employees, instead of doing a SELF JOIN
    // following the manager information, roles is added depending on the employees role
    // and the department in which the role belongs is added depending on the roles department ID
    // Information includes is as follows: employee ID, employee first name and last name, the Managers name concated into one value, the roles title and salary as well as the department in which the role belonds to
    // By using LEFT OUTER JOIN on the last line of the sql command, when the department is deleted, the employee will still be shown, with null as the value for department
    const sql = `
    SELECT emp.employee_id, emp.first_name AS First_Name, emp.last_name AS Last_Name, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager, roles.title As Role_Title, roles.salary  AS Salary, departments.name AS Department
    FROM employees manager 
    RIGHT JOIN employees emp ON emp.manager_id = manager.employee_id 
    LEFT OUTER JOIN roles ON emp.roles_id = roles.id 
    LEFT OUTER JOIN departments ON departments.id = roles.department_id`
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