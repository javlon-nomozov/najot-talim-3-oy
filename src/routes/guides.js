const router = require("express").Router();
const accessChecherMid = require("../middlewares/has-role");
const { createGuideSchem, updateGuideSchem } = require("../schemas/guides");
const validate = require("../utils/validate");

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

router.get("/create", accessChecherMid("admin"), createGuidePage);

router.post(
  "/create",
  accessChecherMid("admin"),
  validate(createGuideSchem, "/guides/create"),
  createGude
);

router.get("/:id/delete", deleteGuidePage);

router.post("/delete", accessChecherMid("admin"), deleteGude);

// get edit by id
router.get("/:id/edit", accessChecherMid("admin"), editGuidePage);

// post edit by id
router.post(
  "/:id/edit",
  accessChecherMid("admin"),
  validate(createGuideSchem, "/guides"),
  editGuide
);

// get guide by id
router.get("/:id", getGuidePage);

module.exports = router;
