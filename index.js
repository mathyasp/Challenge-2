const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  // Broadcast when a user connects
  socket.broadcast.emit('chat message', 'A user has connected');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // Broadcast when a user disconnects
  socket.on('disconnect', () => {
    io.emit('chat message', 'A user has disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});