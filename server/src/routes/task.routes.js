const router = require("express").Router();
const { getTasks, getTask, createTask, updateTask, updateTaskStatus, deleteTask, addComment } = require("../controllers/task.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);
router.route("/").get(getTasks).post(createTask);
router.route("/:id").get(getTask).put(updateTask).delete(deleteTask);
router.patch("/:id/status",   updateTaskStatus);
router.post("/:id/comments",  addComment);

module.exports = router;
