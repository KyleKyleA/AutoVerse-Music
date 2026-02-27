create TABLE users(
    id int auto_increment primary key,
    first_name varchar(255),
    last_name varchar(255),
    email varchar(255),
    birth_date date,
    password varchar(255)
);