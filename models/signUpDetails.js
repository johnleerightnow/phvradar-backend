const mongoose = require("mongoose");

const signupschema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const signupmodel = mongoose.model("signUpDetails", signupschema);

module.exports = signupmodel;
