import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get("/books", (req, res) => {
  const { genre } = req.query;
  const sql = `SELECT b.book_id,b.title,b.genre,b.published_year,b.is_available,a.name AS author_name FROM books b INNER JOIN authors a ON b.author_id = a.author_id ${
    genre ? "WHERE b.genre =?" : ""
  } `;
  pool.query(sql, [genre], (err, result) => {
    if (err) {
      console.log(err.message);
      return res.status(500).send("Database query failed");
    }
    res.status(200).json(result);
  });
});
app.get("/books/:id", (req, res) => {
  const { id } = req.params;
  const sql =
    "SELECT * FROM books INNER JOIN authors ON books.author_id = authors.author_id WHERE books.book_id = ?";

  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("database query failed");
    }
    if (result.length == 0) {
      return res.status(404).send(`There is no book with id ${id}`);
    }
    res.status(200).json(result);
  });
});
app.post("/books", (req, res) => {
  const { title, genre, published_year, is_available, author_id } = req.body;
  const sql =
    "INSERT INTO books (title, genre, published_year, is_available,author_id) VALUES (?,?,?,?,?)";
  const currentYear = new Date().getFullYear();
  if (!title || !genre || !published_year || !is_available || !author_id) {
    return res.status(400).send("Missing required fields");
  }
  if (published_year > currentYear) {
    return res.status(400).send("Published year cannot be in the future");
  }
  pool.query(
    sql,
    [title, genre, published_year, is_available, author_id],
    (err, result) => {
      if (err) {
        console.log(err.message);
        return res.status(500).send("database query failed");
      }
      res.status(201).send(`The book with id ${result.insertId} created`);
    }
  );
});

app.put("/books/:id", (req, res) => {
  const { id } = req.params;
  const newInfo = req.body;
  const checkSql = "SELECT book_id FROM books WHERE book_id = ?";

  pool.query(checkSql, [id], (err, result) => {
    if (err) {
      console.log(err.message);
      return res.status(500).send("Database query failed");
    }
    if (result.length == 0) {
      return res.status(404).send(`There is no book with id ${id}`);
    } else {
      const updateSql = "UPDATE books SET ? WHERE book_id = ?";
      pool.query(updateSql, [newInfo, id], (err, result) => {
        if (err) {
          console.log(err.message);
          return res.status(500).send("Database query failed");
        }
        res.status(200).send(`The book with id: ${id} updated`);
      });
    }
  });
});
app.delete("/books/:id", (req, res) => {
  const { id } = req.params;
  const checkSql = "SELECT book_id FROM books WHERE book_id = ?";

  pool.query(checkSql, [id], (err, result) => {
    if (err) {
      console.log(err.message);
      return res.status(500).send("Database query failed");
    }
    if (result.length == 0) {
      return res.status(404).send(`There is no book with id ${id}`);
    } else {
      const deleteSql = "DELETE FROM books WHERE book_id = ?";
      pool.query(deleteSql, [id], (err, result) => {
        if (err) {
          console.log(err.message);
          return res.status(500).send("Database query failed");
        }
        res.status(200).send(`The book with id: ${id} deleted`);
      });
    }
  });
});

app.delete("/authors/:id", (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE authors SET is_active = false WHERE author_id=?";
  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err.message);
      return res.status(500).send("Database query failed");
    }
    res.status(200).send("author soft deleted");
  });
});
app.get("/authors", (req, res) => {
  const sql = "SELECT * FROM authors WHERE is_active = true";
  pool.query(sql, (err, result) => {
    if (err) {
      console.log(err.message);
      return res.status(500).send("Database query failed");
    }
    res.status(200).json(result);
  });
});
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
