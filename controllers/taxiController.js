const { fetchTaxiAvailable } = require("../apis/api");
const TaxisAvailable = require("../models/taxisAvailable");

const controller = {
  getTaxisNearBy: async (req, res) => {
    res.send("taxi available sync in progress");
    let result = await fetchTaxiAvailable();
    try {
      await TaxisAvailable.collection.drop().then((drpres) => {
        console.log("drop respons", drpres);
      });
      TaxisAvailable.insertMany(result).then((resp) => {
        console.log("Result succesfully insert into DB");
      });
    } catch (error) {
      console.log("updateErpRates api", error);
    }
  },
  getTaxiAvailableCount: async (req, res) => {
    let result = await TaxisAvailable.count();
    res.send({ message: "success", data: result, status: 1 });
  },
};

module.exports = controller;
