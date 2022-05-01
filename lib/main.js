const inquirer = require("inquirer");
const cTable = require("console.table");
const { viewDepartments, addDepartment } = require("./departsments")
const { viewRoles, addRole } = require("./roles")
const { viewEmployees } = require("./employees")

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
                console.log(`${addDepart} added to the database`);
            });
    }
    if (prompt === 'Add A Role') {
        return inquirer
            .prompt([
                {
                    type: 'list',
                    name: "viewDepartment",
                    message: 'Do you know the ID of the department this role belongs to? Select no to be given a list of the departments and their respective IDs. Select Yes to proceed',
                    choices: ['Yes', 'No']
                }
            ])
            .then(({ viewDepartment }) => {
                if (viewDepartment === "No") {
                    viewDepartments();
                } else {
                    inquirer
                        .prompt([
                            {
                                type: 'input',
                                name: 'title',
                                message: 'What is the name of the role you are adding?'
                            },
                            {
                                type: 'number',
                                name: 'salary',
                                message: 'What is the salary of this role (up to 6 digits)?'
                            },
                            {
                                type: 'number',
                                name: 'departID',
                                message: 'Please enter the department ID'
                            }
                        ])
                        .then(({ title, salary, departID }) => {
                            addRole(title, salary, departID);
                        });

                }
            });
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