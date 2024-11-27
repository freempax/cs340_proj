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


/* 
Newly Added
*/
// Serve static files
app.use(express.static('public'));

// Parse form data
app.use(express.urlencoded({ extended: false }))

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


// Genres route
app.get('/genres', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM Genres');
    res.render('genres', { data: rows });
});

// Edit genre route
// app.get('/edit-genre/:id', async (req, res) => {
//     const genreId = req.params.id;
//     const [rows] = await pool.query('SELECT * FROM Genres WHERE genre_id = ?', [genreId]);

//     if (rows.length === 0) {
//         return res.sendStatus(404);
//     }

//     res.render('genres', { editGenre: rows[0], data: [] });
// });

app.post('/update-genre', (req, res) => {
    const { genre_id, genre_title, genre_description } = req.body;

    if (!genre_id || !genre_title || !genre_description) {
        return res.status(400).send('Please provide a genre ID, title, and description.');
    }

    const updateQuery = 'UPDATE Genres SET title = ?, description = ? WHERE genre_id = ?';

    pool.query(updateQuery, [genre_title, genre_description, genre_id])
        .then(() => {
            res.redirect('/genres');
        })
        .catch(err => {
            console.error('Database error:', err);
            res.status(500).send('Internal server error');
        });
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
