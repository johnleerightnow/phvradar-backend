const mongoose = require("mongoose");

const taxisAvailableSchema = new mongoose.Schema({
  Latitude: {
    required: false,
    type: Number,
  },
  Longitude: {
    required: false,
    type: Number,
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

const taxisAvailableModel = mongoose.model(
  "taxisAvailable",
  taxisAvailableSchema,
  "taxisAvailable"
);

module.exports = taxisAvailableModel;
