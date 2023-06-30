require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const trafficController = require("./controllers/trafficController");
const userController = require("./controllers/userController");
const port = process.env.PORT || 1777;
const cookieParser = require("cookie-parser");
const { UI_ROOT_URI } = require("./config");
const usersRouter = require("./routes/users");
const trafficRouter = require("./routes/traffic");
const ErpLocationModel = require("./models/erplocations");
const ErpDescriptionModel = require("./models/erpdescriptions");
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // Sets Access-Control-Allow-Origin to the UI URI
    origin: UI_ROOT_URI,
    // Sets Access-Control-Allow-Credentials to true
    credentials: true,
  })
);

/* Catch all routes */
app.use((err, req, res, next) => {
  // Log the error or perform any desired actions
  console.error(err);
  //  Check if the error has a custom status code, otherwise default to 500 (Internal Server Error)
  const statusCode = err.statusCode || 500;

  // Log the error along with the route for debugging purposes
  console.error(`Error in ${req.method} ${req.originalUrl}:`, err);

  // Create a response JSON object with an error message including the route information
  const response = {
    error: {
      message: `Error in ${req.method} ${req.originalUrl}`,
    },
  };
  // Send the appropriate HTTP status code and the response as JSON
  res.status(statusCode).json(response);
});

async function connectMongoDB() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("Connected to MongoDB database.");

    // Continue with other operations
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // Handle connection error
  }
}

connectMongoDB();

// db.on("error", console.error.bind(console, "DB connection error: "));
// db.once("open", function () {
//   console.log("DB Connected successfully");
// });
// what's the difference between the above codes?

// app.use("/user", usersRouter);
// app.use("/traffic", trafficRouter);

app.get("/", (req, res) => {
  res.send("Welcome to PhvRadar");
});

app.post("/signup", userController.signup);

app.listen(port, () => {
  console.log(`phv radar listening on port ${port}`);
});
