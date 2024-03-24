const express = require("express");

const { addComment } = require("../models/comment.js");

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
exports.createComment = async (req, res) => {
  let { ownerName, content, bookId } = req.body;
  if (!ownerName) {
    ownerName = req.user.name || "Anonymous";
  }
  const comment = await addComment(content, ownerName, bookId);
  req.flash.set("alerts", {type: "success", message: "Comment created successfully."});
  res.redirect(`/books/${bookId}`);
};
