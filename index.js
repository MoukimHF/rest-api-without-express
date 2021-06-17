const http = require('http');
const url = require('url');
const server = http.createServer((req,res)=>{
    res.end("hello man! \n");
})

server.listen(5000,()=>{
    console.log("Server is listening on port 5000")
    console.log("http://localhost:5000")
})