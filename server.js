"use strict";

var through = require("through2");
var http = require("http");
var createWebsocketServer = require("websocket-stream/server");
var browserify = require("browserify");
var buffer = require("stream-buffer");
var createOPCStream = require("opc");
var createOPCParser = require("opc/parser");

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

module.exports = function(opcStream) {
  var currentPixelData = null;
  opcStream
    .pipe(createOPCParser())
    .on("data", function(message) {
      if (message.command === 0) {
        currentPixelData = message.data;
      }
    });
  var server = http.createServer(handler);
  createWebsocketServer({ server: server }, function(socket) {
    if (currentPixelData != null) {
      var newStream = createOPCStream();
      newStream.pipe(socket);
      newStream.writePixels(0, currentPixelData);
    }
    opcStream.pipe(socket);
    socket.on("close", function() {
      opcStream.unpipe(socket);
      if (newStream) {
        newStream.unpipe(socket);
      }
    });
  });
  return server;
};
