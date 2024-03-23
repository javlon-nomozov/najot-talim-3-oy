const express = require("express");

const {
  addCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} = require("../models/category");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.allCategoriesPage = async (req, res) => {
  const alerts = req.flash.get("alerts");
  try {
    const categories = Object.values(await getAllCategories());
    res.render("categories/list", { categories, alerts });
  } catch (error) {
    req.flash.set("alerts", {
      message: "Category Not found",
      type: "danger",
    });
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.createCategoryPage = (req, res) => {
  const alerts = req.flash.get("alerts");
  res.render("categories/create", { category: {}, alerts });
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = await addCategory(name);
    req.flash.set("alerts", {
      message: "Category is created",
      type: "success",
    });
    res.redirect("/categories");
  } catch (error) {
    req.flash.set("alerts", {
      message: error,
      type: "danger",
    });
    res.redirect("/categories/create");
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.deleteCategoryPage = async (req, res) => {
  const category = await getCategoryById(req.params.id);
  const alerts = req.flash.get("alerts");
  if (category) {
    res.render("categories/delete", {
      category,
      alerts,
    });
  } else {
    res.render("./error/404", {
      alerts,
      data: { message: "Category Not Found" },
    });
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.deleteCategory = async (req, res) => {
  try {
    const category = await getCategoryById(req.body.id);
    if (category) {
      if (category.bookCount === 0) {
        await deleteCategoryById(req.body.id);
        req.flash.set("alerts", {
          message: "Category was deleted successfully",
          type: "success",
        });
        res.redirect("/categories");
      } else {
        req.flash.set("alerts", {
          message: `There are ${category.bookCount} books with this category. You cannot delete this category`,
          type: "danger",
        });
        res.redirect("/categories");
      }
    } else {
      res.render("./error/404", {
        data: { message: "Category Not Found" },
      });
    }
  } catch (error) {
    res.render("./error/404", {
      data: { message: "Category Not Found" },
    });
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.getCategoryPage = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);

    const alerts = req.flash.get("alerts");
    res.render("categories/details", {
      category,
      alerts,
    });
  } catch (error) {
    res.render("./error/404", {
      data: { message: "Category Not Found" },
    });
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.editCategoryPage = async (req, res) => {
  try {
    const category = await getCategoryById(req.params.id);
    const alerts = req.flash.get("alerts");
    res.render("categories/edit", {
      category,
      alerts,
    });
  } catch (error) {
    res.render("./error/404", {
      data: { message: "Category Not Found" },
    });
  }
};

/**
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
exports.editCategory = async (req, res) => {
  try {
    const category = await updateCategoryById(req.params.id, req.body);

    if (category) {
      req.flash.set("alerts", {
        message: "Category was updated",
        type: "success",
      });
      res.redirect(`/categories/${category.id}`);
    } else {
      res.render("./error/404", {
        data: { message: "Category Not Found" },
      });
    }
  } catch (error) {
    req.flash.set("alerts", {
      message: error || "Category Not found",
      type: "danger",
    });
    res.redirect(`/categories/${category.id}`);
  }
};
