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
// const {} = require("../controllers/guides");

// all guide
router.get("/", getAllBooksPage);

// router.get("/create", accessCheckerMid("admin"), createGuidePage);

// router.post(
//   "/create",
//   accessCheckerMid("admin"),
//   validate(createGuideSchem, "/guides/create"),
//   createGude
// );

// router.get("/:id/delete", deleteGuidePage);

// router.post("/delete", accessCheckerMid("admin"), deleteGude);

// // get edit by id
// router.get("/:id/edit", accessCheckerMid("admin"), editGuidePage);

// // post edit by id
// router.post(
//   "/:id/edit",
//   accessCheckerMid("admin"),
//   validate(createGuideSchem, "/guides"),
//   editGuide
// );

// // get guide by id
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
