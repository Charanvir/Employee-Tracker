-- This page will insert the perliminary data into the database, potentially will be used after when application is compelted
-- template data at the moment
INSERT INTO departments (department_name)
VALUES
    ('UX Team'),
    ('Backend Team'),
    ('Quality Assurance'),
    ('Accounting'),
    ('Marketing'),
    ('Human Resources'),
    ('Legal'),
    ('Sales');

INSERT INTO roles (title, salary, department_id)
VALUES 
    ('UX Team Leader', 130000, 1),
    ('UX Researcher', 110000, 1),
    ('UX Designer', 90000, 1),
    ('Frontend Developers', 90000, 1),
    ('Backend Team Leader', 150000, 2),
    ('Middle-stack developers', 120000, 2),
    ('Backend Engineer', 120000, 2),
    ('Quality Assurance Team Leader', 80000, 3),
    ('Quality Assurance Analyst', 70000, 3),
    ('Quality Assurance Tester', 75000, 3),
    ('Marketing Team Leader', 100000, 4),
    ('Marketing', 75000, 4),
    ('Human Resources Team Leader', 80000, 5),
    ('Talent Management', 80000, 5),
    ('Training and Development', 75000, 5),
    ('Compensation and Benefits', 75000, 5),
    ('Laywer', 135000, 6),
    ('Sales Representative', 80000, 7);

INSERT INTO employees (first_name, last_name, roles_id, manager_id)
VALUES
    ('Manveer', 'Sohal', 1, null),
    ('Reeva', 'Sierra', 2, 1),
    ('Roshan', 'Shields', 3, 1),
    ('Yousaf', 'Hastings', 4, 1),
    ('Chace', 'Khan', 4, 1),
    ('Charanvir', 'Singh', 5, null),
    ('Augustus', 'Pickett', 6, 6),
    ('Karolina', 'Merritt', 6, 6),
    ('Kaci', 'Hackett', 7, 6),
    ('Ace', 'Souther', 7, 6),
    ('Franklyn', 'Medina', 7, 6),
    ('Gurvir', 'Sohal', 8, null),
    ('Franklyn', 'Medina', 9, 12),
    ('Chelsea', 'Morin', 10, 12),
    ('Kishan', 'Bautista', 10, 12),
    ('Simrin', 'Singh', 11, null),
    ('Cynthia', 'Browning', 12, 16),
    ('Gagandeep', 'Singh', 13, null),
    ('Aahil', 'Wade', 14, 18),
    ('Elly', 'Leal', 15, 18),
    ('Izaak', 'Curran', 16, 18),
    ('Shahid', 'Boyce', 17, null),
    ('Sannah', 'Broadhurst', 17, null),
    ('Ahmet', 'Gates', 18, null),
    ('Faris', 'Hail', 18, null);