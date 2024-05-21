// server.js

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

//const portName = '/dev/tty.usbmodem1101';
const portName = 'COM3';

// Serve static files
app.use(express.static(__dirname));

// Initialize serial port for Arduino communication
const arduinoPort = new SerialPort({path: portName, baudRate: 9600 });
const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\n' }));

// Handle connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle togglePump event
  socket.on('togglePump', ({ duration }) => {
    console.log(`Toggling Pump for ${duration} milliseconds`);
    arduinoPort.write('t'); // Send 't' to toggle the Pump
    // Turn off the Pump after the specified duration
    setTimeout(() => {
      arduinoPort.write('o'); // Send 'o' to turn off the Pump
    }, duration);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Log data received from Arduino
parser.on('data', (data) => {
  console.log('Data from Arduino:', data);
});
