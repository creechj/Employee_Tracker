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

SELECT manager_id as manager, COUNT(first_name) as employees FROM employee WHERE manager_id IS NOT NULL GROUP BY manager_id;