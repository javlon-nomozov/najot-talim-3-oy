const express = require("express");

const {
  getAllGuides,
  addGuide,
  getGuideById,
  updateGuideById,
  deleteGuideById,
  getSentGuideCout,
} = require("../models/guides");
const { deleteTodoByGuideId } = require("../models/todoes");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

exports.allGuidesPage = async (req, res) => {
  const guides = await getAllGuides();
  res.render("guides/list", { data: { user: req.session.user }, guides });
};

exports.createGuidePage = (req, res) => {
  const data = { user: req.session.user };
  res.render("guides/create", { data, guide: {} });
};

exports.createGude = async (req, res) => {
  const { title, content } = req.body;
  const data = { user: req.session.user };
  try {
    const newGuide = await addGuide(title, content);
    res.redirect(String(newGuide.id));
  } catch (error) {
    data.message = error;
    res.render("guides/create", { data, guide: req.body });
  }
};

exports.deleteGuidePage = async (req, res) => {
  const guide = await getGuideById(req.params.id);
  if (guide.length !== 0) {
    res.render("guides/delete", {
      data: { user: req.session.user },
      guide: guide[0],
    });
  } else {
    res.render("./error/404", {
      data: { message: "Guide Not Found", user: req.session.user },
    });
  }
};

exports.deleteGude = async (req, res) => {
  const guide = await deleteGuideById(req.body.id);
  if (guide.id !== 0) {
    res.redirect("/guides");
    await deleteTodoByGuideId(req.body.id)
    // res.render("guides/delete", { data: {}, guide: guide[0] });
  } else {
    res.render("./error/404", {
      data: { message: "Guide Not Found", user: req.session.user },
    });
  }
};

exports.getGuidePage = async (req, res) => {
  const guide = await getGuideById(req.params.id);
  if (guide.length !== 0) {
    res.render("guides/details", {
      data: { user: req.session.user },
      guide: guide[0],
    });
  } else {
    res.render("./error/404", {
      data: { message: "Guide Not Found", user: req.session.user },
    });
  }
};

exports.editGuidePage = async (req, res) => {
  const guide = await getGuideById(req.params.id);
  if (guide.length !== 0) {
    res.render("guides/edit", {
      data: { user: req.session.user },
      guide: guide[0],
    });
  } else {
    res.render("./error/404", {
      data: { message: "Guide Not Found", user: req.session.user },
    });
  }
};

exports.editGuide = async (req, res) => {
  const { title, content } = req.body;
  const guide = await updateGuideById(req.params.id, { title, content });
  if (guide.id) {
    res.redirect(`/guides/${req.params.id}`);
  } else {
    res.render("./error/404", {
      data: { message: "Guide Not Found", user: req.session.user },
    });
  }
};
