const mongoose = require("mongoose");

const accommodationSchema = new mongoose.Schema({
  locationId: String,
  name: String,
  distance: String,
  city: String,
  address: String,
});

const Accommodation = mongoose.model("Accommodation", accommodationSchema);

module.exports = Accommodation;
