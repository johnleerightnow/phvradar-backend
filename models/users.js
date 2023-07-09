const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  location:String,
  rate:Number,
  time: Date,
  // Other location fields
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 100,
  },
  email: {
    type: String,
    required: true,
    max: 100,
    unique: true,
  },
  salt: {
    type: String,
  },
  hash: {
    type: String,
  },
  googleSignIn:{
   type:Boolean,
   default:false

  },
  locations:[locationSchema],
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

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
