create database board;

CREATE TABLE posts (
    post_id INT AUTO_INCREMENT not null,
    title VARCHAR(50) not null,
    content TEXT,
    password varchar(100) not null,
    author varchar(20) not null,
    created_at DATETIME not null,
    PRIMARY KEY (post_id)
);
