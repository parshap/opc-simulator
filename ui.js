"use strict";

var React = require("react");
var el = React.createElement;
var through = require("through2");
var createStrand = require("opc/strand");

function rgb(color) {
  return "rgb(" + color.join(",") + ")";
}

var UI = React.createClass({
  render: function() {
    var children = [];
    var pixels = this.props.pixels;
    if (pixels) {
      var strand = createStrand(pixels.length / 3, pixels);
      for (var i = 0; i < strand.length; i++) {
        children.push(el(Pixel, {
          color: strand.getColor(i),
        }));
      }
    }
    return el("div", {
      children: children,
    });
  },
});

var Pixel = React.createClass({
  render: function() {
    return el("div", {
      style: {
        width: ".5rem",
        height: ".5rem",
        float: "left",
        background: rgb(this.props.color),
        border: "1px solid #666",
      },
    });
  },
});

module.exports = function(domEl) {
  var pixels = null;
  render();
  return through.obj(function(message, enc, callback) {
    if (message.command === 0) {
      // Set pixel colors
      pixels = message.data;
    }
    render();
    callback();
  });

  function render() {
    var reactEl = el(UI, {
      pixels: pixels,
    });
    React.render(reactEl, domEl);
  }
};
