const router = require("express").Router({ mergeParams: true });
const ChipController = require("../../controller/Chip");

router.put("/", ChipController.update);
router.get("/getAll", ChipController.getAll);
router.get("/sonoff", ChipController.getStatus);
router.post("/sonoff", ChipController.postCommand);

module.exports = router;
