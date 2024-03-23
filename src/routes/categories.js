const router = require("express").Router();
const accessCheckerMid = require("../middlewares/has-role");
const validate = require("../utils/validate");

const {
  allCategoriesPage,
  createCategoryPage,
  createCategory,
  getCategoryPage,
  editCategoryPage,
  editCategory,
  deleteCategory,
  deleteCategoryPage,
} = require("../controllers/categories");

const { createAuthorSchem, editAuthorSchem } = require("../schemas/author");

// all author
// router.use(accessCheckerMid("admin"));
router.get("/", allCategoriesPage);

router.get("/create", accessCheckerMid("admin"), createCategoryPage);

router.post(
  "/create",
  accessCheckerMid("admin"),

  validate(createAuthorSchem, "/authors/create"),
  createCategory
);

router.get("/:id/delete", accessCheckerMid("admin"), deleteCategoryPage);

router.post("/delete", accessCheckerMid("admin"), deleteCategory);

// get edit by id
router.get("/:id/edit", accessCheckerMid("admin"), editCategoryPage);
// router.post("/:id/edit", editAuthor);

// post edit by id
router.post(
  "/:id/edit",
  accessCheckerMid("admin"),
  validate(editAuthorSchem, "/authors"),
  editCategory
);

// get author by id
router.get("/:id", getCategoryPage);

module.exports = router;
