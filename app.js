/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
var PORT = 2014;

// Database
var db = require('./database/db-connector');


// Handlebars
const { engine } = require('express-handlebars');
app.engine('.hbs', engine({ extname: ".hbs" }));
app.set('view engine', '.hbs');



// Serve static files
app.use(express.static('public'));

// Parse form data
app.use(express.urlencoded({ extended: false }))

// Home route to display books and fetch authors and genres
app.get('/', function (req, res) {
    let get_books = "SELECT * FROM Books;";
    let get_authors = "SELECT * FROM Authors;";
    let get_genres = "SELECT * FROM Genres;";

    db.pool.query(get_books, function (error, books, fields) {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            db.pool.query(get_authors, function (error, authors, fields) {
                if (error) {
                    console.error(error);
                    res.sendStatus(400);
                } else {
                    db.pool.query(get_genres, function (error, genres, fields) {
                        if (error) {
                            console.error(error);
                            res.sendStatus(400);
                        } else {
                            res.render('index', { data: books, authors: authors, genres: genres });
                        }
                    });
                }
            });
        }
    });
});

///////////////Books///////////////

app.post('/add-book-form', function (req, res) {
    let data = req.body;

    let title = data['input-title'];
    let author_id = data['author_id'];
    let genre_id = data['genre_id'];
    let price = data['price'];
    let quantity = data['quantity'];

    let book_insert = `INSERT INTO Books (title, author_id, genre_id, price, quantity) VALUES (?, ?, ?, ?, ?)`;
    let values = [title, author_id, genre_id, price, quantity];

    db.pool.query(book_insert, values, function (error, rows, fields) {
        if (error) {
            console.error('Database Error:', error);
            res.status(400).send('Error adding book. Please ensure all fields are correctly filled.');
        } else {
            res.redirect('/');
        }
    });
});

app.post('/edit-book', function (req, res) {
    let data = req.body;

    let book_id = data['book_id'];
    let title = data['title'];
    let author_id = data['author_id'];
    let genre_id = data['genre_id'];
    let price = data['price'];
    let quantity = data['quantity'];

    let updateQuery = `UPDATE Books SET title = ?, author_id = ?, genre_id = ?, price = ?, quantity = ? WHERE book_id = ?`;
    let values = [title, author_id, genre_id, price, quantity, book_id];

    db.pool.query(updateQuery, values, function (error, results, fields) {
        if (error) {
            console.error('Query Error:', error);
            res.status(400).send('Error updating book. Please ensure all fields are correctly filled.');
        } else {
            res.redirect('/');
        }
    });
});

// Route to delete a book
app.post('/delete-book', function (req, res) {
    let data = req.body;

    let book_id = data['book_id'];

    let deleteQuery = `DELETE FROM Books WHERE book_id = ?`;
    db.pool.query(deleteQuery, [book_id], function (error, results, fields) {
        if (error) {
            console.error('Query Error:', error);
            res.status(400).send('Error deleting book.');
        } else {
            res.redirect('/');
        }
    });
});

///////////////Authors///////////////

// Get authors
app.get('/authors', function (req, res) {
    let get_authors = "SELECT * FROM Authors;";

    db.pool.query(get_authors, function (error, authors, fields) {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            res.render('authors', { data: authors });
        }
    });
});

// Edit author route
app.get('/edit-author/:id', async (req, res) => {
    const authorId = req.params.id;
    const [rows] = await pool.query('SELECT * FROM Authors WHERE author_id = ?', [authorId]);

    if (rows.length === 0) {
        return res.sendStatus(404);
    }

    res.render('authors', { editauthor: rows[0], data: [] });
});

// Update author
app.post('/update-author', (req, res) => {
    const { author_id, author_name, author_description } = req.body;

    // Check if author_id is present
    if (author_id) {
        // Update existing author
        const updateQuery = 'UPDATE Authors SET name = ?, description = ? WHERE author_id = ?';
        // ... (rest of the update logic)
    } else {
        // Add new author
        const insertQuery = 'INSERT INTO Authors (name, description) VALUES (?, ?)';
        // ... (rest of the insert logic)
    }
});

// Add author route
app.post('/add-author-form', (req, res) => {
    console.log(req.body); // Debugging: Log the request body to ensure the data is received

    const { 'author-name': author_name, 'author-description': author_description } = req.body;

    if (!author_name || !author_description) {
        return res.status(400).send('Please provide a name and description for the author.');
    }

    const insertQuery = 'INSERT INTO Authors (name, description) VALUES (?, ?)';

    db.pool.query(insertQuery, [author_name, author_description], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Internal server error');
        } else {
            res.redirect('/authors');
        }
    });
});


// Update author route
app.post('/update-author', async (req, res) => {
    const { author_id, author_title, author_description } = req.body;
    await pool.query('UPDATE Authors SET name = ?, description = ? WHERE author_id = ?', [author_name, author_description, author_id]);
    res.redirect('/authors');
});

// Delete author route
app.post('/delete-author', (req, res) => {
    const { author_id } = req.body;

    if (!author_id) {
        return res.status(400).send('author ID is required for deletion.');
    }

    const deleteQuery = 'DELETE FROM Authors WHERE author_id = ?';

    db.pool.query(deleteQuery, [author_id], (error, results) => {
        if (error) {
            console.error('Error deleting author:', error);
            return res.status(500).send('Internal server error. Unable to delete author.');
        }

        // Redirect back to authors page after successful deletion
        res.redirect('/authors');
    });
});





///////////////Genres///////////////
// Get Genres
app.get('/genres', function (req, res) {
    let get_genres = "SELECT * FROM Genres;";

    db.pool.query(get_genres, function (error, genres, fields) {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            res.render('genres', { data: genres });
        }
    });
});



