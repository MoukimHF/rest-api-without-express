const http = require("http");
const https = require("https");
const fs = require("fs");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const config = require("./config");
const httpsServerOptions = {
    key : fs.readFileSync('./https/key.pem'),
    cert : fs.readFileSync('./https/cert.pem')
};
//instantiating the HTTP server
const httpServer = http.createServer((req, res) => {
    unifiedServer(req,res)
});
//instantiating the HTTPS server
const httpsServer = https.createServer(httpsServerOptions,(req, res) => {
    unifiedServer(req,res)
});
//start the HTTP server
httpServer.listen(config.httpPort, () => {
  console.log(
    "Server is on " + config.envName + " listening on port " + config.httpPort
  );
});

httpsServer.listen(config.httpsPort, () => {
    console.log(
      "Server is on " + config.envName + " listening on port " + config.httpsPort
    );
  });

var unifiedServer = function (req, res) {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const queryStringObject = parsedUrl.query;
  const method = req.method.toLowerCase();
  const { headers } = req;
  const decoder = new StringDecoder("utf-8");
  let buffer = "";
  // what that means is : as the data is streaming in, every time it streams in a little piece of data
  //the request object emmits the data event that we are binding to and it sends us a bench of undecoded data we know it should be utf-8 so we decoded it
  // and we append the result into the buffer variable
  req.on("data", (data) => {
    buffer += decoder.write(data);
  });
  req.on("end", () => {
    buffer += decoder.end();
    // Choose the handler this request should go to. If one is not found, use the not found handler!
    var choosedHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;
    // Construst the data object to send to the handler
    var data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStringObject,
      method: method,
      headers: headers,
      payload: buffer,
    };
    // Route the request to the handler specified in the router
    choosedHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;
      // Use the payload called back by the handler, or default to an empty object
      payload = typeof payload == "object" ? payload : {};

      // Convert the payload to a string
      var payloadString = JSON.stringify(payload);
      // return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log("Returning this response: ", statusCode, payloadString);
    });
  });
};

// defining the handlers
var handlers = {};

// sample handler
handlers.sample = function (data, callback) {
  // callback an http status code, and a payload object
  callback(200, {
    name: "sample handler",
  });
};

// not found handler
handlers.notFound = function (data, callback) {
  callback(404);
};

// Defining a request router
var router = {
  sample: handlers.sample,
};

// all the server logic for both the http and https server
