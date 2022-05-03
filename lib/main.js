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
                choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role', 'Add An Employee', 'Update An Employees Role', 'More', 'Finish']
            }
        ]);

    if (prompt === 'View All Departments') {
        viewDepartments();
        // This is added after every command is finished
        // This was done because when there was no delay added, the new prompt would overwrite the table and the command line was not organized, this work around allows the console to stay organized
        // and allow the user to see all relevant information and still make a new selection
        setTimeout(() => {
            initialPrompt();
        }, 1000)
    }

    if (prompt === "View All Roles") {
        viewRoles();
        // New prompt work around
        setTimeout(() => {
            initialPrompt();
        }, 1000)
    }

    if (prompt === 'View All Employees') {
        viewEmployees();
        // New prompt work around
        setTimeout(() => {
            initialPrompt();
        }, 1000)
    }

    if (prompt === 'Add A Department') {
        // this prompt takes the user input and passes to the function that was requireed from the departments JS file. its functionality is explained in that file
        return inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'addDepart',
                    message: 'What is the name of the department you are adding?',
                    validate: input => {
                        if (input) {
                            return true
                        } else {
                            console.log("Please Enter a Department Name to Add")
                            return false;
                        }
                    }
                }
            ])
            // selects the user input to be used
            .then(({ addDepart }) => {
                addDepartment(addDepart);
                // New prompt work around
                setTimeout(() => {
                    initialPrompt();
                }, 1000)
            });
    }

    if (prompt === 'Add A Role') {
        // this function is more complex because multiple sql calls need to be made
        // this first sql call gives all of the departments that the new role could be added to by viewing all current departments in the databaswe
        const sql = `SELECT departments.name FROM departments`
        db.query(sql, (err, rows) => {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'roleName',
                        message: 'What is the name of the role you are adding?',
                        validate: input => {
                            if (input) {
                                return true
                            } else {
                                console.log("Please Enter a Role Title to Add")
                                return false;
                            }
                        }
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
                        // This is where the departments data extracted from the query is used
                        choices: rows
                    }
                ])
                // This takes all of the user inputted answers to the prompt and utilizes it
                .then(({ roleName, salary, departName }) => {
                    // This function takes roles title, salary and departmentID extracted from getDepartID and INSERTS it into the database using the INSERT keyword in SQL
                    // This function also utilizes params and ? in the values input
                    // This allows the users information to be placed in the query
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
                        // New prompt work around
                        setTimeout(() => {
                            initialPrompt();
                        }, 1000)
                    }

                    // Since the table takes an INTEGER as the department ID for each role, the ID needs to be found for the department name that was selected. This IS is then sent to add Role
                    // Alond with the title and salary that was inputted earlier
                    const getDepartID = function (roleName, salary, departName) {
                        const sql = `SELECT departments.id FROM departments WHERE departments.name = '${departName}'`;
                        db.query(sql, (err, row) => {
                            addRole(roleName, salary, row[0].id)
                        })
                    }
                    // This function initiates the addRole process
                    getDepartID(roleName, salary, departName)
                })
        })
    }

    if (prompt === "Add An Employee") {
        // this selection is like adding a new role, but layered even further

        // the prompt begins by asking the user whether the new employee being added has a manager
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'managerConfirm',
                    message: 'Does this employee have a manager?',
                    choices: ['Yes', 'No']
                }
            ])
            // After checking what the response was, there are two paths the function does
            .then(({ managerConfirm }) => {
                // the first path is when the new employee does not have a manager
                if (managerConfirm === 'No') {
                    // This SQL call selects all of the roles titles in the database
                    // The variable would only work in choices when it was set AS name
                    let sql = `SELECT roles.title AS name FROM roles`;
                    db.query(sql, (err, rows) => {
                        inquirer
                            .prompt([
                                {
                                    type: 'input',
                                    name: 'firstName',
                                    message: 'What is the new employees first name?',
                                    validate: input => {
                                        if (input) {
                                            return true
                                        } else {
                                            console.log("Please enter a first name for the new employee")
                                            return false;
                                        }
                                    }
                                },
                                {
                                    type: 'input',
                                    name: 'lastName',
                                    message: 'What is the new employees last name?',
                                    validate: input => {
                                        if (input) {
                                            return true
                                        } else {
                                            console.log("Please Enter a last name for the new employee")
                                            return false;
                                        }
                                    }
                                },
                                {
                                    type: 'list',
                                    name: 'roleTitle',
                                    message: 'What is the new employees role at the company?',
                                    // this is where the user selects what role the new employee will have
                                    choices: rows
                                }
                            ])
                            // since there was no manager selected, there is no manager value to pass onto the next function
                            .then(({ firstName, lastName, roleTitle }) => {
                                getRoleIDNoManager(firstName, lastName, roleTitle)

                            })
                    })
                    // if the user selected that the new employee has a manager, this next path is chosen
                } else if (managerConfirm === 'Yes') {
                    // This SQL call concats the employee first and last name for better viewing and also allows a correct selection if multiple employees have the same first name or last name
                    // allows better accurancy
                    let sql = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS name FROM employees`;
                    db.query(sql, (err, rows) => {
                        inquirer
                            .prompt([
                                {
                                    type: 'list',
                                    name: 'managerName',
                                    message: 'What is the managers name?',
                                    choices: rows
                                }
                            ])
                            .then(({ managerName }) => {
                                // Here the selection is split and just the first name is taken, making the next SQL call easier to manage
                                getManagerID(managerName.split(' ', 1)[0])
                            })
                    })
                }
            })
        // This function takes the manager that was selected and finds it ID, so it can be added to the employee schema where the manager table takes an INTEGER that represents the employee
        const getManagerID = function (managerName) {
            // this SQL call used the managerName which was split and sent in the previous function
            const sql = `SELECT employees.employee_id FROM employees WHERE employees.first_name = "${managerName}"`;
            db.query(sql, (err, rows) => {
                // this extacts the ID from the object that is returned which is nested in an array
                let managerID = rows[0].employee_id

                // this function then asks the user the new employees first name, last name and their role in the company, which is selected from the list that is extacted from the SQL call below
                let nextprompt = function (managerID) {
                    // once again the values were set to AS name to stop them from being undefined when used in the choices
                    let sql = `SELECT roles.title AS name FROM roles`;
                    db.query(sql, (err, rows) => {
                        inquirer.prompt([
                            {
                                type: 'input',
                                name: 'firstName',
                                message: 'What is the new employees first name?',
                                validate: input => {
                                    if (input) {
                                        return true
                                    } else {
                                        console.log("Please Enter a first name for the new employee")
                                        return false;
                                    }
                                }
                            },
                            {
                                type: 'input',
                                name: 'lastName',
                                message: 'What is the new employees last name?',
                                validate: input => {
                                    if (input) {
                                        return true
                                    } else {
                                        console.log("Please Enter a last name for the new employee")
                                        return false;
                                    }
                                }
                            },
                            {
                                type: 'list',
                                name: 'roleTitle',
                                message: 'What is the new employees role at the company?',
                                choices: rows
                            },
                        ])
                            .then(({ firstName, lastName, roleTitle }) => {
                                // This takes all of the user inputted data and sends it to the getRoleId function below
                                getRoleID(firstName, lastName, roleTitle, managerID)
                            })
                    })
                }
                // by sendin the managerID in this function, it allows it to be used in function that might be nested within other functions
                nextprompt(managerID)
            })
        }
        // This function is only called when the user chooses yes to selected a manager
        // It requires managerName to be passed along with the other values 
        const getRoleID = function (firstName, lastName, roleTitle, managerName) {
            // once again, since the table takes the role as an INTEGER which is used as a foreign key from the roles table
            // the roles ID must be extracted
            const sql = `SELECT roles.id FROM roles WHERE roles.title = '${roleTitle}'`;
            db.query(sql, (err, row) => {
                if (err) {
                    console.log(err)
                }
                // once the roles ID is selected, it is extracted from the result and send to the next function
                addEmployee(firstName, lastName, row[0].id, managerName)
            })
        }
        // This function is only called upon when no manager is selected
        // It requires less specific SQL calls compared to the SQL call that needs manager ID as well
        const getRoleIDNoManager = function (firstName, lastName, roleTitle) {
            // once again the roles ID must be used due to the table set up requiring an INTEGER
            const sql = `SELECT roles.id FROM roles WHERE roles.title = '${roleTitle}'`;
            db.query(sql, (err, row) => {
                if (err) {
                    console.log(err)
                }
                // the information is then send to a specific function that does not require manager information
                addEmployeeNoManager(firstName, lastName, row[0].id)
            })
        }
        // this function is only called in the managet selected path
        // it requires managerID amongst the other variables that were user inputted
        const addEmployee = function (firstName, lastName, roleID, managerID) {
            const sql = `INSERT INTO employees (first_name, last_name, roles_id, manager_id)
            VALUES (?,?,?,?)`;
            // these params are the user inputted values
            const params = [firstName, lastName, roleID, managerID]
            db.query(sql, params, (err) => {
                if (err) {
                    console.log(err)
                }
                console.log(`${firstName} ${lastName} was added to the database!`)
            })
            // New prompt work around
            setTimeout(() => {
                initialPrompt();
            }, 1000)
        }
        // This function is the end of the no managers selected path
        const addEmployeeNoManager = function (firstName, lastName, roleID) {
            const sql = `INSERT INTO employees (first_name, last_name, roles_id)
            VALUES (?,?,?)`;
            // these params are the user inputted values
            const params = [firstName, lastName, roleID]
            db.query(sql, params, (err) => {
                if (err) {
                    console.log(err)
                }
                console.log(`${firstName} ${lastName} was added to the database!`)
            })
            // New prompt work around
            setTimeout(() => {
                initialPrompt();
            }, 1000)
        }
    }

    if (prompt === "Update An Employees Role") {
        // this gets the employees names that are in the database and concats them into one value
        // This SQL call is used to give the user a list of the employees in the database for them to pick from to update
        let sql = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS name FROM employees`;
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err)
            }
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'updateEmployee',
                        message: 'Which employees role would you like to update?',
                        choices: rows
                    }
                ])
                .then(({ updateEmployee }) => {
                    // by splitting the user and taking both words, we are ensuring that the exact employee is selected that the user wants to update
                    // this increases accuracy in the case that multiple employees have the same first name or last name
                    let employeeFirstName = updateEmployee.split(' ')[0]
                    let employeeLastName = updateEmployee.split(' ')[1]
                    // both first name and last name are send to the next function
                    getEmployeeId(employeeFirstName, employeeLastName)
                })
        })
        // this function takes the first and last name and uses them to make two clauses for the SQL call
        // The employees ID is extracted, to allow increased accuracy
        let getEmployeeId = function (firstName, lastName) {
            const sql = `SELECT employees.employee_id FROM employees WHERE (employees.first_name = '${firstName}' AND employees.last_name = '${lastName}')`;
            db.query(sql, (err, rows) => {
                // the ID is extracted from the object nested in the array which is the result of the query
                getRoleId(rows[0].employee_id)
            })
        }
        // The new role that needs to be selected is done here
        // First a query is done to get all of the roles within the database and they are presented to the user
        let getRoleId = function (employeeID) {
            const sql = `SELECT roles.title AS name FROM roles`;
            db.query(sql, (err, rows) => {
                inquirer
                    .prompt([
                        {
                            type: 'list',
                            name: 'roleSelectedToUpdate',
                            message: 'What new role will this employee do?',
                            choices: rows
                        }
                    ])
                    // once the user selects the role they wish to update
                    // It is used to get the ID of the role
                    .then(({ roleSelectedToUpdate }) => {
                        const sql = `SELECT roles.id FROM roles WHERE roles.title = '${roleSelectedToUpdate}'`
                        db.query(sql, (err, rows) => {
                            if (err) {
                                console.log(err)
                            }
                            let newRoleID = rows[0].id
                            // The employees ID and new roles ID is send to the update function
                            updateEmployeeRole(employeeID, newRoleID)
                        })
                    })
            })
        }
        // by using the UPDATE keyword in SQL, we can change the values of a column in the table
        let updateEmployeeRole = function (employeeID, roleID) {
            const sql =
                // This SQL call changes the role ID on the selected user
                `UPDATE employees
                SET employees.roles_id = ${roleID}
                WHERE employees.employee_id = ${employeeID}`;
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(err)
                }
                // this is to inform the user that role was updated
                console.log(`Employee Role Updated!`)
            })
            // New prompt work around
            setTimeout(() => {
                initialPrompt();
            }, 1000)
        }
    }

    // this will redirect to the additionalFeatures JS page, which will provide bonus features
    if (prompt === "More") {
        additionalFeatures()
    }

    // this function is called upon when the user selects the finish (end) the CLI application
    if (prompt === "Finish") {
        finishPrompt();
    }
}

