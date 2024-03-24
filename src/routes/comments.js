const router = require("express").Router();
const accessCheckerMid = require("../middlewares/has-role");
const { createBookSchema, editBookSchema } = require("../schemas/books");
const validate = require("../utils/validate");

const { createComment } = require("../controllers/comments.js");
const { commentSchema } = require("../schemas/comments.js");

router.post("/create", validate(commentSchema), createComment);

module.exports = router;
