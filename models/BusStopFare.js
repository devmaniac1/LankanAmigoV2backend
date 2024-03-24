const mongoose = require("mongoose");

const busStopFareSchema = new mongoose.Schema({
  StopFare: Number,
  RouteFare: Number,
});

const BusStopFare = mongoose.model("busStopsFare", busStopFareSchema);

module.exports = BusStopFare;
