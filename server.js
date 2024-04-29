// server.js

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

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
    console.log('Received checkout event from client');
    // Emit event to toggle LED or perform other actions
    io.emit('toggleLED');
  });

  // Handle disconnection
  socket.on('disconnect', function() {
    console.log('A client disconnected');
  });
});
