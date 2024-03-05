const router = require("express").Router();
const {
  getAllGuides,
  addGuide,
  getGuideById,
  updateGuideById,
  deleteGuideById,
} = require("../models/guides");

// all guide
router.get("/", async (req, res) => {
  const guides = await getAllGuides();
  res.render("guides/list", { data: {}, guides });
});

router.get("/create", (req, res) => {
  const data = {};
  res.render("guides/create", { data, guide: {} });
});

router.post("/create", async (req, res) => {
  const { title, content } = req.body;
  const data = {};
  try {
    const newGuide = await addGuide(title, content);
    res.redirect(String(newGuide.id));
  } catch (error) {
    data.message = error;
    res.render("guides/create", { data, guide: req.body });
    // if (error.code === 802) {
    // console.log(error);
    // }
  }
});

router.get("/:id/delete", async (req, res) => {
  console.log("guide");
  const guide = await getGuideById(req.params.id);
  console.log(guide);
  if (guide.length !== 0) {
    res.render("guides/delete", { data: {}, guide: guide[0] });
  } else {
    res.render("./error/404", { data: { message: "Guide Not Found" } });
  }
});

router.post("/delete", async (req, res) => {
  const guide = await deleteGuideById(req.body.id);
  console.log(guide);
  if (guide.id !== 0) {
    res.redirect("/guides");
    // res.render("guides/delete", { data: {}, guide: guide[0] });
  } else {
    res.render("./error/404", { data: { message: "Guide Not Found" } });
  }
});

// get guide by id
router.get("/:id", async (req, res) => {
  const guide = await getGuideById(req.params.id);
  if (guide.length !== 0) {
    res.render("guides/details", { data: {}, guide: guide[0] });
  } else {
    res.render("./error/404", { data: { message: "Guide Not Found" } });
  }
});

// get edit by id
router.get("/:id/edit", async (req, res) => {
  const guide = await getGuideById(req.params.id);
  if (guide.length !== 0) {
    res.render("guides/edit", { data: {}, guide: guide[0] });
  } else {
    res.render("./error/404", { data: { message: "Guide Not Found" } });
  }
});

// post edit by id
router.post("/:id/edit", async (req, res) => {
  const { title, content } = req.body;
  const guide = await updateGuideById(req.params.id, { title, content });
  if (guide.id) {
    res.redirect(`/guides/${req.params.id}`);
  } else {
    res.render("./error/404", { data: { message: "Guide Not Found" } });
  }
});

module.exports = router;
