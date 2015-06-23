"use strict";

var http = require("http");
var test = require("tape");
var getport = require("getport");
var createSimulator = require("./");
var createOPCStream = require("opc");
var createStrand = require("opc/strand");

var server, port;

test("create server", function(t) {
  server = createSimulator(function() {
    var strand = createStrand(8);
    var stream = createOPCStream();
    stream.writePixels(0, strand.buffer);
    return stream;
  });
  t.ok(server);
  t.end();
});

test("listen", function(t) {
  getport(function(err, p) {
    t.ifError(err);
    port = p;
    server.listen(port, t.end);
  });
});

test("request", function(t) {
  var req = http.request({
    port: port,
  });
  req.end();
  req.on("response", function(res) {
    var gotData = false;
    res.on("data", function() {
      gotData = true;
    });
    res.on("end", function() {
      t.ok(gotData);
      server.close(t.end);
    });
  });
});
