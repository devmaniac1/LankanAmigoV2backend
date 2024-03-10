const express = require("express");
const serpController = require("./../controllers/serpController");
const router = express.Router();
router.route("/Google-hotels").get(serpController.getHotels);
router.route("/places").get(serpController.getPlaces);

module.exports = router;
