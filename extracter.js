const Joi = require("joi");
const appHelper = require("./helpers.js");
const log = require("./appLogger.js");
const { parseFromString } = require('dom-parser');
require("dotenv").config();

async function getContents(url) {
  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  let pageHtml = await response.text();
  const htmlDoc = parseFromString(pageHtml, "text/html");
  return htmlDoc;
}

module.exports = {
  getContents
};
