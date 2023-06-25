require("dotenv").config();
const mysql = require("mysql2");
const inquirer = require("inquirer");

// database connection
const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
  },
  console.log(`Connected to ${process.env.DATABASE}`)
);

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

const managerChoices = db.query("SELECT * FROM employee", function (err, results) {
  return results;
});

console.log(managerChoices);

// function to process menu options
const queryBuilder = function (action) {
  var choice = menuOptions.indexOf(action);
  switch (choice) {
    case 0:
      db.query("SELECT * FROM department", function (err, results) {
        console.table(results);
      });
      startPrompt();
      break;
    case 1:
      db.query("SELECT * FROM employee", function (err, results) {
        console.table(results);
      });
      startPrompt();
      break;
    case 2:
      db.query("SELECT * FROM role", function (err, results) {
        console.table(results);
      });
      startPrompt();
      break;
    case 3:
      inquirer
        .prompt([
          {
            type: "list",
            message: 'Select a manager:',
            choices: ["Departments", "Employees", "Roles"],
            name: "managers",
          },
        ])
        .then((response) => {
          console.log(response.tableviews);
          db.query(
            `SELECT * FROM ${response.tableviews.toLowerCase().slice(0, -1)}`,
            function (err, results) {
              console.table(results);
            }
          );
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
      // console.log(response.action);
    });
};

startPrompt();
