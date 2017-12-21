var http = require('http');

http.createServer(function(request,response){
  response.writeHead(200,{'Content-type':'text/html'});
  response.end("<html><head><title>Hi!</title></head><body>yay!</body></html>")
}).listen(8080);
