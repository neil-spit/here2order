// server.js

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

// Replace with your Arduino port name
//const portName = 'COM3';

// Serve static files
app.use(express.static(__dirname));

// Initialize serial port for Arduino communication
const arduinoPort = new SerialPort({ path: portName, baudRate: 9600 });
const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\n' }));

socket.on('togglePump', ({ fillerDuration, drainDuration }) => {
  console.log(`Filling tank for ${fillerDuration} milliseconds`);

  // Start the fill pump
  arduinoPort.write('t'); // Send 't' to start filling the tank
  setTimeout(() => {
    arduinoPort.write('o'); // Send 'o' to stop filling the tank
    console.log('Filling complete. Pausing for 15 seconds.');

    // Pause for 15 seconds
    setTimeout(() => {
      console.log(`Emptying tank for ${drainDuration} milliseconds`);

      // Start the drain pump
      arduinoPort.write('e'); // Send 'e' to start emptying the tank
      setTimeout(() => {
        arduinoPort.write('f'); // Send 'f' to stop emptying the tank
        console.log('Emptying complete.');

        // Hide thank you dialog after the emptying duration
        socket.emit('hideThankYouDialog');
      }, drainDuration);
    }, 15000);
  }, fillerDuration);
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
