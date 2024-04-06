const Joi = require("joi");
const appHelper = require("./helpers");
const Airtable = require("airtable");
const turf = require("@turf/helpers");
const log = require("./appLogger.js");
require("dotenv").config();

const dataTable = "Locations";

function getAirTableBase() {
  const base = new Airtable({
    apiKey: process.env.airtable_key,
  }).base(process.env.airtable_base);
  return base;
}

async function getCurrentLocations() {
  const base = getAirTableBase();
  const points = [];
  const paged = await base(dataTable)
    .select({
      filterByFormula: "{Approved} = 1",
    })
    .eachPage(function page(records, fetchNextPage) {
      records.forEach((z) => {
        const newPoint = turf.point([z.fields.Longitude, z.fields.Latitude], {
          dataId: z.id,
          id: z.fields.Id,
          photo: z.fields.Photo.shift(),
          text: z.fields.PublicText,
        });
        points.push(newPoint);
      });
      fetchNextPage();
    });
  return turf.featureCollection(points);
}

async function createNewLocationRecord(newRecord) {
  const base = getAirTableBase();
  const updatedRecords = await base(dataTable).create([{ fields: newRecord }]);
  return updatedRecords;
}

// const newRecord = {
//   Id: request.payload.id || crypto.randomUUID(),
//   Approved: false,
//   Photo: [{ url: request.payload.photo }],
//   PublicText: request.payload.publicText,
//   Latitude: request.payload.latitude,
//   Longitude: request.payload.longitude,
//   SubmissionDate: new Date().toISOString()
// };


module.exports = {
  getCurrentLocations,
  createNewLocationRecord,
}