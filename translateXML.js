const Joi = require("joi");
const { XMLParser } = require('fast-xml-parser');
const appHelper = require("./helpers.js");
const log = require("./appLogger.js");
require("dotenv").config();

const alwaysArray = [
  // "root.a.c",
];

const options = {
  ignoreAttributes: false,
  //name: is either tagname, or attribute name
  //jPath: upto the tag name
  isArray: (name, jpath, isLeafNode, isAttribute) => { 
      if( alwaysArray.indexOf(jpath) !== -1) return true;
  }
};

async function urlToJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  const xmlData = await response.text();
  const parser = new XMLParser(options);
  return parser.parse(xmlData);
}

module.exports = {
  urlToJSON
};
