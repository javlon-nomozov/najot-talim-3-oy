const express = require("express");
const {
  getAllBooks,
  getBookById,
  addBook,
  updateBookById,
  deleteBookById
} = require("../models/book");
const {increaseAuthorBookCount, decreaseAuthorBookCount} = require("../models/author");
const {increaseCategoryBookCount, decreaseCategoryBookCount} = require("../models/category");
const { getAllCategories } = require("../models/category");
const { getAllAuthors } = require("../models/author");
const { getCommentsByBookId } = require("../models/comment");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

module.exports.getAllBooksPage = async (req, res) => {
  const alerts = req.flash.get("alerts");
  const booksArr = Object.values(await getAllBooks()).reverse();
  const authorsObj = await getAllAuthors();
  const categoryObj = await getAllCategories();
  booksArr.forEach((book) => {
    book.author = authorsObj[book.authorId];
    book.category = categoryObj[book.categoryId];
  });
  return res.render("./books/list", { alerts, books: booksArr, authors: authorsObj, categories: categoryObj });
};

module.exports.getABookPage = async (req, res) => {
  const alerts = req.flash.get("alerts");
  try {
    const book = await getBookById(req.params.id);
    const authors = await getAllAuthors()
    const categories = await getAllCategories()
    const comments = (await getCommentsByBookId(req.params.id)).reverse();
    return res.render("./books/details", { alerts, book, authors, categories, comments });
  } catch (error) {
    req.flash("alerts", { type: "danger", message: error.message });
    res.redirect("/");
  }
};

module.exports.createBookPage = async (req, res) => {
  const alerts = req.flash.get("alerts");
  const authors = Object.values(await getAllAuthors());
  const categories = Object.values(await getAllCategories());
  return res.render("./books/admin/create", {
    alerts,
    book: "",
    categories,
    authors,
  });
};

module.exports.createBook = async (req, res) => {
  try {
    const newBook = await addBook(
      req.body.title,
      req.body.description,
      req.body.copies,
      req.body.cover,
      req.body.price,
      req.body.authorId,
      req.body.categoryId,
      req.body.image
    );
    await increaseAuthorBookCount(req.body.authorId);
    await increaseCategoryBookCount(req.body.categoryId);
    req.flash.set("alerts", {
      message: "Book was created",
      type: "success",
    });
    res.redirect(`/books/${newBook.id}`);
  } catch (error) {
    req.flash("alerts", { type: "danger", message: error.message });
    res.redirect("/");
  }
};

exports.editBookPage = async (req, res) => {
  const alerts = req.flash.get("alerts");
  const authors = Object.values(await getAllAuthors());
  const categories = Object.values(await getAllCategories());
  try {
    const book = await getBookById(req.params.id);
    return res.render("./books/admin/edit", {
      alerts,
      book,
      authors,
      categories,
    });
  } catch (error) {
    req.flash.set("alerts", { type: "danger", message: error.message });
    res.redirect("/");
  }
};

exports.editBook = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedBook = await updateBookById(id, req.body);
    return res.redirect(`/books/${id}`);
  } catch (error) {
    req.flash.set("alerts", { type: "danger", message: error.message });
    return res.redirect(`/`);
  }
};

exports.deleteBookPage = async (req, res) => {
  try {
    const id = req.params.id;
    const book = await getBookById(id);
    res.render('./books/admin/delete', {book})
  } catch (error) {
    req.flash.set("alerts", { type: "danger", message: error.message });
    res.redirect("/");
  }
}

exports.deleteBook = async (req, res) => {
  try {
    const id = req.body.id;
    const deletedBook = await deleteBookById(id);
    await decreaseAuthorBookCount(deletedBook.authorId);
    await decreaseCategoryBookCount(deletedBook.categoryId);
    req.flash.set("alerts", {
      message: "Book was deleted",
      type: "success",
    });
    res.redirect("/");
  } catch (error) {
    req.flash.set("alerts", { type: "danger", message: error });
    res.redirect("/");
  }
}