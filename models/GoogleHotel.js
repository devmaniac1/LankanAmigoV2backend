const mongoose = require("mongoose");

const googleHotelSchema = new mongoose.Schema({
  location: String,
  name: String,
  url: String,
  long: String,
  lat: String,
  price: String,
  // ratePerNight: String,
  // source: String,
  // sourceLogo: String,
  ratings: String,
  reviews: String,
  amenities: Array,
  essentialInfo: Array,
});

const GoogleHotel = mongoose.model("GoogleHotel", googleHotelSchema);

module.exports = GoogleHotel;
