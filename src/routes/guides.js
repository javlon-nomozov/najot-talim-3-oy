const router = require("express").Router();

const {
  createGuidePage,
  allGuidesPage,
  createGude,
  deleteGuidePage,
  deleteGude,
  getGuidePage,
  editGuidePage,
  editGuide,
} = require("../controllers/guides");

// all guide
router.get("/", allGuidesPage);

router.get("/create", createGuidePage);

router.post("/create", createGude);

router.get("/:id/delete", deleteGuidePage);

router.post("/delete", deleteGude);

// get guide by id
router.get("/:id", getGuidePage);

// get edit by id
router.get("/:id/edit", editGuidePage);

// post edit by id
router.post("/:id/edit", editGuide);

module.exports = router;
