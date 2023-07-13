const { getErpRates, fetchTrafficIncidents } = require("../apis/api");
const TrafficIncidents = require("../models/trafficIncidents");
const ErpRatesModel = require("../models/erprates");
const ErpLocationModel = require("../models/erplocations");
const ErpDescriptionModel = require("../models/erpdescriptions");
const UserModel = require("../models/users");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

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
    // res.send("Result succesfully insert into DB");
  },
  findRateForGantry: async (req, res) => {
    const result = await ErpRatesModel.find({ ZoneID: "AY1" });
    console.log(result);
    res.send(result);
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

      res.send(filterResults);
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
      res.send(dbresult);
    } catch (error) {
      // Handle any errors that occur during the query
      console.error(error);
      throw error;
    }
  },
  storeLocationAndPrice: async (req, res) => {
    try {
      const { corLink, token, dayOfWeek } = req.body;
      console.log(token);
      const decodedJWT = jwt.verify(token, jwtSecret);
      console.log(decodedJWT);
      const time = new Date();
      const dateObj = new Date(time);
      const options = { hour: "numeric", minute: "numeric", hour12: false };
      const formattedTime = dateObj.toLocaleString("en-US", options);
      console.log(formattedTime);

      let dayType = dayOfWeek === 6 ? "Saturday" : "Weekdays";

      const result = await ErpDescriptionModel.aggregate([
        {
          $match: {
            CorLink: corLink,
          },
        },
        {
          $lookup: {
            from: "erprates",
            localField: "ZoneID",
            foreignField: "ZoneID",
            as: "collection2Data",
          },
        },
      ]).exec();

      const getTimeInMinutes = (timeString) => {
        const [hours, minutes] = timeString.split(":").map(Number);
        return hours * 60 + minutes;
      };

      const filteredData = result[0].collection2Data
        .filter((item) => {
          const startTimeMinutes = getTimeInMinutes(item.StartTime);
          const endTimeMinutes = getTimeInMinutes(item.EndTime);
          const currentTimeMinutes = getTimeInMinutes(formattedTime);
          const isTimeInRange =
            startTimeMinutes <= currentTimeMinutes &&
            currentTimeMinutes <= endTimeMinutes;
          const isVehicleTypeTaxis =
            item.VehicleType === "Passenger Cars/Light Goods Vehicles/Taxis";
          const isDayType = item.DayType === dayType;
          return isTimeInRange && isVehicleTypeTaxis && isDayType;
        })
        .filter(Boolean);

      if (
        filteredData &&
        Array.isArray(filteredData) &&
        filteredData.length > 0
      ) {
        await UserModel.findOneAndUpdate(
          { _id: decodedJWT._id },
          {
            $push: {
              locations: {
                location: result[0].ERPGantryLocation,
                rate: filteredData[0].ChargeAmount,
                time,
              },
            },
          }, // Add the new location using $push
          { new: true } // Specify `new: true` to return the updated document
        );
        res.json({
          location: result[0].ERPGantryLocation,
          price: filteredData,
          status: 1,
        });
      } else {
        throw `No Price Found`;
      }
    } catch (error) {
      // Handle the error
      console.error(error);
      throw error;
    }
  },
  updateTrafficIncidents: async (req, res) => {
    let result = await fetchTrafficIncidents();
    try {
      await TrafficIncidents.collection.drop().then((drpres) => {
        console.log("drop respons", drpres);
      });
      TrafficIncidents.insertMany(result).then((resp) => {
        console.log("Result succesfully insert into DB");
      });
    } catch (error) {
      console.log("updateErpRates api", error);
    }
    return
  },
  getTrafficIncidents: async (req, res) => {
    let result = await TrafficIncidents.aggregate([
      {
        $match: { Type: "Accident" },
      },
      {
        $project: {
          _id: 0,
          created_at: 0,
          updated_at: 0,
          __v: 0,
          Type: 0,
        },
      },
    ]);
    res.send({ message: "success", data: result, status: 1 });
  },
};

module.exports = controller;