const additionalFeatures = async function () {
    // This function is called when the user selects more and another set of additional features is presented
    const { moreFunctions } = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'moreFunctions',
                message: "What additional feature would you like to do?",
                choices: ['Update an Employees Manager', 'View Employees by Manager', 'View Employees by Department', 'Delete a Department', 'Delete a Role', 'Delete an Employee', 'View Departments Budget', '***Return to original prompt***']
            }
        ])

    if (moreFunctions === "Update an Employees Manager") {
        console.log("Update Manager")
        const sql = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS name FROM employees;`
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err)
            }
            // the prompt uses the data retrieved from the SQL call twice and breaks it down into employee and manager
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employeeToUpdate',
                        message: "Which employee would you like to update?",
                        choices: rows
                    },
                    {
                        type: 'list',
                        name: 'newManager',
                        message: 'Who is the employees new manager?',
                        choices: rows
                    }
                ])
                .then(({ employeeToUpdate, newManager }) => {
                    // these variables allow for more accuracy when making the SQL call
                    const employeeFirstName = employeeToUpdate.split(' ')[0]
                    const employeeLastName = employeeToUpdate.split(' ')[1]
                    const managerFirstName = newManager.split(' ')[0]
                    const managerLastName = newManager.split(' ')[1]
                    // Then we need to retrieve the IDs of the employee and manager selected
                    const sql = `SELECT employees.employee_id FROM employees WHERE (employees.first_name = '${employeeFirstName}' AND employees.last_name = '${employeeLastName}')`;
                    db.query(sql, (err, rows) => {
                        if (err) {
                            console.log(err)
                        }
                        let employeeID = rows[0].employee_id
                        const sql = `SELECT employees.employee_id FROM employees WHERE (employees.first_name = '${managerFirstName}' AND employees.last_name = '${managerLastName}')`;
                        db.query(sql, (err, rows) => {
                            if (err) {
                                console.log(err)
                            }
                            let managerID = rows[0].employee_id
                            // The update sql call will set the manager ID for the employee selected
                            const sql = `UPDATE employees 
                            SET manager_id = ${managerID}
                            WHERE employee_id = ${employeeID}`
                            db.query(sql, (err, rows) => {
                                if (err) {
                                    console.log(err)
                                }
                                console.log(`${managerFirstName} ${managerLastName} is now the manager of ${employeeFirstName} ${employeeLastName}`);
                                // this is like the work around above to call the new prompt menu after an action is completed
                                setTimeout(() => {
                                    additionalFeatures();
                                }, 1000)
                            })
                        })
                    })
                })
        })

    }

    if (moreFunctions === "View Employees by Manager") {
        // the following code first gets the employee names from the database and the user selecst which one to view subordinate employees
        // Once that selection is made, the IF is found and a SELECT call with a WHERE clause is ran to get all employees that have a manager_id matching
        const sql = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS name FROM employees;`
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err)
            }
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'managerSelect',
                        message: 'Which manager would you like to select, to view their employees?',
                        choices: rows
                    }
                ])
                .then(({ managerSelect }) => {
                    const managerFirstName = managerSelect.split(' ', 1)[0]
                    const sql = `SELECT employees.employee_id FROM employees WHERE employees.first_name = '${managerFirstName}'`
                    db.query(sql, (err, rows) => {
                        if (err) {
                            console.log(err)
                        }
                        const managerID = rows[0].employee_id
                        const sql = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS name FROM employees WHERE employees.manager_id = ${managerID};`
                        db.query(sql, (err, rows) => {
                            if (err) {
                                console.log(err)
                            }
                            console.log("***********************")
                            console.log(`The following employees are managed by ${managerSelect}`)
                            console.table(rows);
                            setTimeout(() => {
                                additionalFeatures();
                            }, 1000)
                        })
                    })
                })
        })
    }

    if (moreFunctions === "View Employees by Department") {
        // first the departments names need to be retrieved and presented for the user to select
        const sql = `SELECT departments.name FROM departments`;
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err)
            }
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'departName',
                        message: 'Which departments employees would you like to view?',
                        choices: rows
                    }
                ])
                .then(({ departName }) => {
                    // this selects all of the values that the SQL call needs to retrieve
                    // It joins the tables and when further filters it out with a WHERE statements, which is the department name that was selected by the user
                    const sql = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS name, roles.title, roles.salary, departments.name AS department
                    FROM employees 
                    RIGHT JOIN roles on employees.roles_id = roles.id 
                    RIGHT JOIN departments ON departments.id = roles.department_id 
                    WHERE name = '${departName}';`
                    db.query(sql, (err, rows) => {
                        if (err) {
                            console.log(err)
                        }
                        console.log('*********')
                        console.log(`The following employees are in the ${departName}`)
                        console.table(rows)
                        setTimeout(() => {
                            additionalFeatures();
                        }, 1000)
                    })
                })
        })
    }

    if (moreFunctions === "Delete a Department") {
        // this code simply presents the user with the department they wish to delete
        // That department is then ran through a DELETE statement SQL call and removed from the database
        const sql = `SELECT departments.name FROM departments`;
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err)
            }
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'departmentName',
                        message: 'Which department would you like to remove?',
                        choices: rows
                    }
                ])
                .then(({ departmentName }) => {
                    const sql = `DELETE FROM departments
                    WHERE name = "${departmentName}"`;
                    db.query(sql, (err, rows) => {
                        if (err) {
                            console.log(err)
                        }
                        console.log(`${departmentName} deleted from the database!`)
                        setTimeout(() => {
                            additionalFeatures();
                        }, 1000)
                    })
                })
        })
    }

    if (moreFunctions === "Delete a Role") {
        // before a role can be removed, it has to be selected from the database
        // then ran through a DELETE statement in the SQL call and removed from the database
        const sql = `SELECT roles.title AS name FROM roles`;
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err)
            }
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'roleTitle',
                        message: 'What role would you like to delete from the database?',
                        choices: rows
                    }
                ])
                .then(({ roleTitle }) => {
                    const sql = `DELETE FROM roles
                    WHERE title = "${roleTitle}"`;
                    db.query(sql, (err, rows) => {
                        if (err) {
                            console.log(err)
                        }
                        console.log(`${roleTitle} was deleted from the database!`);
                        setTimeout(() => {
                            additionalFeatures();
                        }, 1000)
                    })
                })

        })

    }

    if (moreFunctions === "Delete an Employee") {
        // the employee same is retrieved from the database
        const sql = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS name FROM employees;`
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err)
            }
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employeeName',
                        message: 'Which employee would you like to delete from the database?',
                        choices: rows
                    }
                ])
                .then(({ employeeName }) => {
                    // the name is then split to improve accurancy when making the SQL call
                    // once the specific employee is found, it is removed from the database using the DELETE statement with multiple clauses
                    let employeeFirstName = employeeName.split(' ')[0]
                    let employeeLastName = employeeName.split(' ')[1]
                    const sql = `DELETE FROM employees WHERE (employees.first_name = '${employeeFirstName}' AND employees.last_name = '${employeeLastName}')`;
                    db.query(sql, (err, rows) => {
                        if (err) {
                            console.log(err)
                        }
                        console.log(`${employeeFirstName} ${employeeLastName} was deleted from the database!`);
                        setTimeout(() => {
                            additionalFeatures();
                        }, 1000)
                    })

                })
        })

    }

    if (moreFunctions === "View Departments Budget") {
        // first the department needs to be retrieved and presented to the user
        const sql = `SELECT departments.name FROM departments`;
        db.query(sql, (err, rows) => {
            if (err) {
                console.log(err)
            }
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'departName',
                        message: 'Which departments budget would you like to see?',
                        choices: rows
                    }
                ])
                .then(({ departName }) => {
                    // then the user selected department name is used in the SQL call
                    // the employee name, role title and salary, and department name is extracted from the database
                    // where the department name matches the user selected option
                    // the result is a table which includes the SELECT variables which only have the matching department name
                    const sql = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS name, roles.title, roles.salary, departments.name AS department
                    FROM employees 
                    RIGHT JOIN roles on employees.roles_id = roles.id 
                    RIGHT JOIN departments ON departments.id = roles.department_id 
                    WHERE name = '${departName}';`
                    db.query(sql, (err, rows) => {
                        if (err) {
                            console.log(err)
                        }
                        // once the new array is formed with just the information pertaining to the department name selected
                        // the for loop extracts the salaries within the array and adds them to a budget variable which is initially set to 0
                        // the sum of the salaries is then presented in a console.table with the user selected department name and the total salary
                        let budget = 0;
                        for (let i = 0; i < rows.length; i++) {
                            budget += parseInt(rows[i].salary)
                        }
                        console.log("***********")
                        console.log(`The total utilized budget of the ${departName}`)
                        console.table([
                            {
                                Department_Name: departName,
                                Budget: budget
                            }
                        ]);
                        setTimeout(() => {
                            additionalFeatures();
                        }, 1000)
                    })
                })
        })
    }

    if (moreFunctions === "***Return to original prompt***") {
        // this option from the additional features prompt return back the original prompt
        initialPrompt()
    }

}

const finishPrompt = function () {
    // A message to tell the user that they are exiting the database
    console.log('Exiting Company Database!')
    // This quits the node call
    process.exit()
}

module.exports = initialPrompt;