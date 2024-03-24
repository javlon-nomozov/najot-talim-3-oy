const router = require("express").Router();
const accessCheckerMid = require("../middlewares/has-role");
const { createBookSchema, editBookSchema } = require("../schemas/books");
const validate = require("../utils/validate");

const {
  getAllBooksPage,
  getABookPage,
  createBookPage,
  createBook,
  editBookPage,
  editBook,
  deleteBookPage,
  deleteBook,
} = require("../controllers/books");

// all guide
router.get("/", getAllBooksPage);

// get guide by id
router.get("/books/create", accessCheckerMid("admin"), createBookPage);
router.post(
  "/books/create",
  accessCheckerMid("admin"),
  validate(createBookSchema),
  createBook
);
router.get("/books/:id/edit", accessCheckerMid("admin"), editBookPage);
router.post(
  "/books/:id/edit",
  accessCheckerMid("admin"),
  validate(editBookSchema),
  editBook
);
router.get("/books/:id/delete", accessCheckerMid("admin"), deleteBookPage);
router.post("/books/delete", accessCheckerMid("admin"), deleteBook);
router.get("/books/:id", getABookPage);

module.exports = router;
