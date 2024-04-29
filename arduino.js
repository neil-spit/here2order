// arduino.js

const { Board, Led } = require('johnny-five');

// Initialize Arduino board
const board = new Board({port: '/dev/tty.usbmodem1301'});

// Initialize LED on pin 13
let led;
board.on('ready', () => {
  led = new Led(13);
  console.log('Arduino board ready');
});

// Listen for toggleLED event from server.js
process.on('message', (msg) => {
  if (msg === 'toggleLED' && led) {
    led.toggle();
  }
});
