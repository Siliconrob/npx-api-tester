const Joi = require("joi");
const appHelper = require("./helpers");
require("dotenv").config();

async function findLocation(address) {
  const searchBy = {
    q: address,
    apiKey: process.env.here_api_key,
    limit: 1,
  };
  return await appHelper.TryCatchLog(async () => {
    const response = await appHelper.GetNoAuth(`${appHelper.GeocoderUrl.HERE}?${new URLSearchParams(searchBy).toString()}`);
    return {
      inputSearch: address,
      details: response.body.items.shift(),
    };
  });
}

module.exports = {
  findLocation
};
