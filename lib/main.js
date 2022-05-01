const inquirer = require("inquirer");
const cTable = require("console.table");
const { viewDepartments, addDepartment } = require("./departsments")
const { viewRoles } = require("./roles")
const { viewEmployees } = require("./employees")
const db = require('../db/dbConnection');

// this will be exported so that it can be initiated in the index.js file along with its prototype functions that can be used as well


// this function will initalize the application
const initialPrompt = async function () {
    const { prompt } = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'prompt',
                message: 'What would you like to do?',
                choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employees Role', 'Finish']
            }
        ]);
    if (prompt === 'View All Departments') {
        viewDepartments();
        setTimeout(() => {
            initialPrompt();
        }, 1000)
    }
    if (prompt === "View All Roles") {
        viewRoles();
        setTimeout(() => {
            initialPrompt();
        }, 1000)
    }
    if (prompt === 'View All Employees') {
        viewEmployees();
        setTimeout(() => {
            initialPrompt();
        }, 1000)
    }
    if (prompt === 'Add A Department') {
        return inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'addDepart',
                    message: 'What is the name of the department you are adding?'
                }
            ])
            .then(({ addDepart }) => {
                addDepartment(addDepart);
                setTimeout(() => {
                    initialPrompt();
                }, 1000)
            });
    }
    if (prompt === 'Add A Role') {
        const sql = `SELECT * FROM departments`
        db.query(sql, (err, rows) => {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'roleName',
                        message: 'What is the name of the role you are adding?'
                    },
                    {
                        type: 'number',
                        name: 'salary',
                        message: 'What is the roles salary (up to 6 digits)'
                    },
                    {
                        type: 'list',
                        name: 'departName',
                        message: 'What department does the role belong to?',
                        choices: rows
                    }
                ])
                .then(({ roleName, salary, departName }) => {
                    const addRole = function (title, salary, departmentID) {
                        const sql = `INSERT INTO roles (title, salary, department_id)
                        VALUES (?,?,?)`;
                        const params = [title, salary, departmentID]
                        db.query(sql, params, (err) => {
                            if (err) {
                                console.log(err)
                            }
                            console.log(`${title} was added to the database!`)
                        })
                        setTimeout(() => {
                            initialPrompt();
                        }, 1000)
                    }
                    const getDepartID = function (roleName, salary, departName) {
                        const sql = `SELECT departments.id FROM departments WHERE departments.name = '${departName}'`;
                        db.query(sql, (err, row) => {
                            addRole(roleName, salary, row[0].id)
                        })
                    }
                    getDepartID(roleName, salary, departName)
                })
        })

    }
    if (prompt === "Add An Employee") {
        console.log("Add An Employee Selected");
    }
    if (prompt === "Update An Employees Role") {
        console.log("Update an employee");
    }
    if (prompt === "Finish") {
        finishPrompt();
    }
}

const finishPrompt = function () {
    console.log('Exiting Company Database!')
    process.exit()
}

module.exports = initialPrompt;