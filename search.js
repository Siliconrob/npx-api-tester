const Joi = require("joi");
const appHelper = require("./helpers");
const log = require("./appLogger.js");
require("dotenv").config();

async function findLocation(address) {
  const searchBy = {
    q: address,
    apiKey: process.env.here_api_key,
    limit: 1,
  };
  const response = await appHelper.GetNoAuth(`${appHelper.GeocoderUrl.HERE}?${new URLSearchParams(searchBy).toString()}`);

  return {
    inputSearch: address,
    details: response.body.items.shift(),
  };
}

module.exports = {
  findLocation
};
