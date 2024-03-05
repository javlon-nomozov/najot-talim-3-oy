const _ = require("lodash");
const fs = require("fs");
const { join: path } = require("path");
const { v4: uuid } = require("uuid");

const filePath = path(__dirname, "..", "db", "guides.json");

// create
function addGuide(title, content) {
  return new Promise(async (res, rej) => {
    let guides;
    try {
      guides = await getAllGuides();
    } catch (error) {
      guides = [];
    }
    const newGuide = { id: uuid(), title, content };
    guides.push(newGuide);
    fs.writeFile(filePath, JSON.stringify(guides), (err) => {
      if (err) {
        return rej(err);
      }
      res(newGuide);
    });
  });
}

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
    let guides = await getAllGuides();
    let guideExist;
    guides = guides.map((guide) => {
      if (guide.id === id) {
        guideExist = guide;
        guide.title = title || guide.title;
        guide.content = content || guide.content;
      }
      return guide;
    });
    if (guideExist) {
      fs.writeFile(filePath, JSON.stringify(guides), (err) => {
        if (err) {
          return rej(err);
        }
        res({ id, ...guideExist });
      });
    } else {
      return res({});
    }
  });
}

// delete
function deleteGuideById(id) {
  return new Promise(async (res, rej) => {
    let guides = await getAllGuides();
    let guideExist;
    guides = guides.filter((el) => {
      if (el.id !== id) {
        return true;
      } else {
        guideExist = el;
      }
    });
    if (guideExist) {
      fs.writeFile(filePath, JSON.stringify(guides), (err) => {
        if (err) {
          return rej(err);
        }
        res(guideExist);
      });
    } else {
      res({});
    }
  });
}

module.exports = {
  addGuide,
  getAllGuides,
  getGuideById,
  updateGuideById,
  deleteGuideById,
};
