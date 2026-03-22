const router = require("express").Router();
const { getUsers, getUser, updateUser } = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");

router.use(protect);
router.get("/",    getUsers);
router.route("/:id").get(getUser).put(updateUser);

module.exports = router;
