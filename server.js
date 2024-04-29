const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Serve static files from the root directory
app.use(express.static(__dirname));

// Route for the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// WebSocket connection
io.on('connection', function(socket) {
  console.log('A client connected');

  // Listen for checkout message from the client
  socket.on('checkout', function() {
    // Send a command to the Arduino
    // Example: Turn on an LED connected to pin 13
    board.digitalWrite(13, 1); // Turn on LED
    setTimeout(() => {
      board.digitalWrite(13, 0); // Turn off LED after 1 second
    }, 1000);
  });

  // Handle disconnection
  socket.on('disconnect', function() {
    console.log('A client disconnected');
  });
});
