const fs = require("fs");
const { join: path } = require("path");
const { v4: uuid } = require("uuid");

const filePath = path(__dirname, "..", "db", "comments.json");

async function getAllComments() {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(data.toString() || "{}"));
    });
  });
}

async function addComment(content, ownerName, bookId) {
  return new Promise(async (resolve, reject) => {
    let comments;
    try {
      comments = await getAllComments();
    } catch (error) {
      comments = {};
    }

    const newComment = {
      id: uuid(),
      ownerName,
      content,
    };

    if (!comments[bookId]) {
      comments[bookId] = [newComment];
    } else {
      comments[bookId].push(newComment);
    }

    fs.writeFile(filePath, JSON.stringify(comments), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(newComment);
    });
  });
}

async function getCommentsByBookId(bookId) {
  return new Promise(async (resolve, reject) => {
    try {
      const comments = await getAllComments();
      const bookComments = comments[bookId] || [];
      resolve(bookComments);
    } catch (error) {
      reject(error);
    }
  });
}

async function updateComment(commentId, updatedComment) {
  return new Promise(async (resolve, reject) => {
    let comments;
    try {
      comments = await getAllComments();
    } catch (error) {
      comments = {};
    }

    let found = false;
    Object.keys(comments).forEach((bookId) => {
      const index = comments[bookId].findIndex((comment) => comment.id === commentId);
      if (index !== -1) {
        found = true;
        comments[bookId][index] = { ...comments[bookId][index], ...updatedComment };
      }
    });

    if (!found) {
      return reject(new Error(`Comment not found with id: ${commentId}`));
    }

    fs.writeFile(filePath, JSON.stringify(comments), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(comments[bookId][index]);
    });
  });
}

async function deleteComment(commentId) {
  return new Promise(async (resolve, reject) => {
    let comments;
    try {
      comments = await getAllComments();

      let found = false;
      Object.keys(comments).forEach((bookId) => {
        const index = comments[bookId].findIndex((comment) => comment.id === commentId);
        if (index !== -1) {
          found = true;
          const deletedComment = comments[bookId].splice(index, 1)[0];
          fs.writeFile(filePath, JSON.stringify(comments), (err) => {
            if (err) {
              return reject(err);
            }
            resolve(deletedComment);
          });
        }
      });

      if (!found) {
        return reject(new Error(`Comment not found with id: ${commentId}`));
      }
    } catch (error) {
      comments = {};
      return reject(new Error(`Comment not found with id: ${commentId}`));
    }
  });
}

module.exports = {
  getAllComments,
  addComment,
  getCommentsByBookId,
  updateComment,
  deleteComment,
};
