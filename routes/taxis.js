const express = require("express");
const router = express.Router();
const cron = require("node-cron");
const taxiController = require(".././controllers/taxiController");

router.get("/getTaxiAvailableCount", taxiController.getTaxiAvailableCount);

router.get("/test", taxiController.getTaxisNearBy);

// cron job to update taxis available in db every 5 minutes
cron.schedule(
  "*/5 * * * *",
  () => {
    taxiController.getTaxisNearBy();
  },
  { schedule: true, timezone: "Asia/Singapore" }
);

module.exports = router;
