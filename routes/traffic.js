const express = require("express");
const router = express.Router();
const trafficController = require(".././controllers/trafficController");
const cron = require("node-cron");

router.get("/updateErpRates", trafficController.updateErpRates);

router.get("/findRateForGantry", trafficController.findRateForGantry);

router.get("/allGantryPositions", trafficController.allGantryPositions);

router.post("/findNameOfGantry", trafficController.findNameOfGantry);

router.get("/test", trafficController.test);

cron.schedule(
  "1 01 * * *",
  () => {
    trafficController.updateErpRates();
  },
  { schedule: true, timezone: "Asia/Singapore" }
);

module.exports = router;
