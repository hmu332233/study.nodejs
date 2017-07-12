const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(function(req,res){
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n'); 
});

server.listen(process.env.PORT || 3000 , process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});