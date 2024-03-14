const express = require("express");

const {
  getAllGuides,
  addGuide,
  getGuideById,
  updateGuideById,
  deleteGuideById,
  getSentGuideCout,
} = require("../models/guides");
const { deleteTodoByGuideId, addManyTodoes } = require("../models/todoes");
const { getAllUsers } = require("../models/user");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.allGuidesPage = async (req, res) => {
  const guides = await getAllGuides();
  if (res.locals.currentUser.role === "admin") {
    return res.render("guides/admin/list", { data: {}, guides });
  }
  res.render("guides/list", { data: {}, guides });
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.createGuidePage = (req, res) => {
  const data = {};
  res.render("guides/admin/create", { data, guide: {} });
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.createGude = async (req, res) => {
  const { title, content, send_others: sendOthers } = req.body;
  const data = {};
  try {
    const newGuide = await addGuide(title, content);
    if ("true" === sendOthers || true === sendOthers) {
      await addManyTodoes(
        newGuide.id,
        (await getAllUsers()).map((el) => el.id)
      );
      return res.redirect("/todoes");
    } else {
      return res.redirect(String(newGuide.id));
    }
  } catch (error) {
    data.message = error;
    res.render("guides/create", { data, guide: req.body });
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.deleteGuidePage = async (req, res) => {
  const guide = await getGuideById(req.params.id);
  if (guide.length !== 0) {
    res.render("guides/admin/delete", {
      data: {},
      guide: guide[0],
    });
  } else {
    res.render("./error/404", {
      data: { message: "Guide Not Found" },
    });
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.deleteGude = async (req, res) => {
  const guide = await deleteGuideById(req.body.id);
  if (guide.id !== 0) {
    res.redirect("/guides");
    await deleteTodoByGuideId(req.body.id);
    // res.render("guides/delete", { data: {}, guide: guide[0] });
  } else {
    res.render("./error/404", {
      data: { message: "Guide Not Found" },
    });
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.getGuidePage = async (req, res) => {
  const guide = await getGuideById(req.params.id);
  if (guide.length !== 0) {
    if (req.user.role === 'admin') {
      return res.render("guides/admin/details", {
        data: {},
        guide: guide[0],
      });
    }
    res.render("guides/details", {
      data: {},
      guide: guide[0],
    });
  } else {
    res.render("./error/404", {
      data: { message: "Guide Not Found" },
    });
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.editGuidePage = async (req, res) => {
  const guide = await getGuideById(req.params.id);
  if (guide.length !== 0) {
    res.render("guides/edit", {
      data: {},
      guide: guide[0],
    });
  } else {
    res.render("./error/404", {
      data: { message: "Guide Not Found" },
    });
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.editGuide = async (req, res) => {
  const { title, content, send_others: sendOthers } = req.body;
  const guide = await updateGuideById(req.params.id, { title, content });
  if (guide.id) {
    if ("true" === sendOthers || true === sendOthers) {
      await addManyTodoes(
        guide.id,
        (await getAllUsers()).map((el) => el.id)
      );
      return res.redirect("/todoes");
    }

    // res.redirect(`/guides/${req.params.id}`);
  } else {
    res.render("./error/404", {
      data: { message: "Guide Not Found" },
    });
  }
};
