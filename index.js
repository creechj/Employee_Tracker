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
departmentQuery();
roleQuery();

// function to process menu options
const queryBuilder = function (action) {
  var choice = menuOptions.indexOf(action);
  switch (choice) {
    case 0:
      pool
        .promise()
        .query("SELECT * FROM department")
        .then(([rows, fields]) => {
          console.table(rows);
          startPrompt();
        });
      break;
    case 1:
      pool
        .promise()
        .query("SELECT * FROM employee")
        .then(([rows, fields]) => {
          console.table(rows);
          startPrompt();
        });
      break;
    case 2:
      pool
        .promise()
        .query("SELECT * FROM role")
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
              `SELECT * FROM employee WHERE manager_id = (SELECT id FROM employee WHERE first_name = "${response.managers.substring(
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
              `SELECT * FROM employee WHERE employee.role_id IN (SELECT id FROM role WHERE department_id = (SELECT id FROM department WHERE name = '${response.departments}'))`
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
              `SELECT department.name as "Department Name", AVG(role.salary) * COUNT(employee.role_id) AS "Total Salary" FROM department, role JOIN employee ON employee.role_id = role.id WHERE department.name = '${response.departments}' AND role.department_id = department.id GROUP BY department.name, department_id`
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
            choices: employeeChoices,
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
              }'), ${employeeChoices.indexOf(response.manager) + 1})`
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

// const testFunction = function() {
//   var testString = 'Testing String'
//  console.log(testString.substring(0, testString.indexOf(' ')));
//  console.log(testString.substring(testString.indexOf(' ')+1, testString.length));
// };

// testFunction();

// TODOs:
// create query like employees for depts & roles
// remember to recall these queries after updates to tables
// finish list of query options
