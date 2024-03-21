const fs = require("fs");
const { join: path } = require("path");
const { v4: uuid } = require("uuid");

const filePath = path(__dirname, "..", "db", "categories.json");

function getAllCategories() {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(data.toString() || "[]"));
    });
  });
}

function addCategory(name) {
  return new Promise(async (resolve, reject) => {
    let categories;
    try {
      categories = await getAllCategories();
    } catch (error) {
      categories = [];
    }

    const newCategory = {
      id: uuid(),
      name,
    };
    categories.push(newCategory);

    fs.writeFile(filePath, JSON.stringify(categories), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(newCategory);
    });
  });
}

function getCategoryById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const categories = await getAllCategories();
      const category = categories.find((category) => category.id === id);
      if (!category) {
        return reject(new Error(`Category not found with id: ${id}`));
      }
      resolve(category);
    } catch (error) {
      reject(error);
    }
  });
}

function updateCategoryById(id, updatedCategory) {
  return new Promise(async (resolve, reject) => {
    let categories;
    try {
      categories = await getAllCategories();
    } catch (error) {
      categories = [];
    }

    const index = categories.findIndex((category) => category.id === id);
    if (index === -1) {
      return reject(new Error(`Category not found with id: ${id}`));
    }

    categories[index] = { ...categories[index], ...updatedCategory };

    fs.writeFile(filePath, JSON.stringify(categories), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(categories[index]);
    });
  });
}

function deleteCategoryById(id) {
  return new Promise(async (resolve, reject) => {
    let categories;
    try {
      categories = await getAllCategories();
    } catch (error) {
      categories = [];
    }

    const index = categories.findIndex((category) => category.id === id);
    if (index === -1) {
      return reject(new Error(`Category not found with id: ${id}`));
    }

    const deletedCategory = categories.splice(index, 1)[0];

    fs.writeFile(filePath, JSON.stringify(categories), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(deletedCategory);
    });
  });
}

module.exports = {
  getAllCategories,
  addCategory,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
