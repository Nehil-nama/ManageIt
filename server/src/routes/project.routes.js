const router = require("express").Router();
const { getProjects, getProject, createProject, updateProject, deleteProject } = require("../controllers/project.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);
router.route("/").get(getProjects).post(createProject);
router.route("/:id").get(getProject).put(updateProject).delete(deleteProject);

module.exports = router;
