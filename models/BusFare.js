const mongoose = require("mongoose");

const busFareSchema = new mongoose.Schema({
  RouteNumber: String,
  From: String,
  To: String,
  NormalFare: Number,
  SemiLuxuryFare: Number,
  LuxuryFare: Number,
});

const BusFare = mongoose.model("busFare", busFareSchema);

module.exports = BusFare;
