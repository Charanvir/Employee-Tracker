const inquirer = require("inquirer");
const cTable = require("console.table");
const { viewDepartments, addDepartment } = require("./departsments")

// this will be exported so that it can be initiated in the index.js file along with its prototype functions that can be used as well
function initiateApplication() {
}

// this function will initalize the application
initiateApplication.prototype.initialPrompt = function () {
    return inquirer
        .prompt([
            {
                type: 'list',
                name: 'prompt',
                message: 'What would you like to do?',
                choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employees Role']
            }
        ])
        .then(({ prompt }) => {
            if (prompt === 'View All Departments') {
                viewDepartments()
            } else if (prompt === 'Add A Department') {
                inquirer
                    .prompt([
                        {
                            type: 'input',
                            name: 'addDepart',
                            message: 'What is the name of the department you are adding?'
                        }
                    ])
                    .then(({ addDepart }) => {
                        addDepartment(addDepart)
                    })
            }
        })
}

module.exports = initiateApplication;