const { getErpRates } = require("../apis/api");
const ErpRatesModel = require("../models/erprates");
const ErpLocationModel = require("../models/erplocations");
const ErpDescriptionModel = require("../models/erpdescriptions");

const controller = {
  updateErpRates: async (req, res) => {
    let result = await getErpRates();
    try {
      await ErpRatesModel.collection.drop().then((drpres) => {
        console.log("drop respons", drpres);
      });
      ErpRatesModel.insertMany(result).then((resp) => {
        console.log("insert resp", resp);
        console.log("Result succesfully insert into DB");
      });
    } catch (error) {
      console.log("updateErpRates api", error);
    }
    // res.status(200).send("Result succesfully insert into DB");
  },
  findRateForGantry: async (req, res) => {
    const result = await ErpRatesModel.find({ ZoneID: "AY1" });
    console.log(result);
    res.status(200).send(result);
  },

  allGantryPositions: async (req, res) => {
    try {
      const allpositionresults = await ErpLocationModel.find({});
      const filterResults = allpositionresults.map((e) => {
        return {
          CorLink: e.CorLink,
          leftlat: e.leftlatitude,
          leftlong: e.leftlongitude,
          rightlat: e.rightlatitude,
          rightlong: e.rightlongitude,
        };
      });
      console.log("allGantriesPosition requested");

      res.status(200).send(filterResults);
    } catch (error) {
      console.log("allGantriesPositon api", error);
    }
  },
  findNameOfGantry: async (req, res) => {
    console.log("req.body", req.body);
    try {
      const dbresult = await ErpDescriptionModel.aggregate([
        {
          $match: {
            CorLink: req.body.CorLink,
          },
        },
        {
          $lookup: {
            from: "erplocations",
            localField: "CorLink",
            foreignField: "CorLink",
            as: "mergedData",
          },
        },
        {
          $unwind: "$mergedData",
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$mergedData", "$$ROOT"],
            },
          },
        },
        {
          $project: {
            mergedData: 0,
            // Include other fields from collection1 if needed
          },
        },
      ]);
      console.log(dbresult);
      res.status(200).send(dbresult);
    } catch (error) {
      // Handle any errors that occur during the query
      console.error(error);
      throw error;
    }
  },
  test: async (req, res) => {
    // const result = await connectMongoDB.collection("erplocations");
    // const finalresult = result.find({});
    res.status(200).send(finalresult);
  },
};

module.exports = controller;
