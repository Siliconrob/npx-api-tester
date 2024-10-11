const Boom = require("@hapi/boom");
const superagent = require("superagent");
const fetch = require("node-fetch");
const log = require("./appLogger.js");


function validateEnvVariable(envName) {
  if (!envName || !envName.length) {
    throw new Boom.preconditionFailed(`The env cannot be null or empty`);
  }

  if (!(envName in process.env)) {
    throw new Boom.preconditionFailed(
      `Please review the README.md.  You must set the .env variable "${envName}"`
    );
  }

  if (!process.env[envName].length) {
    throw new Boom.preconditionFailed(
      `The env variable ${envName} cannot be null or empty`
    );
  }
}

module.exports = {
  RemoveNullUndefined: (obj) =>
    Object.entries(obj).reduce(
      (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
      {}
    ),
  AirTableBaseUrl: "https://api.airtable.com/v0",
  GeocoderUrl: {
    HERE: "https://geocode.search.hereapi.com/v1/geocode",
  },
  IsEmptyObject: function(toTest) {
    return Object.keys(toTest ?? Object).length === 0 && (toTest ?? Object).constructor === Object;
  },
  TryCatchLog: async function(runFn) {
    try {
      return await runFn();
    } catch (exc) {
      log.current.error(exc);
    }
    return {};
  },
  GeneralErrorHandlerFn: async function (runFn) {
    ["mapkey", "airtable_key"].forEach((z) => validateEnvVariable(z));

    try {
      return await runFn();
    } catch (error) {
      console.log(error);
      throw Boom.badRequest(error.response.text);
    }
  },
  DefaultStartTime: new Date(2000, 1, 1),
  Get: async function (url) {
    return await superagent
    .get(url)
    .auth(process.env.airtable_key, {
      type: "bearer",
    });
  },
  GetNoAuth: async function (url) {
    return await superagent
      .get(url)
      .set("User-Agent", process.env.no_auth_agent || "me me me");
  },
  InsecureGet: async function(url) {
    const authHeader = Buffer.from(`${process.env.owner_rez_username}:${process.env.owner_rez_token}`, 'utf8').toString('base64');    
    const response = await fetch(url, {
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Basic ${authHeader}`,
        "User-Agent": process.env.owner_rez_user_agent
      }
    });    
    return await response.json();
  },
  CustomVerb: async function (verb, url, data) {    
    const authHeader = Buffer.from(`${process.env.owner_rez_username}:${process.env.owner_rez_token}`, 'utf8').toString('base64');    
    const response = await fetch(url, {
      method: verb,
      body: JSON.stringify(data),
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Basic ${authHeader}`,
        "User-Agent": process.env.owner_rez_user_agent
      }
    });    
    return await response.json();
  },  
};
