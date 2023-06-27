const mongoose = require("mongoose");

const erpratesSchema = new mongoose.Schema({
  VehicleType: {
    required: false,
    type: String,
  },
  DayType: {
    required: false,
    type: String,
  },
  StartTime: {
    required: false,
    type: String,
  },
  EndTime: {
    required: false,
    type: String,
  },
  ZoneID: {
    required: false,
    type: String,
  },
  ChargeAmount: {
    required: false,
    type: Number,
  },
  EffectiveDate: {
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
const ErpRatesModel = mongoose.model("ErpRates", erpratesSchema);

module.exports = ErpRatesModel;
