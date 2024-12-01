-- Table structure for table `Authors`
Create or Replace Table `Authors` (
  `author_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`author_id`)
);

-- Table structure for table `Genres`
Create or Replace Table `Genres` (
  `genre_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`genre_id`)
);

-- Table structure for table `Customers`
Create or Replace Table `Customers` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `email` (`email`)
);

-- Table structure for table `Books`
Create or Replace Table `Books` (
  `book_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `author_id` int NOT NULL,
  `genre_id` int NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`book_id`),
  KEY `author_id` (`author_id`),
  KEY `genre_id` (`genre_id`),
  CONSTRAINT `Books_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `Authors` (`author_id`) ON DELETE CASCADE,
  CONSTRAINT `Books_ibfk_2` FOREIGN KEY (`genre_id`) REFERENCES `Genres` (`genre_id`) ON DELETE CASCADE
);

-- Table structure for table `Sales`
Create or Replace Table `Sales` (
  `sale_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `book_id` int NOT NULL,
  `quantity_purchased` int NOT NULL,
  `transaction_total` decimal(10,2) DEFAULT NULL,
  `sale_date` date NOT NULL,
  PRIMARY KEY (`sale_id`),
  KEY `customer_id` (`customer_id`),
  KEY `book_id` (`book_id`),
  CONSTRAINT `Sales_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `Customers` (`customer_id`) ON DELETE CASCADE,
  CONSTRAINT `Sales_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `Books` (`book_id`) ON DELETE CASCADE
);

-- Table structure for table `Books_has_Sales`
Create or Replace TABLE `Books_has_Sales` (
  `Books_book_id` int NOT NULL,
  `Sales_sale_id` int NOT NULL,
  `Sales_customer_id` int NOT NULL,
  PRIMARY KEY (`Books_book_id`, `Sales_sale_id`, `Sales_customer_id`),
  KEY `Sales_sale_id` (`Sales_sale_id`),
  KEY `Sales_customer_id` (`Sales_customer_id`),
  CONSTRAINT `Books_has_Sales_ibfk_1` FOREIGN KEY (`Books_book_id`) REFERENCES `Books` (`book_id`) ON DELETE CASCADE,
  CONSTRAINT `Books_has_Sales_ibfk_2` FOREIGN KEY (`Sales_sale_id`) REFERENCES `Sales` (`sale_id`) ON DELETE CASCADE,
  CONSTRAINT `Books_has_Sales_ibfk_3` FOREIGN KEY (`Sales_customer_id`) REFERENCES `Customers` (`customer_id`) ON DELETE CASCADE
);

COMMIT;


-- Entries for the Authors Table
INSERT INTO Authors (author_id, name, description)
VALUES
(1, 'Stephanie Quenn', 'Author of terrifying horror tales'),
(2, 'Cebello', 'Known for risky adventure novels'),
(3, 'Brando Sando', 'Fantasy author and world-builder'),
(4, 'Monica Bridgette', 'Stories full of drama, and Intrigue'),
(5, 'Gravette Hamilton', 'Science fiction author that focuses on multiple dimensions');

-- Entries for the Genres Table
INSERT INTO Genres (genre_id, title, description)
VALUES
(1, 'Thriller', 'Suspenseful and full of twists'),
(2, 'Adventure', 'Long Road Ahead'),
(3, 'Fantasy', 'Fictional Locations, Dragons, Magic, and Colors'),
(4, 'Drama', 'Emotional stories and character depth'),
(5, 'Science Fiction', 'Futuristic concepts and technology');


-- Entries for the Customers Table
INSERT INTO Customers (customer_id, name, email)
VALUES
(1, 'John Smith', 'john.smith@example.com'),
(2, 'Emily Johnson', 'emily.johnson@example.com'),
(3, 'Michael Brown', 'michael.brown@example.com'),
(4, 'Sarah Davis', 'sarah.davis@example.com'),
(5, 'Jane Smith', 'jane.smith123@example.com');


-- Entries for the Books Table
INSERT INTO Books (book_id, title, author_id, genre_id, price, quantity)
VALUES
(1, 'The Last Echo', 1, 1, 20.00, 10),
(2, 'Whispers of the Mountain', 2, 2, 7.25, 5),
(3, 'The Lost Dragon of the Ealiago', 3, 3, 24.20, 20),
(4, 'The Last Call of the Shift', 4, 4, 10.00, 12),
(5, 'Shadows of Time and Wind', 5, 5, 25.00, 7);


-- Entries for the Sales Table
INSERT INTO Sales (sale_id, customer_id, book_id, quantity_purchased, transaction_total, sale_date)
VALUES
(1, 1, 1, 1, 20.00, '2024-01-15'),
(2, 2, 2, 2, 14.50, '2024-02-10'),
(3, 3, 3, 5, 121.00, '2024-03-05'),
(4, 4, 4, 3, 30.00, '2024-04-20'),
(5, 5, 5, 1, 25.00, '2024-05-14');


-- Entries for the Books_has_Sales Table
INSERT INTO Books_has_Sales (Books_book_id, Sales_sale_id, Sales_customer_id)
VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4),
(5, 5, 5);
