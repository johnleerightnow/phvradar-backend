const axios = require("axios");
const api = {
  getErpRates: async () => {
    /* How to keep trying using ?$skip=500 until there is no more results and then return */
    // Start with a for loop? or a ternary operator?
    // If result exists then try again with request + ?$skip=500
    let arr = [];
    async function getRates(count) {
      count !== undefined ? count : (count = 0);
      try {
        let result = await axios.get(
          `http://datamall2.mytransport.sg/ltaodataservice/ERPRates?$skip=${count}`,
          {
            headers: {
              AccountKey: process.env.DATAMALL_API_PASS,
              "Content-Type": "application/json",
            },
          }
        );
        if (result.data.value.length > 0) {
          count += 500;
          arr.push(...result.data.value);
          await getRates(count);
        }
      } catch (error) {
        console.error("erpRates Api error", error);
      }
      return arr;
    }
    return await getRates();
  },
};

module.exports = api;
