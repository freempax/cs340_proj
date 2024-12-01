-- Queries will have ? for information that is entered by the user


-- Customers Queries
-- Get
SELECT * FROM Customers;

-- Add
INSERT INTO Customers (name, email) VALUES (?, ?);

-- Update
UPDATE Customers SET name = ?, email = ? WHERE customer_id = ?;

-- Delete
DELETE FROM Customers WHERE customer_id = ?;

-- Books Queries
-- Get
SELECT Books.book_id, Books.title, Books.price, Books.quantity, Authors.name AS author_name, Genres.title AS genre_title
FROM Books
JOIN Authors ON Books.author_id = Authors.author_id
JOIN Genres ON Books.genre_id = Genres.genre_id;

-- Add
INSERT INTO Books (title, author_id, genre_id, price, quantity) VALUES (?, ?, ?, ?, ?);

-- Update
UPDATE Books SET title = ?, author_id = ?, genre_id = ?, price = ?, quantity = ? WHERE book_id = ?;

-- Delete
DELETE FROM Books WHERE book_id = ?;

-- Authors Queries
-- Get
SELECT * FROM Authors;

-- Add
INSERT INTO Authors (name, description) VALUES (?, ?);

-- Update
UPDATE Authors SET name = ?, description = ? WHERE author_id = ?;

-- Delete
DELETE FROM Authors WHERE author_id = ?;

-- Genres Queries
-- Get
SELECT * FROM Genres;

-- Add
INSERT INTO Genres (title, description) VALUES (?, ?);

-- Update
UPDATE Genres SET title = ?, description = ? WHERE genre_id = ?;

-- Delete
DELETE FROM Genres WHERE genre_id = ?;

-- Sales Queries

-- Get
SELECT Sales.sale_id, Customers.name AS customer_name, Books.title AS book_title, Sales.quantity_purchased, Sales.transaction_total, Sales.sale_date
FROM Sales
JOIN Customers ON Sales.customer_id = Customers.customer_id
JOIN Books ON Sales.book_id = Books.book_id;

-- Insert
INSERT INTO Sales (customer_id, book_id, quantity_purchased, transaction_total, sale_date) VALUES (?, ?, ?, ?, ?);

-- Update
UPDATE Sales SET customer_id = ?, book_id = ?, quantity_purchased = ?, transaction_total = ?, sale_date = ? WHERE sale_id = ?;

-- Delete
DELETE FROM Sales WHERE sale_id = ?;
