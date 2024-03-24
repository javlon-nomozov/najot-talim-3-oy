const router = require("express").Router();
const accessCheckerMid = require("../middlewares/has-role");
const validate = require("../utils/validate");

const {
  allAuthorsPage,
  createAuthorPage,
  createAuthor,
  getAuthorPage,
  editAuthorPage,
  editAuthor,
  deleteAuthorPage,
  deleteAuthor,
} = require("../controllers/authors");
const { createAuthorSchem, editAuthorSchem } = require("../schemas/author");

// all author
router.get("/", allAuthorsPage);

router.get("/create", accessCheckerMid("admin"), createAuthorPage);

router.post(
  "/create",
  accessCheckerMid("admin"),
  validate(createAuthorSchem, "/authors/create"),
  createAuthor
);

router.get(
  "/:id/delete",
  accessCheckerMid("admin"),
  deleteAuthorPage
);

router.post("/delete", accessCheckerMid("admin"), deleteAuthor);

// get edit by id
router.get("/:id/edit", accessCheckerMid("admin"), editAuthorPage);

// post edit by id
router.post(
  "/:id/edit",
  accessCheckerMid("admin"),
  validate(editAuthorSchem, "/authors"),
  editAuthor
);

// get author by id
router.get("/:id", getAuthorPage);

module.exports = router;
