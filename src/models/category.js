const fs = require("fs");
const { join: path } = require("path");
const { v4: uuid } = require("uuid");

const filePath = path(__dirname, "..", "db", "categories.json");

async function getAllCategories() {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(JSON.parse(data.toString() || "{}"));
    });
  });
}

async function addCategory(name) {
  return new Promise(async (resolve, reject) => {
    let categories;
    try {
      categories = await getAllCategories();
    } catch (error) {
      categories = {};
    }

    const newCategory = {
      id: uuid(),
      name,
      bookCount: 0, // Initialize bookCount to 0
    };
    categories[newCategory.id] = newCategory;

    fs.writeFile(filePath, JSON.stringify(categories), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(newCategory);
    });
  });
}

async function getCategoryById(id) {
  return new Promise(async (resolve, reject) => {
    try {
      const categories = await getAllCategories();
      const category = categories[id];
      if (!category) {
        return reject(new Error(`Category not found with id: ${id}`));
      }
      resolve(category);
    } catch (error) {
      reject(error);
    }
  });
}

async function updateCategoryById(id, updatedCategory) {
  return new Promise(async (resolve, reject) => {
    let categories;
    try {
      categories = await getAllCategories();
    } catch (error) {
      categories = {};
    }

    if (!categories[id]) {
      return reject(new Error(`Category not found with id: ${id}`));
    }

    categories[id] = { ...categories[id], ...updatedCategory };

    fs.writeFile(filePath, JSON.stringify(categories), (err) => {
      if (err) {
        return reject(err);
      }
      resolve(categories[id]);
    });
  });
}

async function deleteCategoryById(id) {
  return new Promise(async (resolve, reject) => {
    let categories;
    try {
      categories = await getAllCategories();

      if (!categories[id]) {
        return reject(new Error(`Category not found with id: ${id}`));
      }
      const deletedCategory = { ...categories[id] };
      delete categories[id];
      fs.writeFile(filePath, JSON.stringify(categories), (err) => {
        if (err) {
          return reject(err);
        }
        resolve(deletedCategory);
      });
    } catch (error) {
      categories = {};
      return reject(new Error(`Category not found with id: ${id}`));
    }
  });
}

async function decreaseCategoryBookCount(categoryId) {
  return new Promise(async (resolve, reject) => {
    try {
      const category = await getCategoryById(categoryId);
      if (!category) {
        return reject(new Error(`Category not found with id: ${categoryId}`));
      }

      category.bookCount--;
      const updatedCategory = await updateCategoryById(categoryId, category);
      resolve(updatedCategory);
    } catch (error) {
      reject(error);
    }
  });
}


async function increaseCategoryBookCount(categoryId) {
  return new Promise(async (resolve, reject) => {
    try {
      const category = await getCategoryById(categoryId);
      if (!category) {
        return reject(new Error(`Category not found with id: ${categoryId}`));
      }

      category.bookCount++;
      const updatedCategory = await updateCategoryById(categoryId, category);
      resolve(updatedCategory);
    } catch (error) {
      reject(error);
    }
  });
}


module.exports = {
  getAllCategories,
  addCategory,
  getCategoryById,
  updateCategoryById,
  increaseCategoryBookCount,
  decreaseCategoryBookCount,
  deleteCategoryById,
};
