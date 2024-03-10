const express = require("express");
const tripadvisorController = require("./../controllers/tripadvisorController");
const router = express.Router();
router.route("/get-accomodations").get(tripadvisorController.getAccommodations);
router
  .route("/accommodationDetails")
  .get(tripadvisorController.getAccommodationsDetails);
router
  .route("/accommodationPhotos")
  .get(tripadvisorController.getAccommodationPhotos);

module.exports = router;
