var environments = {};
environments.staging = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: "staging",
};

environments.production = {
  httpPort: 6000,
  httpsPort: 6001,
  envName: "production",
};

var currentEnvironment =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";
var environmentToExport =
  typeof environments[currentEnvironment] == "object"
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentToExport;
