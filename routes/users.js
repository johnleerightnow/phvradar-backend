const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController")

// Getting the current user
router.post("/signup", controller.signup);
router.post("/checkemail", controller.checkemail);
router.post("/signin", controller.signin);
router.post("/userprofile", controller.userprofile);
router.post("/updateprofile", controller.updateprofile);
router.post("/googlesignin", controller.googlesignin);
router.post("/getmyerplocations", controller.getmyerplocations);

// Export the router
module.exports = router;
