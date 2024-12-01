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
const moment = require('moment');
app.engine('.hbs', engine({ 
    extname: ".hbs", 
    helpers: {formatDate: (date) => moment(date).format('YYYY-MM-DD')} })); // Used to handle Date Entries
app.set('view engine', '.hbs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }))


// Index
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
app.get('/authors', (req, res) => {
    db.pool.query('SELECT * FROM Authors', (err, results) => {
        if (err) return res.status(500).send(err);
        res.render('authors', { data: results });
    });
});

app.post('/add-author', (req, res) => {
    const { name, description } = req.body;
    db.pool.query('INSERT INTO Authors (name, description) VALUES (?, ?)', [name, description], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/authors');
    });
});

app.post('/edit-author', (req, res) => {
    const { author_id, name, description } = req.body;
    db.pool.query(
        'UPDATE Authors SET name = ?, description = ? WHERE author_id = ?',
        [name, description, author_id],
        (err) => {
            if (err) return res.status(500).send(err);
            res.redirect('/authors');
        }
    );
});

app.post('/delete-author', (req, res) => {
    const { author_id } = req.body;
    db.pool.query('DELETE FROM Authors WHERE author_id = ?', [author_id], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/authors');
    });
});


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
    const getSalesQuery = 
    `
        select Sales.sale_id, Customers.name as customer_name, Books.title as book_title, Sales.quantity_purchased, Sales.transaction_total, Sales.sale_date
        from Sales
        join Customers on Sales.customer_id = Customers.customer_id
        join Books on Sales.book_id = Books.book_id
    `;
    db.pool.query(getSalesQuery, (err, sales) => {
        if (err) return res.status(500).send(err);
        db.pool.query('SELECT * FROM Customers', (err, customers) => {
            if (err) return res.status(500).send(err);
            db.pool.query('SELECT * FROM Books', (err, books) => {
                if (err) return res.status(500).send(err);
                res.render('sales', { sales, customers, books });
            });
        });
    });
});


app.post('/add-sale', (req, res) => {
    const { customer_id, book_id, quantity_purchased, transaction_total, sale_date } = req.body;
    const addSaleQuery = `
        INSERT INTO Sales (customer_id, book_id, quantity_purchased, transaction_total, sale_date)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.pool.query(
        addSaleQuery, 
        [customer_id, book_id, quantity_purchased, transaction_total, sale_date], 
        (err) => {
            if (err) return res.status(500).send(err);
            res.redirect('/sales');
        }
    );
});



// Edit an existing Sale
app.post('/edit-sale', (req, res) => {
    const { sale_id, customer_id, book_id, quantity_purchased, transaction_total, sale_date } = req.body;
    const editSaleQuery = `
        UPDATE Sales
        SET customer_id = ?, book_id = ?, quantity_purchased = ?, transaction_total = ?, sale_date = ?
        WHERE sale_id = ?
    `;
    db.pool.query(
        editSaleQuery, 
        [customer_id, book_id, quantity_purchased, transaction_total, sale_date, sale_id], 
        (err) => {
            if (err) return res.status(500).send(err);
            res.redirect('/sales');
        }
    );
});


// Delete a Sale
app.post('/delete-sale', (req, res) => {
    const { sale_id } = req.body;
    const deleteSaleQuery = 'DELETE FROM Sales WHERE sale_id = ?';
    db.pool.query(deleteSaleQuery, [sale_id], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/sales');
    });
});




app.listen(PORT, () => {
    console.log(`Server running at classwork.engr.oregonstate.edu:${PORT}`);
});
