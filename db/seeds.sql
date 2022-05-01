-- This page will insert the perliminary data into the database, potentially will be used after when application is compelted
-- template data at the moment
INSERT INTO departments (name)
VALUES
    ('Backend Department'),
    ('Frontend Department'),
    ('Full Stack Department'),
    ('Quality Assurance Department');

INSERT INTO roles (title, salary, department_id)
VALUES 
    ('Backend Team Lead', 130000, 1),
    ('Backend Engineer', 110000, 1),
    ('Frontend Team Lead', 90000, 2),
    ('Frontend Engineer', 90000, 2),
    ('Full Stack Team Lead', 150000, 3),
    ('Full Stack Engineer', 120000, 3),
    ('Quality Assurance Team Lead', 120000, 4),
    ('Quality Assurance', 120000, 4);

INSERT INTO employees (first_name, last_name, roles_id, manager_id)
VALUES
    ('Manveer', 'Sohal', 1, null),
    ('Gurvir', 'Sohal', 2, 1),
    ('Yash', 'Pabla', 3, null),
    ('Joe', 'Samra', 4, 3),
    ('Charanvir', 'Singh', 5, null),
    ('Randeep', 'Singh', 6, 5),
    ('Simrin', 'Singh', 7, null),
    ('Ptaps', 'Deol', 8, 7);