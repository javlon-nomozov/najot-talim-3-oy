const fs = require("fs");
const { join: path } = require("path");
const { v4: uuid } = require("uuid");

const filePath = path(__dirname, "..", "db", "books.json");

async function getAllBooks() {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(data.toString() || "{}"));
    });
  });
}

async function addBook(title, description, copies, cover, price, authorId, categoryId, image) {
  return new Promise(async (resolve, reject) => {
    let books;
    try {
      books = await getAllBooks();
    } catch (error) {
      books = {};
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
    books[newBook.id] = newBook;

    fs.writeFile(filePath, JSON.stringify(books), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(newBook);
    });
  });
}

async function getBookById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const books = await getAllBooks();
      const book = books[id];
      if (!book) {
        return reject(new Error(`Book not found with id: ${id}`));
      }
      resolve(book);
    } catch (error) {
      reject(error);
    }
  });
}

async function updateBookById(id, updatedBook) {
  return new Promise(async (resolve, reject) => {
    let books;
    try {
      books = await getAllBooks();
    } catch (error) {
      books = {};
    }

    if (!books[id]) {
      return reject(new Error(`Book not found with id: ${id}`));
    }

    books[id] = { ...books[id], ...updatedBook };

    fs.writeFile(filePath, JSON.stringify(books), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(books[id]);
    });
  });
}

async function deleteBookById(id) {
  return new Promise(async (resolve, reject) => {
    let books;
    try {
      books = await getAllBooks();

      if (!books[id]) {
        return reject(new Error(`Book not found with id: ${id}`));
      }
      const deletedBook = { ...books[id] };
      delete books[id];
      fs.writeFile(filePath, JSON.stringify(books), (err) => {
        if (err) {
          return reject(err);
        }
        resolve(deletedBook);
      });
    } catch (error) {
      books = {};
      return reject(new Error(`Book not found with id: ${id}`));
    }
  });
}

module.exports = {
  getAllBooks,
  addBook,
  getBookById,
  updateBookById,
  deleteBookById,
};
