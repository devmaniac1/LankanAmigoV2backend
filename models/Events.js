const mongoose = require("mongoose");

const eventsSchema = new mongoose.Schema({
  name: String,
  date: Object,
  address: Object,
  location: Object,
  description: String,
  ticket: Array,
  thumbnail: String,
});

const Events = mongoose.model("Events", eventsSchema);

module.exports = Events;
