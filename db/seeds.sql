-- Active: 1686788184095@@127.0.0.1@3306@company_db
USE company_db;

INSERT INTO department (name)
VALUES ("IT"),
       ("Finance"),
       ("Human Resources"),
       ("Operations");

SELECT * FROM department;

INSERT INTO role (title, salary, department_id)
VALUES ("ERP Administrator", 100000, 1),
       ("ERP Analyst", 80000, 1),
       ("Chief Financial Officer", 200000, 2),
       ("Senior Accountant", 90000, 2),
       ("HR Manager", 100000, 3),
       ("Ops Director", 100000, 4),
       ("Junior Operator", 70000, 4);

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


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jack', 'London', (SELECT id FROM role WHERE title = 'Senior Accountant'), 3);

SELECT manager_id as manager, COUNT(first_name) as employees FROM employee WHERE manager_id IS NOT NULL GROUP BY manager_id;

SELECT * FROM employee;

SELECT * FROM employee WHERE manager_id = (SELECT id FROM employee WHERE first_name = "Enid" AND last_name = "Blyton");

SELECT SUM(salary) * COUNT((SELECT role_id FROM employee WHERE employee.role_id IN (SELECT id FROM role WHERE department_id = (SELECT id FROM department WHERE name = 'IT')))) FROM role WHERE department_id IN (SELECT id FROM department WHERE name = 'IT');


SELECT SUM(role.salary) * COUNT(employee.role_id) AS Total_Salary FROM role JOIN employee ON employee.role_id = role.id WHERE department_id = (SELECT id FROM department WHERE name = 'Finance') GROUP BY department_id;
SELECT department.name as "Department Name", AVG(role.salary) * COUNT(employee.role_id) AS "Total Salary" FROM department, role JOIN employee ON employee.role_id = role.id WHERE department.name = 'IT' AND role.department_id = department.id GROUP BY department.name, department_id;

UPDATE employee SET role_id = (SELECT id FROM role WHERE title = 'ERP Analyst') WHERE first_name = 'JACK' AND last_name = 'London';

SELECT e1.id as id, e1.first_name as 'First Name', e1.last_name as 'Last Name', role.title as Title, (SELECT department.name FROM department WHERE department.id = role.department_id) as Department, CONCAT(e2.first_name, ' ', e2.last_name) as Manager, CONCAT('$', FORMAT(role.salary, 0)) as Salary FROM employee e1, employee e2, role WHERE e1.manager_id = e2.id AND e1.role_id = role.id;

SELECT employee.id as id, first_name as 'First Name', last_name as 'Last Name', role.title as Title, (SELECT department.name FROM department WHERE department.id = role.department_id) as Department, (SELECT CONCAT(first_name,' ', last_name)) as Manager, CONCAT('$', FORMAT(role.salary, 0)) as Salary FROM employee WHERE employee.id = employee.manager_id) m LEFT JOIN role ON role.id = employee.role_id;

SELECT employee.id as id, first_name as 'First Name', last_name as 'Last Name', role.title as Title, (SELECT department.name FROM department WHERE department.id = role.department_id) as Department, CONCAT('$', FORMAT(role.salary, 0)) as Salary, (SELECT CONCAT(first_name,' ', last_name) FROM employee e2 WHERE e2.id = employee.manager_id) as Manager FROM employee LEFT JOIN role ON role.id = employee.role_id;