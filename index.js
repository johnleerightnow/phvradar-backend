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
const taxiRouter = require("./routes/taxis");
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

app.use("/user", usersRouter);
app.use("/traffic", trafficRouter);
app.use("/taxi", taxiRouter);
app.get("/", (req, res) => {
  res.send("Welcome to PhvRadar");
});


app.listen(port, () => {
  console.log(`phv radar listening on port ${port}`);
});
