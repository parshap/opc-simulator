"use strict";

var createUI = require("./ui");
var websocket = require("reconnect-core")(require("websocket-stream/stream"));
var createParser = require("opc/parser");
var fs = require("fs");
var insertcss = require("insert-css");

insertcss(fs.readFileSync(__dirname + "/styles.css", "utf8"));
var simulator = createUI(global.document.body);
var parser = createParser();
parser.pipe(simulator);
websocket({}, function(stream) {
  stream.pipe(parser);
}).connect("ws://" + window.location.host + "/");
