# OPC Simulator

This module is an Open Pixel Control simulator that will read your Open
Pixel Control messages and serve a web page showing a real-time updating
representation of your pixels.

The binary OPC protocol input is streamed directly to the browser (via
*[shoe][]*) where it is parsed (by *[opc][opc module]*). *Set pixel
color* messages update the color of pixels shown in the UI, which is
rendered by *[React][]*.

This simulator can be used to test and debug your lighting effects and
animations without using actual hardware.

[shoe]: https://www.npmjs.com/package/shoe
[opc module]: https://npmjs.org/package/opc
[react]: http://facebook.github.io/react/

## Example

```js
var createSimulator = require("opc-simulator");
var createOPCStream = require("opc");
var createStrand = require("opc/strand");

var STRAND_LENGTH = 32;

var simulator = createSimulator(STRAND_LENGTH);
var stream = createOPCStream();
stream.pipe(simulator);

var strand = createStrand(STRAND_LENGTH);
for (var i = 0; i < strand.length; i++) {
  strand.setPixel(0, 255, 0, 0);
}
```

## TODO

 * Improve documentation
 * Improve simulation styling
 * Layouts (ring, matrix)
 * Offsets
 * Handle color correction messages
