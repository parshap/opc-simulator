"use strict";

var through = require("through2");
var http = require("http");
var createWebsocketServer = require("websocket-stream/server");
var browserify = require("browserify");
var buffer = require("stream-buffer");

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

module.exports = function(createEffectStream, options) {
  options = options || {};
  var server = http.createServer(handler);
  createWebsocketServer({ server: server }, function(stream) {
    createEffectStream().pipe(stream);
  });
  return server;
};
