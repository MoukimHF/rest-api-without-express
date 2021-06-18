var environments = {};
environments.staging = {
  port: 5000,
  envName: "staging",
};

environments.production = {
  port: 6000,
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
