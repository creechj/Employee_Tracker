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

// array for prompts with employee options
var employeeChoices = [];

// function to query employees by name
const employeeQuery = async function() {
  pool.query(
  {
    sql: "SELECT CONCAT(first_name, ' ', last_name) AS employee FROM employee",
    rowsAsArray: true,
  },
  function (err, results, fields) {
    var arr = []
    for (let i = 0; i < results.length; i++) {
      arr.push(results[i][0]);
    }
    employeeChoices = arr
    return employeeChoices;
  }
)};

employeeQuery()


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
              `SELECT * FROM employee WHERE manager_id = ${
                employeeChoices.indexOf(response.managers) + 1
              }`
            )
            .then(([rows, fields]) => {
              console.table(rows);
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
