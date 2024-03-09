const express = require("express");

const {
  getAllGuides,
  addGuide,
  getGuideById,
  updateGuideById,
  deleteGuideById,
  getSentGuideCout,
} = require("../models/guides");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */

exports.allGuidesPage = async (req, res) => {
  const guides = await getAllGuides();
  res.render("guides/list", { data: {}, guides });
};

exports.createGuidePage = (req, res) => {
  const data = {};
  res.render("guides/create", { data, guide: {} });
};

exports.createGude = async (req, res) => {
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
};

exports.deleteGuidePage = async (req, res) => {
  const data = {};
  const guide = await getGuideById(req.params.id);
  if (guide.length !== 0) {
    res.render("guides/delete", { data: {}, guide: guide[0] });
  } else {
    res.render("./error/404", { data: { message: "Guide Not Found" } });
  }
};

exports.deleteGude = async (req, res) => {
  const guide = await deleteGuideById(req.body.id);
  if (guide.id !== 0) {
    res.redirect("/guides");
    // res.render("guides/delete", { data: {}, guide: guide[0] });
  } else {
    res.render("./error/404", { data: { message: "Guide Not Found" } });
  }
};

exports.getGuidePage = async (req, res) => {
  const guide = await getGuideById(req.params.id);
  if (guide.length !== 0) {
    res.render("guides/details", { data: {}, guide: guide[0] });
  } else {
    res.render("./error/404", { data: { message: "Guide Not Found" } });
  }
};

exports.editGuidePage = async (req, res) => {
  const guide = await getGuideById(req.params.id);
  if (guide.length !== 0) {
    res.render("guides/edit", { data: {}, guide: guide[0] });
  } else {
    res.render("./error/404", { data: { message: "Guide Not Found" } });
  }
};

exports.editGuide = async (req, res) => {
  const { title, content } = req.body;
  const guide = await updateGuideById(req.params.id, { title, content });
  if (guide.id) {
    res.redirect(`/guides/${req.params.id}`);
  } else {
    res.render("./error/404", { data: { message: "Guide Not Found" } });
  }
};
