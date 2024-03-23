const express = require("express");

const {
  addAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthorById,
  deleteAuthorById,
} = require("../models/author");
const { getBooksByAuthorId } = require("../models/book");
// const { deleteTodoByAuthorId, addManyTodoes } = require("../models/todoes");
// const { getAllUsers } = require("../models/user");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.allAuthorsPage = async (req, res) => {
  const alerts = req.flash.get("alerts");
  try {
    const authors = Object.values(await getAllAuthors());
    res.render("authors/list", { authors, alerts });
  } catch (error) {
    req.flash.set("alerts", {
      message: "Author Not found",
      type: "danger",
    });
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.createAuthorPage = (req, res) => {
  const alerts = req.flash.get("alerts");
  res.render("authors/create", { author: {}, alerts });
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.createAuthor = async (req, res) => {
  const { name } = req.body;
  try {
    const newAuthor = await addAuthor(name);
    req.flash.set("alerts", {
      message: "Author is created",
      type: "success",
    });
    res.redirect("/authors");
  } catch (error) {
    req.flash.set("alerts", {
      message: error,
      type: "danger",
    });
    res.redirect("/authors/create");
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.deleteAuthorPage = async (req, res) => {
  try {
    const author = await getAuthorById(req.params.id);
    if (author) {
      const alerts = req.flash.get("alerts");
      res.render("authors/delete", {
        author,
        alerts,
      });
    } else {
      res.render("./error/404", {
        alerts,
        data: { message: "Author Not Found" },
      });
    }
  } catch (error) {
    req.flash.set("alerts", { message: error.message, type: "danger" });
    return res.redirect("/authors");
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.deleteAuthor = async (req, res) => {
  try {
    const author = await getAuthorById(req.body.id);

    if (author) {
      if (author.bookCount === 0) {
        await deleteAuthorById(req.body.id);
        req.flash.set("alerts", {
          message: "Author was deleted successfully",
          type: "success",
        });
      } else {
        req.flash.set("alerts", {
          message: `Author has ${author.bookCount} books. You cannot delete this author`,
          type: "danger",
        });
      }
      res.redirect("/authors");
    } else {
      res.render("./error/404", {
        data: { message: "Author Not Found" },
      });
    }
  } catch (error) {
    res.render("./error/404", {
      data: { message: "Author Not Found" },
    });
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.getAuthorPage = async (req, res) => {
  try {
    const author = await getAuthorById(req.params.id);
    books = await getBooksByAuthorId(req.params.id);
    if (author) {
      const alerts = req.flash.get("alerts");
      res.render("authors/details", {
        author,
        alerts,
        books,
      });
    } else {
      res.render("./error/404", {
        data: { message: "Author Not Found" },
      });
    }
  } catch (error) {
    res.render("./error/404", {
      data: { message: "Author Not Found" },
    });
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.editAuthorPage = async (req, res) => {
  try {
    const author = await getAuthorById(req.params.id);
    const alerts = req.flash.get("alerts");
    res.render("authors/edit", {
      author,
      alerts,
    });
  } catch (error) {
    res.render("./error/404", {
      data: { message: "Author Not Found" },
    });
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.editAuthor = async (req, res) => {
  try {
    const author = await updateAuthorById(req.params.id, req.body);

    if (author) {
      req.flash.set("alerts", {
        message: "Author was updated",
        type: "success",
      });
      res.redirect(`/authors/${author.id}`);
    } else {
      res.render("./error/404", {
        data: { message: "Author Not Found" },
      });
    }
  } catch (error) {
    req.flash.set("alerts", {
      message: error || "Author Not found",
      type: "danger",
    });
    res.redirect(`/authors/${author.id}`);
  }
};
