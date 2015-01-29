"use strict";

var through = require("through2");
var duplexer = require("duplexer2");
var shoe = require("shoe");
var http = require("http");
var browserify = require("browserify");
var buffer = require("stream-buffer");
var createOPCParser = require("opc/parser");
var createOPCStream = require("opc");
var base64 = require("base64-stream");

var b = browserify(__dirname + "/websocket-client.js");
b.transform(require("brfs"));
var bundle = b.bundle().pipe(buffer());

function handler(req, res) {
  if (req.method === "GET" && req.url === "/") {
    sendBundle(req, res);
  }
}

function sendBundle(req, res) {
  var stream = through();
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.write("<html><body><script>");
  bundle.replay(stream);
  stream.pipe(res, { end: false });
  stream.on("end", function() {
    res.write("</script></body></html>");
    res.end();
  });
}

module.exports = function(options) {
  var server = http.createServer(handler);
  var parser = createOPCParser().resume();
  shoe({}, function(stream) {
    var opc = createOPCStream();
    opc.pipe(base64.encode()).pipe(stream);
    parser.on("data", function(message) {
      opc.writeMessage(message.channel, message.command, message.data);
    });
  }).install(server, "/opc");

  server.listen(options.port || 8080);
  return duplexer(parser, through());
};
