const fs = require("fs");
const { join: path } = require("path");
const { v4: uuid } = require("uuid");

const filePath = path(__dirname, "..", "db", "authors.json");

function getAllAuthors() {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(data.toString() || "[]"));
    });
  });
}

function addAuthor(name) {
  return new Promise(async (resolve, reject) => {
    let authors;
    try {
      authors = await getAllAuthors();
    } catch (error) {
      authors = [];
    }

    const newAuthor = {
      id: uuid(),
      name,
    };
    authors.push(newAuthor);

    fs.writeFile(filePath, JSON.stringify(authors), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(newAuthor);
    });
  });
}

function getAuthorById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const authors = await getAllAuthors();
      const author = authors.find((author) => author.id === id);
      if (!author) {
        return reject(new Error(`Author not found with id: ${id}`));
      }
      resolve(author);
    } catch (error) {
      reject(error);
    }
  });
}

function updateAuthorById(id, updatedAuthor) {
  return new Promise(async (resolve, reject) => {
    let authors;
    try {
      authors = await getAllAuthors();
    } catch (error) {
      authors = [];
    }

    const index = authors.findIndex((author) => author.id === id);
    if (index === -1) {
      return reject(new Error(`Author not found with id: ${id}`));
    }

    authors[index] = { ...authors[index], ...updatedAuthor };

    fs.writeFile(filePath, JSON.stringify(authors), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(authors[index]);
    });
  });
}

function deleteAuthorById(id) {
  return new Promise(async (resolve, reject) => {
    let authors;
    try {
      authors = await getAllAuthors();
    } catch (error) {
      authors = [];
    }

    const index = authors.findIndex((author) => author.id === id);
    if (index === -1) {
      return reject(new Error(`Author not found with id: ${id}`));
    }

    const deletedAuthor = authors.splice(index, 1)[0];

    fs.writeFile(filePath, JSON.stringify(authors), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(deletedAuthor);
    });
  });
}

// getAllAuthors().then((data) => console.log(data));
// addAuthor("Author 3").then((data) => console.log(data));

// getAllAuthors().then((data) => console.log(data));

// updateAuthorById("709e6a76-3db0-4c31-b583-f03b302109c2", {
//   name: "Authorr 3",
// }).then((data) => console.log(data));

// deleteAuthorById("709e6a76-3db0-4c31-b583-f03b302109c2").then((data) =>
//   console.log(data)
// );

module.exports = {
  getAllAuthors,
  addAuthor,
  getAuthorById,
  updateAuthorById,
  deleteAuthorById,
};
