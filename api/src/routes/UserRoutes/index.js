const router = require("express").Router({ mergeParams: true });
const UserController = require("../../controller/User");

router.post("/", UserController.create);
router.put("/password", UserController.updatePassword);

module.exports = router;
