const express = require("express");
const googleController = require("./../controllers/googleController");
const router = express.Router();

router.route("/calculate-route").get(googleController.calculate);
router.route("/nearby").get(googleController.getNearby);
module.exports = router;
