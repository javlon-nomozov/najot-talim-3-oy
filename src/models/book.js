const fs = require("fs");
const { join: path } = require("path");
const { v4: uuid } = require("uuid");

const filePath = path(__dirname, "..", "db", "books.json");

function getAllBooks() {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(data.toString() || "[]"));
    });
  });
}

function addBook(title, description, copies, cover, price, authorId, categoryId, image) {
  return new Promise(async (resolve, reject) => {
    let books;
    try {
      books = await getAllBooks();
    } catch (error) {
      books = [];
    }

    const newBook = {
      id: uuid(),
      title,
      description,
      copies,
      cover,
      price,
      authorId,
      categoryId,
      image,
    };
    books.push(newBook);

    fs.writeFile(filePath, JSON.stringify(books), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(newBook);
    });
  });
}

function getBookById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const books = await getAllBooks();
      const book = books.find((book) => book.id === id);
      if (!book) {
        return reject(new Error(`Book not found with id: ${id}`));
      }
      resolve(book);
    } catch (error) {
      reject(error);
    }
  });
}

function updateBookById(id, updatedBook) {
  return new Promise(async (resolve, reject) => {
    let books;
    try {
      books = await getAllBooks();
    } catch (error) {
      books = [];
    }

    const index = books.findIndex((book) => book.id === id);
    if (index === -1) {
      return reject(new Error(`Book not found with id: ${id}`));
    }

    books[index] = { ...books[index], ...updatedBook };

    fs.writeFile(filePath, JSON.stringify(books), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(books[index]);
    });
  });
}

function deleteBookById(id) {
  return new Promise(async (resolve, reject) => {
    let books;
    try {
      books = await getAllBooks();
    } catch (error) {
      books = [];
    }

    const index = books.findIndex((book) => book.id === id);
    if (index === -1) {
      return reject(new Error(`Book not found with id: ${id}`));
    }

    const deletedBook = books.splice(index, 1)[0];

    fs.writeFile(filePath, JSON.stringify(books), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(deletedBook);
    });
  });
}

module.exports = {
  getAllBooks,
  addBook,
  getBookById,
  updateBookById,
  deleteBookById,
};
