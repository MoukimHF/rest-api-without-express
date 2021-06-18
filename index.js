const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const server = http.createServer((req, res) => {
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
    var choosedHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    // Construst the data object to send to the handler 
    var data = {
        'trimmedPath' : trimmedPath,
        'queryStringObject' : queryStringObject,
        'method' : method,
        'headers' : headers,
        'payload' : buffer
    }
    // Route the request to the handler specified in the router
    choosedHandler(data,(statusCode,payload)=>{
        // Use the status code called back by the handler, or default to 200 
        statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
        // Use the payload called back by the handler, or default to an empty object
        payload = typeof(payload) == 'object' ? payload : {};

        // Convert the payload to a string
        var payloadString = JSON.stringify(payload);
        // return the response 
        res.writeHead(statusCode);
        res.end(payloadString);

    });

});
});

server.listen(5000, () => {
  console.log("Server is listening on port 5000");
  console.log("http://localhost:5000");
});

// defining the handlers
var handlers = {};

// sample handler
handlers.sample = function (data, callback) {
    // callback an http status code, and a payload object
    callback(406,{
        'name':'sample handler'
    })
};

// not found handler
handlers.notFound = function (data, callback) {
    callback(404)
};

// Defining a request router
var router = {
  sample: handlers.sample,
};
