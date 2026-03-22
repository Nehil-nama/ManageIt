const router = require("express").Router();
const { getTeams, getTeam, createTeam, updateTeam, deleteTeam } = require("../controllers/team.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);
router.route("/").get(getTeams).post(createTeam);
router.route("/:id").get(getTeam).put(updateTeam).delete(deleteTeam);

module.exports = router;
