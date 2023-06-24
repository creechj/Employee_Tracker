require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE
    },
    console.log(`Connected to ${process.env.DATABASE}`)
  );

  db.query('SELECT * FROM employee', function (err, results) {
    console.table(results);
  });

  app.listen(PORT, () => {
    console.log(`App running on port: ${PORT}`);
  });