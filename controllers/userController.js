const User = require("../models/signUpDetails");
const bcrypt = require("bcrypt");

const controller = {
  signup: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create a new user
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();
      console.log("User registered successfully");
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).json({ message: "An error occurred during signup" });
    }
  },
  authMe: (req, res) => {
    console.log("get me");
    try {
      const decoded = jwt.verify(req.cookies[COOKIE_NAME], JWT_SECRET);
      console.log("decoded", decoded);
      return res.send(decoded);
    } catch (err) {
      console.log(err);
      res.send(null);
    }
    res.send("hello");
  },
};

module.exports = controller;
