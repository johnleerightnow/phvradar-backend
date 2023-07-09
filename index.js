require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const trafficController = require("./controllers/trafficController");
const userController = require("./controllers/userController");
const port = process.env.PORT || 1777;
const cookieParser = require("cookie-parser");
const { UI_ROOT_URI } = require("./config")
//const usersRouter = require("./routes/users");
const trafficRouter = require("./routes/traffic");
const ErpLocationModel = require("./models/erplocations");
const ErpDescriptionModel = require("./models/erpdescriptions");;
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
      // `mongodb://127.0.0.1:27017/trafficDB`,
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

//app.use("/user", usersRouter);
app.use("/traffic", trafficRouter);
app.get("/", (req, res) => {
  res.send("Welcome to PhvRadar");
});

app.post("/api/v1/signup", userController.signup);
app.post("/api/v1/checkemail", userController.checkemail);
app.post("/api/v1/signin", userController.signin);
app.post("/api/v1/userprofile", userController.userprofile);
app.post("/api/v1/updateprofile", userController.updateprofile);
app.post("/api/v1/googlesignin",userController.googlesignin)
app.post("/api/v1/getmyerplocations",userController.getmyerplocations)
app.listen(port, () => {
  console.log(`phv radar listening on port ${port}`);
});
