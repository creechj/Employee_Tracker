-- Active: 1686788184095@@127.0.0.1@3306@company_db
USE company_db;

INSERT INTO department (id, name)
VALUES (1, "IT"),
       (2, "Finance"),
       (3, "Human Resources"),
       (4, "Operations");

SELECT * FROM department;

INSERT INTO role (id, title, salary, department_id)
VALUES (1, "ERP Administrator", 100000, 1),
       (2, "ERP Analyst", 80000, 1),
       (3, "Chief Financial Officer", 200000, 2),
       (4, "Senior Accountant", 90000, 2),
       (5, "HR Manager", 100000, 3),
       (6, "Ops Director", 100000, 4),
       (7, "Junior Operator", 70000, 4);

SELECT * FROM role;


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("William", "Shakespeare", 1, null),
       ("Agatha", "Christie", 2, 1),
       ("Barbara", "Cartland", 3, null),
       ("Danielle", "Steel", 4, 3),
       ("Harold", "Robbins", 4, 3),
       ("Georges", "Simenon", 5, null),
       ("Enid", "Blyton", 6, null),
       ("Sidney", "Sheldon", 7, 7),
       ("Gilbert", "Patten", 7, 7),
       ("Doctor", "Seuss", 7, 7),
       ("Leo", "Tolstoy", 7, 7);

SELECT manager_id as manager, COUNT(first_name) as employees FROM employee WHERE manager_id IS NOT NULL GROUP BY manager_id;

SELECT * FROM employee;

SELECT * FROM employee WHERE manager_id = (SELECT id FROM employee WHERE first_name = "Enid" AND last_name = "Blyton");

SELECT * FROM employee WHERE employee.role_id IN (SELECT id FROM role WHERE department_id = (SELECT id FROM department WHERE name = 'IT'));

