const mongoose = require("mongoose");

const erplocationSchema = new mongoose.Schema({
  CorLink: {
    required: false,
    type: Number,
  },
  leftlatitude: {
    required: false,
    type: Number,
  },
  leftlongitude: {
    required: false,
    type: Number,
  },
  rightlatitude: {
    required: false,
    type: Number,
  },
  rightlongitude: {
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
const ErpLocationModel = mongoose.model("ErpLocation", erplocationSchema);

module.exports = ErpLocationModel;
