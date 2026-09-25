const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user. Username and password are required."});
});

// ============================================================
// Task 10: Get the list of books available in the shop
// Using Promise callbacks (async/await with Promise wrapper)
// ============================================================
const getAllBooksPromise = () => {
  return new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject(new Error("Unable to fetch books"));
    }
  });
};

public_users.get('/', async function (req, res) {
  try {
    const bookList = await getAllBooksPromise();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});

// ============================================================
// Task 11: Get book details based on ISBN
// Using Promise callbacks (async/await with Promise wrapper)
// ============================================================
const getBookByISBNPromise = (isbn) => {
  return new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject(new Error("Book not found"));
    }
  });
};

public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const book = await getBookByISBNPromise(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({message: "Book not found"});
  }
});

// ============================================================
// Task 12: Get book details based on Author
// Using Promise callbacks (async/await with Promise wrapper)
// ============================================================
const getBooksByAuthorPromise = (author) => {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    let filtered_books = {};
    keys.forEach((key) => {
      if (books[key].author === author) {
        filtered_books[key] = books[key];
      }
    });
    if (Object.keys(filtered_books).length > 0) {
      resolve(filtered_books);
    } else {
      reject(new Error("No books found by this author"));
    }
  });
};

public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const filtered_books = await getBooksByAuthorPromise(author);
    return res.status(200).json(filtered_books);
  } catch (error) {
    return res.status(404).json({message: "No books found by this author"});
  }
});

// ============================================================
// Task 13: Get book details based on Title
// Using Promise callbacks (async/await with Promise wrapper)
// ============================================================
const getBooksByTitlePromise = (title) => {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(books);
    let filtered_books = {};
    keys.forEach((key) => {
      if (books[key].title === title) {
        filtered_books[key] = books[key];
      }
    });
    if (Object.keys(filtered_books).length > 0) {
      resolve(filtered_books);
    } else {
      reject(new Error("No books found with this title"));
    }
  });
};

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const filtered_books = await getBooksByTitlePromise(title);
    return res.status(200).json(filtered_books);
  } catch (error) {
    return res.status(404).json({message: "No books found with this title"});
  }
});

// Get book review (unchanged from Task 5)
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;