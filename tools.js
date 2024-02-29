const fsp = require("fs/promises");
const path = require("path");

const customReadFile = async (filePath) => {
  return (await fsp.readFile(filePath)).toString();
};

const readPartial = async (fileName) =>
  await customReadFile(path.join(__dirname, "templates", "partials", fileName));

module.exports = { customReadFile, readPartial };
