const bcrypt = require("bcrypt");
const saltRounds = 10;

// Example function to hash a password
exports.hashPassword = async function (password) {
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

// Example function to compare passwords
exports.comparePasswords = async function (plainPassword, hashedPassword) {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
};
