const mongoose = require("mongoose");

const trafficIncidentsSchema = new mongoose.Schema({
  Latitude: {
    required: false,
    type: Number,
  },
  Longitude: {
    required: false,
    type: Number,
  },
  Type: {
    required: false,
    type: String,
  },
  Message: {
    required: false,
    type: String,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const trafficIncidentsModel = mongoose.model(
  "trafficIncidents",
  trafficIncidentsSchema,
  "trafficIncidents"
);

module.exports = trafficIncidentsModel;
