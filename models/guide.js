const _ = require("lodash");
const fs = require("fs");
const { join: path } = require("path");
const { v4: uuid } = require("uuid");

const filePath = path(__dirname, "..", "db", "guides.json");

const validator = (guide) => {
  if (
    guide.id &&
    !(typeof guide.id === "string" || typeof guide.id === "number")
  ) {
    throw new Error("Guide id should be String or Number");
  }
  if (!(typeof guide.title === "string")) {
    throw new Error("Guide title should be String");
  }
  if (!(typeof guide.content === "string")) {
    throw new Error("Guide content should be String");
  }
  return guide;
};

// create
function addGuide(title, content) {
  return new Promise(async (res, rej) => {
    let guides;
    try {
      const newGuide = validator({ id: uuid(), title, content });
      try {
        guides = await getAllGuides();
      } catch (error) {
        guides = [];
      }
      guides.push(newGuide);
      fs.writeFile(filePath, JSON.stringify(guides), (err) => {
        if (err) {
          return rej(err);
        }
        res(newGuide);
      });
    } catch (error) {
      rej(error);
    }
  });
}
// addGuide('Node js','Node js asoslar')

// read
function getAllGuides() {
  return new Promise((res, rej) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return rej(err);
      }
      res(JSON.parse(data.toString()));
    });
  });
}

function getGuideById(id) {
  return new Promise((res, rej) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return rej(err);
      }
      res(_.filter(JSON.parse(data.toString()), (guide) => guide.id === id));
    });
  });
}

// update
function updateGuideById(id, { title, content }) {
  return new Promise(async (res, rej) => {
    try {
      const updatedGuide = validator({ id, title, content });
      let guides = await getAllGuides();
      let existGuide;
      guides = guides.filter((el) => {
        if (el.id === id) {
          existGuide = el;
        } else {
          return true;
        }
      });
      guides.push(updatedGuide);
      fs.writeFile(filePath, JSON.stringify(guides), (err) => {
        if (err) {
          return rej(err);
        }
        res(updatedGuide);
      });
    } catch (error) {
      rej(error);
    }
  });
}

// delete
function deleteGuideById(id) {
  return new Promise(async (res, rej) => {
    try {
      let guides = await getAllGuides();
      let existGuide;
      guides = guides.filter((el) => {
        if (el.id === id) {
          existGuide = el;
        } else {
          return true;
        }
      });
      fs.writeFile(filePath, JSON.stringify(guides), (err) => {
        if (err) {
          return rej(err);
        }
        res(existGuide);
      });
    } catch (error) {
      rej(error);
    }
  });
}
// deleteGuideById("1");

module.exports = {
  addGuide,
  getAllGuides,
  getGuideById,
  updateGuideById,
  deleteGuideById,
};
