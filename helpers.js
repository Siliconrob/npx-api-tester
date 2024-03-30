const Boom = require("@hapi/boom");
const superagent = require("superagent");

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
    return await superagent.get(url).auth(process.env.airtable_key, {
      type: "bearer",
    });
  },
  GetNoAuth: async function (url) {
    return await superagent
      .get(url)
      .set("User-Agent", process.env.no_auth_agent);
  },
};
