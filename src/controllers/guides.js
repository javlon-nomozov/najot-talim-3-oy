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
  const alerts = req.flash.get("alerts");
  const guides = await getAllGuides();
  if (res.locals.currentUser.role === "admin") {
    return res.render("guides/admin/list", { guides, alerts });
  }
  res.render("guides/list", { guides });
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.createGuidePage = (req, res) => {
  const alerts = req.flash.get("alerts");
  res.render("guides/admin/create", { guide: {}, alerts });
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.createGude = async (req, res) => {
  const { title, content, send_others: sendOthers } = req.body;
  try {
    const newGuide = await addGuide(title, content);
    req.flash.set("alerts", {
      message: "Guide is created",
      type: "success",
    });

    if ("true" === sendOthers || true === sendOthers) {
      await addManyTodoes(
        newGuide.id,
        (await getAllUsers()).map((el) => el.id)
      );
      req.flash.set("alerts", {
        message: "Guide send to all",
        type: "success",
      });
      return res.redirect("/todoes");
    } else {
      return res.redirect(String(newGuide.id));
    }
  } catch (error) {
    req.flash.set("alerts", {
      message: error,
      type: "danger",
    });
    res.redirect("/guides/create");
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.deleteGuidePage = async (req, res) => {
  const guide = await getGuideById(req.params.id);
  const alerts = req.flash.get("alerts");
  if (guide.length !== 0) {
    res.render("guides/admin/delete", {
      guide: guide[0],
      alerts,
    });
  } else {
    res.render("./error/404", {
      alerts,
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
    req.flash.set("alerts", {
      message: "Guide was deleted successfully",
      type: "success",
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
exports.getGuidePage = async (req, res) => {
  const alerts = req.flash.get("alerts");
  const guide = await getGuideById(req.params.id);
  if (guide.length !== 0) {
    if (req.user.role === "admin") {
      return res.render("guides/admin/details", {
        guide: guide[0],
        alerts,
      });
    }
    res.render("guides/details", {
      guide: guide[0],
      alerts,
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
  const alerts = req.flash.get("alerts");
  const guide = await getGuideById(req.params.id);
  if (guide.length !== 0) {
    res.render("guides/admin/edit", {
      guide: guide[0],
      alerts
    });
  } else {
    res.render("./error/404", {
      data: { message: "Guide Not Found" },
      alerts
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
  req.flash.set("alerts", {
    message: "Guide was updated",
    type: "success",
  });

  if (guide.id) {
    if ("true" === sendOthers || true === sendOthers) {
      await addManyTodoes(
        guide.id,
        (await getAllUsers()).map((el) => el.id)
      );
      req.flash.set("alerts", {
        message: "Guide sent to all users successfully",
        type: "success",
      });
      return res.redirect("/todoes");
    }

    // res.redirect(`/guides/${req.params.id}`);
  } else {
    res.render("./error/404", {
      data: { message: "Guide Not Found" },
    });
  }
};
