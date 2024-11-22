/*
    SETUP
*/

// Express
var express = require('express');
var app = express();
var PORT = 2055;

// Database
var db = require('./database/db-connector');


// Handlebars
const { engine } = require('express-handlebars');
app.engine('.hbs', engine({ extname: ".hbs" }));
app.set('view engine', '.hbs');

/*
    GET ROUTES
*/

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

// Route to display authors
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

// Route to display genres
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

/*
    POST ROUTES
*/

// Route to add a new book
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

// Route to add a new author
app.post('/add-author-form', function (req, res) {
    let data = req.body;

    let name = data['author-name'];
    let description = data['author-description'];

    let author_insert = `INSERT INTO Authors (name, description) VALUES (?, ?)`;
    let values = [name, description];

    db.pool.query(author_insert, values, function (error, rows, fields) {
        if (error) {
            console.error('Database Error:', error);
            res.status(400).send('Error adding author. Please ensure all fields are correctly filled.');
        } else {
            res.redirect('/authors');
        }
    });
});

// Route to add a new genre
app.post('/add-genre-form', function (req, res) {
    let data = req.body;

    let title = data['genre-title'];
    let description = data['genre-description'];

    let genre_insert = `INSERT INTO Genres (title, description) VALUES (?, ?)`;
    let values = [title, description];

    db.pool.query(genre_insert, values, function (error, rows, fields) {
        if (error) {
            console.error('Database Error:', error);
            res.status(400).send('Error adding genre.');
        } else {
            res.redirect('/genres');
        }
    });
});



// Updates:

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
