const express = require("express");
const router = express.Router();
const trafficController = require(".././controllers/trafficController");
const cron = require("node-cron");

router.get("/updateErpRates", trafficController.updateErpRates);

router.get("/findRateForGantry", trafficController.findRateForGantry);

router.post("/storelocationandprice", trafficController.storeLocationAndPrice);

router.get("/allGantryPositions", trafficController.allGantryPositions);

router.post("/findNameOfGantry", trafficController.findNameOfGantry);

router.get(
  "/getTrafficIncidents",
  trafficController.getTrafficIncidents
);

router.get("/test", trafficController.updateTrafficIncidents);

cron.schedule(
  "1 01 * * *",
  () => {
    trafficController.updateErpRates();
  },
  { schedule: true, timezone: "Asia/Singapore" }
);

// cron job to update traffic incidents in db every 5 minutes
cron.schedule(
  "*/5 * * * *",
  () => {
    trafficController.updateTrafficIncidents();
  },
  { schedule: true, timezone: "Asia/Singapore" }
);

module.exports = router;
