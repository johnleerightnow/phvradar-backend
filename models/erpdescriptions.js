const mongoose = require("mongoose");

const erpdescriptionSchema = new mongoose.Schema({
  ZoneID: {
    required: true,
    type: String,
  },
  ERPGantryNum: {
    required: true,
    type: String,
  },
  ERPGantryLocation: {
    required: true,
    type: String,
  },
  CorLink: {
    required: true,
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
const ErpDescriptionModel = mongoose.model(
  "ErpDescription",
  erpdescriptionSchema
);

module.exports = ErpDescriptionModel;
