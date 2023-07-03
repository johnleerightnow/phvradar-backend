const mongoose = require("mongoose");

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
