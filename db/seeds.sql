-- This page will insert the perliminary data into the database, potentially will be used after when application is compelted
-- template data at the moment
INSERT INTO departments (name)
VALUES
    ('Reseach and Development'),
    ('Programming'),
    ('Marketing'),
    ('Accounting');

INSERT INTO roles (title, salary, department_id)
VALUES 
    ('Project Lead', 150000, 1),
    ('Developer', 90000, 2),
    ('Social Media Manager', 75000, 3),
    ('Accountant', 120000, 4);

INSERT INTO employees (first_name, last_name, roles_id, manager_id)
VALUES
    ('Charanvir', 'Singh', 2, null);