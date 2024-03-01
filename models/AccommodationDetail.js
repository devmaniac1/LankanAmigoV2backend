const mongoose = require("mongoose");

const accommodationDetailSchema = new mongoose.Schema({
  locationId: String,
  name: String,
  webURL: String,
  city: String,
  address: String,
  long: String,
  lat: String,
  rating: String,
  reviewsNo: String,
  amenities: Array,
});

const AccommodationDetail = mongoose.model(
  "AccommodationDetail",
  accommodationDetailSchema
);

module.exports = AccommodationDetail;
