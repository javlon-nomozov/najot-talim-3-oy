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

async function addComment(content, userId, bookId) {
  return new Promise(async (resolve, reject) => {
    let comments;
    try {
      comments = await getAllComments();
    } catch (error) {
      comments = {};
    }

    const newComment = {
      userId,
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

async function updateComment(userId, bookId, updatedComment) {
  return new Promise(async (resolve, reject) => {
    let comments;
    try {
      comments = await getAllComments();
    } catch (error) {
      comments = {};
    }

    if (!comments[bookId]) {
      return reject(new Error(`Comments not found for bookId: ${bookId}`));
    }

    const index = comments[bookId].findIndex((comment) => comment.userId === userId);
    if (index === -1) {
      return reject(new Error(`Comment not found for userId: ${userId}`));
    }

    comments[bookId][index] = { ...comments[bookId][index], ...updatedComment };

    fs.writeFile(filePath, JSON.stringify(comments), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(comments[bookId][index]);
    });
  });
}

async function deleteComment(userId, bookId) {
  return new Promise(async (resolve, reject) => {
    let comments;
    try {
      comments = await getAllComments();

      if (!comments[bookId]) {
        return reject(new Error(`Comments not found for bookId: ${bookId}`));
      }

      const index = comments[bookId].findIndex((comment) => comment.userId === userId);
      if (index === -1) {
        return reject(new Error(`Comment not found for userId: ${userId}`));
      }

      const deletedComment = comments[bookId].splice(index, 1)[0];

      fs.writeFile(filePath, JSON.stringify(comments), (err) => {
        if (err) {
          return reject(err);
        }
        resolve(deletedComment);
      });
    } catch (error) {
      comments = {};
      return reject(new Error(`Comments not found for bookId: ${bookId}`));
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
