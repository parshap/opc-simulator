"use strict";

var createUI = require("./ui");
var shoe = require("reconnect-core")(require("shoe"));
var createParser = require("opc/parser");
var base64 = require("base64-stream");
var fs = require("fs");
var insertcss = require("insert-css");

insertcss(fs.readFileSync(__dirname + "/styles.css", "utf8"));
var simulator = createUI(global.document.body);
var parser = createParser();
parser.pipe(simulator);
shoe({}, function(stream) {
  stream.pipe(base64.decode()).pipe(parser);
}).connect("/opc");
