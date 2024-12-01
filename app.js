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
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('index');
});


// Customers
app.get('/customers', (req, res) => {
    db.pool.query('SELECT * FROM Customers', (err, results) => {
        if (err) return res.status(500).send(err);
        res.render('customers', { data: results });
    });
});

app.post('/add-customer', (req, res) => {
    const { name, email } = req.body;
    db.pool.query('INSERT INTO Customers (name, email) VALUES (?, ?)', [name, email], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/customers');
    });
});

app.post('/edit-customer', (req, res) => {
    const { customer_id, name, email } = req.body;
    db.pool.query(
        'UPDATE Customers SET name = ?, email = ? WHERE customer_id = ?',
        [name, email, customer_id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.redirect('/customers');
        }
    );
});

app.post('/delete-customer', (req, res) => {
    const { customer_id } = req.body;
    db.pool.query('DELETE FROM Customers WHERE customer_id = ?', [customer_id], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/customers');
    });
});


// Books

// Books Routes

// Display all books
// app.get('/books', (req, res) => {
//     const getBooksQuery = `
//         SELECT Books.book_id, Books.title, Books.price, Books.quantity,
//                Authors.name AS author_name, Genres.title AS genre_title
//         FROM Books
//         JOIN Authors ON Books.author_id = Authors.author_id
//         JOIN Genres ON Books.genre_id = Genres.genre_id`;
//     db.pool.query(getBooksQuery, (err, books) => {
//         if (err) return res.status(

// app.get('/books', (req, res) => {
//     const getBooks = 'SELECT * FROM Books';
//     const getAuthors = 'SELECT * FROM Authors';
//     const getGenres = 'SELECT * FROM Genres';

//     db.pool.query(getBooks, (err, books) => {
//         if (err) return res.status(500).send(err);
//         db.pool.query(getAuthors, (err, authors) => {
//             if (err) return res.status(500).send(err);
//             db.pool.query(getGenres, (err, genres) => {
//                 if (err) return res.status(500).send(err);
//                 res.render('books', { books, authors, genres });
//             });
//         });
//     });
// });


// app.get('/books', (req, res) => {
//     db.pool.query('SELECT * FROM Books', (err, results) => {
//         if (err) return res.status(500).send(err);
//         res.render('books', { data: results });
//     });
// });

// app.post('/add-book', (req, res) => {
//     const { book_id, title, author_id, genre_id, price, quantity } = req.body;
//     db.pool.query('INSERT INTO books (name, email) VALUES (?, ?)', [book_id, title, author_id, genre_id, price, quantity], (err) => {
//         if (err) return res.status(500).send(err);
//         res.redirect('/books');
//     });
// });

// app.post('/edit-book', (req, res) => {
//     const { book_id, title, author_id, genre_id, price, quantity } = req.body;
//     db.pool.query(
//         'UPDATE Books SET title = ?, price = ?, quantity = ? WHERE book_id = ?',
//         [price, quantity, book_id],
//         (err) => {
//             if (err) return res.status(500).send(err);
//             res.redirect('/books');
//         }
//     );
// });

// app.post('/delete-book', (req, res) => {
//     const { book_id } = req.body;
//     db.pool.query('DELETE FROM books WHERE book_id = ?', [book_id], (err) => {
//         if (err) return res.status(500).send(err);
//         res.redirect('/books');
//     });
// });
// function populateEditForm(data) {
//     // Set other input fields
//     document.getElementById('author_id').value = data.author_id;
//     document.getElementById('genre_id').value = data.genre_id;
//     // Show the form
// }
// Books Routes

// Display all books
app.get('/books', (req, res) => {
    const getBooksQuery = `
        SELECT Books.book_id, Books.title, Books.price, Books.quantity,
               Authors.name AS author_name, Genres.title AS genre_title
        FROM Books
        JOIN Authors ON Books.author_id = Authors.author_id
        JOIN Genres ON Books.genre_id = Genres.genre_id
    `;
    db.pool.query(getBooksQuery, (err, books) => {
        if (err) return res.status(500).send(err);
        db.pool.query('SELECT * FROM Authors', (err, authors) => {
            if (err) return res.status(500).send(err);
            db.pool.query('SELECT * FROM Genres', (err, genres) => {
                if (err) return res.status(500).send(err);
                res.render('books', { books, authors, genres });
            });
        });
    });
});

// Add a new book
app.post('/add-book', (req, res) => {
    const { title, author_id, genre_id, price, quantity } = req.body;
    const addBookQuery = `
        INSERT INTO Books (title, author_id, genre_id, price, quantity)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.pool.query(addBookQuery, [title, author_id, genre_id, price, quantity], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/books');
    });
});

// Edit an existing book
app.post('/edit-book', (req, res) => {
    const { book_id, title, author_id, genre_id, price, quantity } = req.body;
    const editBookQuery = `
        UPDATE Books
        SET title = ?, author_id = ?, genre_id = ?, price = ?, quantity = ?
        WHERE book_id = ?
    `;
    db.pool.query(editBookQuery, [title, author_id, genre_id, price, quantity, book_id], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/books');
    });
});

// Delete a book
app.post('/delete-book', (req, res) => {
    const { book_id } = req.body;
    const deleteBookQuery = 'DELETE FROM Books WHERE book_id = ?';
    db.pool.query(deleteBookQuery, [book_id], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/books');
    });
});



// Authors 

// Genres 
app.get('/genres', (req, res) => {
    db.pool.query('SELECT * FROM Genres', (err, results) => {
        if (err) return res.status(500).send(err);
        res.render('genres', { data: results });
    });
});

app.post('/add-genre', (req, res) => {
    const { title, description } = req.body;
    db.pool.query('INSERT INTO Genres (title, description) VALUES (?, ?)', [title, description], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/genres');
    });
});

app.post('/edit-genre', (req, res) => {
    const { genre_id, title, description } = req.body;
    db.pool.query(
        'UPDATE Genres SET title = ?, description = ? WHERE genre_id = ?',
        [title, description, genre_id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.redirect('/genres');
        }
    );
});

app.post('/delete-genre', (req, res) => {
    const { genre_id } = req.body;
    db.pool.query('DELETE FROM Genres WHERE genre_id = ?', [genre_id], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/genres');
    });
});

// Sales
app.get('/sales', (req, res) => {
    const getSales = 'SELECT * FROM Sales';
    const getGenres = 'SELECT * FROM Genres';
    const getBooks = 'SELECT * FROM Books';

    db.pool.query(getSales, (err, sales) => {
        if (err) return res.status(500).send(err);
        db.pool.query(getGenres, (err, genres) => {
            if (err) return res.status(500).send(err);
            db.pool.query(getBooks, (err, books) => {
                if (err) return res.status(500).send(err);
                res.render('sales', { sales, genres, books });
            });
        });
    });
});




app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
