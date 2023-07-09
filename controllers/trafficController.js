const { getErpRates } = require("../apis/api");
const ErpRatesModel = require("../models/erprates");
const ErpLocationModel = require("../models/erplocations");
const ErpDescriptionModel = require("../models/erpdescriptions");
const UserModel=require("../models/users")
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
      res.status(200).send(dbresult);
    } catch (error) {
      // Handle any errors that occur during the query
      console.error(error);
      throw error;
    }
  },
  storeLocationAndPrice: async (req, res) => {
    try {
      const {corLink,token}=req.body;
      console.log(token)
      const decodedJWT = jwt.verify(token, jwtSecret);
      console.log(decodedJWT)
      const time=new Date()
      const dateObj = new Date(time);
      const options = { hour: 'numeric', minute: 'numeric', hour12:false };
      const formattedTime = dateObj.toLocaleString('en-US', options);
      console.log(formattedTime)
      const result = await ErpDescriptionModel.aggregate([
        {
          $match: {
            CorLink: corLink
          }
        },
        {
          $lookup: {
            from: 'erprates',
            localField: 'ZoneID',
            foreignField: 'ZoneID',
            as: 'collection2Data'
          }
        }
      ]).exec();
  
      const getTimeInMinutes = (timeString) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
      };
      
      const filteredData = result[0].collection2Data.filter(item => {
        const startTimeMinutes = getTimeInMinutes(item.StartTime);
        const endTimeMinutes = getTimeInMinutes(item.EndTime);
        const currentTimeMinutes = getTimeInMinutes(formattedTime);
        const isTimeInRange= startTimeMinutes <= currentTimeMinutes && currentTimeMinutes <= endTimeMinutes;
        const isVehicleTypeTaxis = item.VehicleType === 'Taxis';
        return isTimeInRange && isVehicleTypeTaxis;

      });
      console.log(filteredData)



      await UserModel.findOneAndUpdate(
        { _id: decodedJWT._id },
        { $push: { locations: { location: result[0].ERPGantryLocation, rate: result[0].collection2Data[0].ChargeAmount ,time} } }, // Add the new location using $push
        { new: true } // Specify `new: true` to return the updated document
      )
      res.json({location:result[0].ERPGantryLocation, price:filteredData.length>0?filteredData[0].ChargeAmount:null, time})
    } catch (error) {
      // Handle the error
      console.error(error);
      throw error;
    }
  },
};

module.exports = controller;