// Edit genre route
app.get('/edit-genre/:id', async (req, res) => {
    const genreId = req.params.id;
    const [rows] = await pool.query('SELECT * FROM Genres WHERE genre_id = ?', [genreId]);

    if (rows.length === 0) {
        return res.sendStatus(404);
    }

    res.render('genres', { editGenre: rows[0], data: [] });
});

// Update Genre
app.post('/update-genre', (req, res) => {
    const { genre_id, genre_title, genre_description } = req.body;

    // Check if genre_id is present
    if (genre_id) {
        // Update existing genre
        const updateQuery = 'UPDATE Genres SET title = ?, description = ? WHERE genre_id = ?';
        // ... (rest of the update logic)
    } else {
        // Add new genre
        const insertQuery = 'INSERT INTO Genres (title, description) VALUES (?, ?)';
        // ... (rest of the insert logic)
    }
});

// Add genre route
app.post('/add-genre-form', (req, res) => {
    console.log(req.body); // Debugging: Log the request body to ensure the data is received

    const { 'genre-title': genre_title, 'genre-description': genre_description } = req.body;

    if (!genre_title || !genre_description) {
        return res.status(400).send('Please provide a title and description for the genre.');
    }

    const insertQuery = 'INSERT INTO Genres (title, description) VALUES (?, ?)';

    db.pool.query(insertQuery, [genre_title, genre_description], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Internal server error');
        } else {
            res.redirect('/genres');
        }
    });
});


// Update genre route
app.post('/update-genre', async (req, res) => {
    const { genre_id, genre_title, genre_description } = req.body;
    await pool.query('UPDATE Genres SET title = ?, description = ? WHERE genre_id = ?', [genre_title, genre_description, genre_id]);
    res.redirect('/genres');
});

// Delete genre route
app.post('/delete-genre', (req, res) => {
    const { genre_id } = req.body;

    if (!genre_id) {
        return res.status(400).send('Genre ID is required for deletion.');
    }

    const deleteQuery = 'DELETE FROM Genres WHERE genre_id = ?';

    db.pool.query(deleteQuery, [genre_id], (error, results) => {
        if (error) {
            console.error('Error deleting genre:', error);
            return res.status(500).send('Internal server error. Unable to delete genre.');
        }

        // Redirect back to genres page after successful deletion
        res.redirect('/genres');
    });
});

///////////////Customers///////////////
// Get customers
app.get('/customers', function (req, res) {
    let get_customers = "SELECT * FROM Customers;";

    db.pool.query(get_customers, function (error, customers, fields) {
        if (error) {
            console.error(error);
            res.sendStatus(400);
        } else {
            res.render('customers', { data: customers });
        }
    });
});



// Edit customer route
app.get('/edit-customer/:id', async (req, res) => {
    const customerId = req.params.id;
    const [rows] = await pool.query('SELECT * FROM Customers WHERE customer_id = ?', [customerId]);

    if (rows.length === 0) {
        return res.sendStatus(404);
    }

    res.render('customers', { editCustomer: rows[0], data: [] });
});

// Update customer
app.post('/update-customer', (req, res) => {
    const { customer_id, customer_name, customer_email } = req.body;

    // Check if customer_id is present
    if (customer_id) {
        // Update existing customer
        const updateQuery = 'UPDATE Customers SET name = ?, email = ? WHERE customer_id = ?';
        // ... (rest of the update logic)
    } else {
        // Add new customer
        const insertQuery = 'INSERT INTO Customers (name, email) VALUES (?, ?)';
        // ... (rest of the insert logic)
    }
});

// Add customer route
app.post('/add-customer-form', (req, res) => {
    console.log(req.body); // Debugging: Log the request body to ensure the data is received

    const { 'customer-name': customer_name, 'customer-email': customer_email } = req.body;

    if (!customer_name || !customer_email) {
        return res.status(400).send('Please provide a name and email for the customer.');
    }

    const insertQuery = 'INSERT INTO Customers (name, email) VALUES (?, ?)';

    db.pool.query(insertQuery, [customer_name, customer_email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).send('Internal server error');
        } else {
            res.redirect('/customers');
        }
    });
});


// Update customer route
app.post('/update-customer', async (req, res) => {
    const { customer_id, customer_name, customer_email } = req.body;
    await pool.query('UPDATE customers SET name = ?, email = ? WHERE customer_id = ?', [customer_name, customer_email, customer_id]);
    res.redirect('/customers');
});

// Delete customer route
app.post('/delete-customer', (req, res) => {
    const { customer_id } = req.body;

    if (!customer_id) {
        return res.status(400).send('customer ID is required for deletion.');
    }

    const deleteQuery = 'DELETE FROM Customers WHERE customer_id = ?';

    db.pool.query(deleteQuery, [customer_id], (error, results) => {
        if (error) {
            console.error('Error deleting customer:', error);
            return res.status(500).send('Internal server error. Unable to delete customer.');
        }

        // Redirect back to customers page after successful deletion
        res.redirect('/customers');
    });
});








/*
    LISTENER
*/
app.listen(PORT, function () {
    console.log('Express started on http://10.162.0.184:' + PORT + '; press Ctrl-C to terminate.');
});




/*
    Sources
*/

// - ** Express.js Documentation **: Used for understanding JS
//   - [https://expressjs.com/](https://expressjs.com/)

// - ** Node.js MySQL Package **: Used for understanding JS
//   - [https://www.npmjs.com/package/mysql](https://www.npmjs.com/package/mysql)
