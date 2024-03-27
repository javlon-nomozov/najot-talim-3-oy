const fs = require("fs");
const { join: path } = require("path");
const { v4: uuid } = require("uuid");

const filePath = path(__dirname, "..", "db", "authors.json");

async function getAllAuthors() {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(data.toString() || "{}"));
    });
  });
}

async function addAuthor(name) {
  return new Promise(async (resolve, reject) => {
    let authors;
    try {
      authors = await getAllAuthors();
    } catch (error) {
      authors = {};
    }

    const newAuthor = {
      id: uuid(),
      name,
      bookCount: 0, 
    };
    authors[newAuthor.id] = newAuthor;

    fs.writeFile(filePath, JSON.stringify(authors), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(newAuthor);
    });
  });
}

async function getAuthorById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const authors = await getAllAuthors();
      const author = authors[id];
      if (!author) {
        return reject(`Author not found with id: ${id}`);
      }
      resolve(author);
    } catch (error) {
      reject(error);
    }
  });
}

async function updateAuthorById(id, updatedAuthor) {
  return new Promise(async (resolve, reject) => {
    let authors;
    try {
      authors = await getAllAuthors();
    } catch (error) {
      authors = {};
    }

    if (!authors[id]) {
      return reject(`Author not found with id: ${id}`);
    }

    authors[id] = { ...authors[id], ...updatedAuthor };

    fs.writeFile(filePath, JSON.stringify(authors), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(authors[id]);
    });
  });
}

async function deleteAuthorById(id) {
  return new Promise(async (resolve, reject) => {
    let authors;
    try {
      authors = await getAllAuthors();

      if (!authors[id]) {
        return reject(new Error(`Author not found with id: ${id}`));
      }
      const deletedAuthor = { ...authors[id] };
      delete authors[id];
      fs.writeFile(filePath, JSON.stringify(authors), (err) => {
        if (err) {
          return reject(err);
        }
        resolve(deletedAuthor);
      });
    } catch (error) {
      authors = {};
      return reject(new Error(`Author not found with id: ${id}`));
    }
  });
}

async function increaseAuthorBookCount(authorId) {
  return new Promise(async (resolve, reject) => {
    try {
      const author = await getAuthorById(authorId);
      if (!author) {
        return reject(new Error(`Author not found with id: ${authorId}`));
      }

      author.bookCount++;
      const updatedAuthor = await updateAuthorById(authorId, author);
      resolve(updatedAuthor);
    } catch (error) {
      reject(error);
    }
  });
}

async function decreaseAuthorBookCount(authorId) {
  return new Promise(async (resolve, reject) => {
    try {
      const author = await getAuthorById(authorId);
      if (!author) {
        return reject(new Error(`Author not found with id: ${authorId}`));
      }

      author.bookCount++;
      const updatedAuthor = await updateAuthorById(authorId, author);
      resolve(updatedAuthor);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  getAllAuthors,
  addAuthor,
  getAuthorById,
  updateAuthorById,
  increaseAuthorBookCount,
  decreaseAuthorBookCount,
  deleteAuthorById,
};
