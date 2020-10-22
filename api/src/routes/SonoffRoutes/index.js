const router = require("express").Router({ mergeParams: true });
const SonoffController = require("../../controller/Sonnof");

router.get("/", SonoffController.get);
router.post("/", SonoffController.postStatus);

module.exports = router;
