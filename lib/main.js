const inquirer = require("inquirer");
const cTable = require("console.table");
const { viewDepartments, addDepartment } = require("./departsments")
const { viewRoles } = require("./roles")

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
                choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employees Role', 'Finish']
            }
        ])
        .then(({ prompt }) => {
            if (prompt === 'View All Departments') {
                viewDepartments()
                // return this.initialPrompt()
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
                        addDepartment(addDepart)
                        // return this.initialPrompt()
                    })
            }
            if (prompt === "View All Roles") {
                viewRoles()
                // return this.initialPrompt()
            }
            // else {
            //     this.finishPrompt()
            // }
        })
}

initiateApplication.prototype.finishPrompt = function () {
    console.log('Exiting Company Database!')
    process.exit()
}

module.exports = initiateApplication;