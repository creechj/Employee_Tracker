require("dotenv").config();
const mysql = require("mysql2");
const inquirer = require("inquirer");

// database connection
const pool = mysql.createPool({
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Options for start prompt
const menuOptions = [
  "View all departments",
  "View all employees",
  "View all roles",
  "View employees by manager",
  "View employees by department",
  "View salary budget by department",
  "Add a department",
  "Add an employee",
  "Add a role",
  "Update an employee's role",
  "Update an employee's manager",
  "Delete a department",
  "Delete an employee",
  "Delete a role",
];

// array for dynamic prompt choices
var employeeChoices = [];
var managerChoices = [];
var departmentChoices = [];
var roleChoices = [];

// function to query employees by name
const employeeQuery = async function () {
  pool.query(
    {
      sql: "SELECT CONCAT(first_name, ' ', last_name) AS employee FROM employee",
      rowsAsArray: true,
    },
    function (err, results, fields) {
      var arr = [];
      for (let i = 0; i < results.length; i++) {
        arr.push(results[i][0]);
      }
      employeeChoices = arr;
      return employeeChoices;
    }
  );
};

// function to query employees by name
const managerQuery = async function () {
  pool.query(
    {
      sql: "SELECT CONCAT(first_name, ' ', last_name) AS employee FROM employee",
      rowsAsArray: true,
    },
    function (err, results, fields) {
      var arr = [];
      for (let i = 0; i < results.length; i++) {
        arr.push(results[i][0]);
      }
      arr.push(0)
      managerChoices = arr;
      return managerChoices;
    }
  );
};

// function to query departments
const departmentQuery = async function () {
  pool.query(
    {
      sql: "SELECT name FROM department",
      rowsAsArray: true,
    },
    function (err, results, fields) {
      var arr = [];
      for (let i = 0; i < results.length; i++) {
        arr.push(results[i][0]);
      }
      departmentChoices = arr;
      return departmentChoices;
    }
  );
};

// function to query roles
const roleQuery = async function () {
  pool.query(
    {
      sql: "SELECT title FROM role",
      rowsAsArray: true,
    },
    function (err, results, fields) {
      var arr = [];
      for (let i = 0; i < results.length; i++) {
        arr.push(results[i][0]);
      }
      roleChoices = arr;
      return roleChoices;
    }
  );
};

employeeQuery();
managerQuery();
departmentQuery();
roleQuery();

// function to process menu options
const queryBuilder = function (action) {
  var choice = menuOptions.indexOf(action);
  switch (choice) {
    case 0:
      pool
        .promise()
        .query("SELECT id, name as Department FROM department")
        .then(([rows, fields]) => {
          console.table(rows);
          startPrompt();
        });
      break;
    case 1:
      pool
        .promise()
        .query(
          "SELECT employee.id as id, first_name as 'First Name', last_name as 'Last Name', role.title as Title, (SELECT department.name FROM department WHERE department.id = role.department_id) as Department, CONCAT('$', FORMAT(role.salary, 0)) as Salary, (SELECT CONCAT(first_name,' ', last_name) FROM employee e2 WHERE e2.id = employee.manager_id) as Manager FROM employee LEFT JOIN role ON role.id = employee.role_id"
        )
        .then(([rows, fields]) => {
          console.table(rows);
          startPrompt();
        });
      break;
    case 2:
      pool
        .promise()
        .query(
          "SELECT role.id, title as Title, CONCAT('$', FORMAT(salary, 0)) as Salary, name as Department FROM role LEFT JOIN department ON department.id = role.department_id"
        )
        .then(([rows, fields]) => {
          console.table(rows);
          startPrompt();
        });
      break;
    case 3:
      inquirer
        .prompt([
          {
            type: "list",
            message: "Select a manager:",
            choices: employeeChoices,
            name: "managers",
          },
        ])
        .then((response) => {
          pool
            .promise()
            .query(
              `SELECT id, CONCAT(first_name, ' ', last_name) as Employee FROM employee WHERE manager_id = (SELECT id FROM employee WHERE first_name = "${response.managers.substring(
                0,
                response.managers.indexOf(" ")
              )}" AND last_name = "${response.managers.substring(
                response.managers.indexOf(" ") + 1,
                response.managers.length
              )}")`
            )
            .then(([rows, fields]) => {
              console.table(rows);
              startPrompt();
            });
        });
      break;
    case 4:
      inquirer
        .prompt([
          {
            type: "list",
            message: "Select a department:",
            choices: departmentChoices,
            name: "departments",
          },
        ])
        .then((response) => {
          pool
            .promise()
            .query(
              `SELECT id, CONCAT(first_name, ' ', last_name) as Employee, (SELECT title FROM role WHERE role.id = employee.role_id) as Position, manager_id as 'Manager ID' FROM employee WHERE employee.role_id IN (SELECT id FROM role WHERE department_id = (SELECT id FROM department WHERE name = '${response.departments}'))`
            )
            .then(([rows, fields]) => {
              console.table(rows);
              startPrompt();
            });
        });
      break;
    case 5:
      inquirer
        .prompt([
          {
            type: "list",
            message: "Select a department:",
            choices: departmentChoices,
            name: "departments",
          },
        ])
        .then((response) => {
          pool
            .promise()
            .query(
              `SELECT department.name as "Department Name", CONCAT('$', FORMAT(AVG(role.salary) * COUNT(employee.role_id), 0)) AS "Total Salary" FROM department, role LEFT JOIN employee ON employee.role_id = role.id WHERE department.name = '${response.departments}' AND role.department_id = department.id GROUP BY department.name, department_id`
            )
            .then(([rows, fields]) => {
              console.table(rows);
              startPrompt();
            });
        });
      break;
    case 6:
      inquirer
        .prompt([
          {
            type: "input",
            message: "Enter a new department name:",
            name: "dept",
          },
        ])
        .then((response) => {
          pool
            .promise()
            .query(`INSERT INTO department (name) VALUES ('${response.dept}')`)
            .then(([rows, fields]) => {
              console.log("Department added.");
              departmentQuery();
              startPrompt();
            });
        });
      break;
    case 7:
      inquirer
        .prompt([
          {
            type: "input",
            message: "Employee's first name:",
            name: "first",
          },
          {
            type: "input",
            message: "Employee's last name:",
            name: "last",
          },
          {
            type: "list",
            message: "Employee's role:",
            choices: roleChoices,
            name: "role",
          },
          {
            type: "list",
            message: "Who is the employee's manager?",
            choices: managerChoices,
            name: "manager",
          },
        ])
        .then((response) => {
          pool
            .promise()
            .query(
              `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${
                response.first
              }', '${response.last}', (SELECT id FROM role WHERE title = '${
                response.role
              }'), IF(${employeeChoices.indexOf(response.manager) + 1}=0, null, ${employeeChoices.indexOf(response.manager) + 1}))`
            )
            .then(([rows, fields]) => {
              console.log("Employee added.");
              employeeQuery();
              startPrompt();
            });
        });
      break;
    case 8:
      inquirer
        .prompt([
          {
            type: "input",
            message: "Role title:",
            name: "title",
          },
          {
            type: "input",
            message: "Salary for role:",
            name: "salary",
          },
          {
            type: "list",
            message: "What department will this role fall under?",
            choices: departmentChoices,
            name: "department",
          },
        ])
        .then((response) => {
          pool
            .promise()
            .query(
              `INSERT INTO role (title, salary, department_id)
              VALUES ('${response.title}', ${response.salary}, (SELECT id FROM department WHERE name = '${response.department}'))`
            )
            .then(([rows, fields]) => {
              console.log("Role added.");
              roleQuery();
              startPrompt();
            });
        });
      break;
    case 9:
      inquirer
        .prompt([
          {
            type: "list",
            message: "Employee to update:",
            choices: employeeChoices,
            name: "employee",
          },
          {
            type: "list",
            message: "Employee's role:",
            choices: roleChoices,
            name: "role",
          },
        ])
        .then((response) => {
          pool
            .promise()
            .query(
              `UPDATE employee SET role_id = (SELECT id FROM role WHERE title = '${
                response.role
              }') WHERE first_name = '${response.employee.substring(
                0,
                response.employee.indexOf(" ")
              )}' AND last_name = '${response.employee.substring(
                response.employee.indexOf(" ") + 1,
                response.employee.length
              )}'`
            )
            .then(([rows, fields]) => {
              console.log("Employee's role updated.");
              employeeQuery();
              startPrompt();
            });
        });
      break;
    case 10:
      inquirer
        .prompt([
          {
            type: "list",
            message: "Employee to update:",
            choices: employeeChoices,
            name: "employee",
          },
          {
            type: "list",
            message: "Employee's manager:",
            choices: managerChoices,
            name: "manager",
          },
        ])
        .then((response) => {
          pool
            .promise()
            .query(
              `UPDATE employee SET manager_id = IF(${
                employeeChoices.indexOf(response.manager) + 1
              }=0, null, ${
                employeeChoices.indexOf(response.manager) + 1
              }) WHERE first_name = '${response.employee.substring(
                0,
                response.employee.indexOf(" ")
              )}' AND last_name = '${response.employee.substring(
                response.employee.indexOf(" ") + 1,
                response.employee.length
              )}'`
            )
            .then(([rows, fields]) => {
              console.log("Employee's manager updated.");
              employeeQuery();
              startPrompt();
            });
        });
      break;
    case 11:
      inquirer
        .prompt([
          {
            type: "list",
            message: "Department to delete:",
            choices: departmentChoices,
            name: "department",
          },
        ])
        .then((response) => {
          pool
            .promise()
            .query(
              `DELETE FROM department WHERE name = '${response.department}'`
            )
            .then(([rows, fields]) => {
              console.log("Department deleted.");
              departmentQuery();
              startPrompt();
            });
        });
      break;
    case 12:
      inquirer
        .prompt([
          {
            type: "list",
            message: "Employee to delete:",
            choices: employeeChoices,
            name: "employee",
          },
        ])
        .then((response) => {
          pool
            .promise()
            .query(
              `DELETE FROM employee WHERE first_name = '${response.employee.substring(
                0,
                response.employee.indexOf(" ")
              )}' AND last_name = '${response.employee.substring(
                response.employee.indexOf(" ") + 1,
                response.employee.length
              )}'`
            )
            .then(([rows, fields]) => {
              console.log("Employee deleted.");
              employeeQuery();
              startPrompt();
            });
        });
      break;
    case 13:
      inquirer
        .prompt([
          {
            type: "list",
            message: "Role to delete:",
            choices: roleChoices,
            name: "role",
          },
        ])
        .then((response) => {
          pool
            .promise()
            .query(`DELETE FROM role WHERE title = '${response.role}'`)
            .then(([rows, fields]) => {
              console.log("Role deleted.");
              roleQuery();
              startPrompt();
            });
        });
      break;
  }
};

const startPrompt = function () {
  inquirer
    .prompt([
      {
        type: "list",
        message: `What would you like to do?`,
        choices: menuOptions,
        name: "action",
      },
    ])
    .then((response) => {
      queryBuilder(response.action);
    });
};

startPrompt();
