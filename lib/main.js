const inquirer = require("inquirer");
const cTable = require("console.table");

function initiateApplication() {
    this.departments;
    this.roles;
    this.employees;
}

initiateApplication.prototype.initialPrompt = function () {
    return inquirer
        .prompt([
            {
                type: 'input',
                name: 'name',
                message: 'This is a test'
            }
        ])
        .then(({ name }) => {
            console.log(name)
        })
}

module.exports = initiateApplication;