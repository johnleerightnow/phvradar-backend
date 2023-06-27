/* Get login url for google oauth*/

const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const oauth2Client = new OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:1777/auth/google"
);

const scopes = ["email", "profile"]; // Add the necessary scopes

const loginUrl = oauth2Client.generateAuthUrl({
  scope: scopes,
});

console.log("Login URL:", loginUrl);

/* Convert Excel to Json */
const XLSX = require("xlsx");

// Read the Excel file
const workbook = XLSX.readFile("/Users/johnlee/Desktop/GantryDetails.xlsx");

// Choose the sheet you want to convert to JSON
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert the worksheet to JSON
const jsonData = XLSX.utils.sheet_to_json(worksheet);

// Combine headers and columns
const combinedData = jsonData.map((row) => {
  const combinedRow = {};
  combinedRow["ZoneID"] = row["Column1"];
  combinedRow["ERPGantryNum"] = row["Column2"];
  combinedRow["ERPGantryLocation"] = row["Column3"];
  combinedRow["CorLink"] = row["Column4"];
  return combinedRow;
});

// Print the combined data in JSON format
console.log(JSON.stringify(combinedData, null, 2));

console.log(jsonData);

async function getDbJoinResult() {
  try {
    const dbresult = await db
      .collection("erpdescriptions")
      .aggregate([
        {
          $match: {
            CorLink: 47,
          },
        },
        {
          $lookup: {
            from: "erplocations",
            localField: "CorLink",
            foreignField: "CorLink",
            as: "merged",
          },
        },
        {
          $unwind: "$merged",
        },
        {
          $addFields: {
            "merged.ErpGantryLocation": "$ERPGantryLocation",
            // Include other fields from collection1 inside the merged object
          },
        },
        {
          $project: {
            merged: 1,
            // Include other fields from collection1 if needed
          },
        },
      ])
      .next();
    console.log(dbresult);
    return dbresult;
  } catch (error) {
    // Handle any errors that occur during the query
    console.error(error);
    throw error;
  }
}
