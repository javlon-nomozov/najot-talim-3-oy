const router = require("express").Router();
const accessChecherMid = require("../middlewares/has-role");
const validate = require("../utils/validate");
const { createTodoeSchem, updateTodoeSchem } = require("../schemas/todoes");

const {
  allTodoesPage,
  createTodoPage,
  createTodo,
  deleteTodoPage,
  deleteTodo,
  getTodoPage,
  markAsRead,
} = require("../controllers/todoes");

// all todoes
router.get("/", allTodoesPage);

router.get("/create", accessChecherMid("admin"), createTodoPage);

router.post(
  "/create",
  accessChecherMid("admin"),
  validate(createTodoeSchem,'/todoes/create'),
  createTodo
);

// delete todo page
router.get("/:id/delete", accessChecherMid("admin"), deleteTodoPage);

// delete todo
router.post("/delete", accessChecherMid("admin"), deleteTodo);

// get todo by id
router.get("/:id", getTodoPage);
router.post("/:id/read", markAsRead);

module.exports = router;
