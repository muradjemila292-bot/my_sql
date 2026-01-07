CREATE DATABASE library_db;
USE library_db

CREATE TABLE authors (
author_id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100) NOT NULL,
bio TEXT,
country VARCHAR(50)
)

CREATE TABLE books (
book_id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(100) NOT NULL,
genre VARCHAR(50),
published_year INT,
is_available BOOLEAN DEFAULT TRUE,
author_id INT,
FOREIGN KEY (author_id) REFERENCES authors(author_id) ON DELETE CASCADE
)

DESCRIBE authors;

DESCRIBE books;

INSERT INTO authors (name, bio, country) VALUES ("Alex Michaelides","British-Cypriot author,screenwriter, and novelist", "UK"),("Harper Lee", 'American novelist known for addressing racial issues',"USA"),("George Orwell","English novelist, essayist,and critic","UK"),("Jane Austen","English novelist known for her romantic fiction","UK"),("Paulo Coelho","Brazilianauthor known for philosophicalnovels","Brazil"),("Yuval Noah Harari","Israeli historian and professor, writes on humanity",'Israel');

SELECT * FROM authors;

INSERT INTO books (title, genre, published_year, is_available,author_id) VALUES("The Silent Patient","Thriller",2019,TRUE,1),("To Kill a Mockingbird","Fiction",1960,TRUE,2),("1984","Dystopian",1949,FALSE,3),("Pride and Prejudice","Romance",1813,TRUE,4),("The Alchemmist","Adventure",1988,TRUE,5),("Sapiens","Non-fiction",2011,TRUE,6) 

SELECT * FROM books;

ALTER TABLE authors ADD COLUMN is_active BOOLEAN DEFAULT true

