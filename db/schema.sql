DROP DATABASE IF EXISTS company_db;

CREATE DATABASE company_db;

USE company_db;

DROP TABLE department, role, employee;

CREATE TABLE department (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(30)
);

DROP TABLE role;

CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL ON UPDATE CASCADE
);

DROP TABLE employee;

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT NULL,
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
    ON DELETE SET NULL ON UPDATE CASCADE
);