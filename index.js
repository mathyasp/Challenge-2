const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Nicknames map
const nicknames = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('set nickname', (nickname) => {
    nicknames[socket.id] = nickname;
    io.emit('chat message', `${nickname} has connected`);
  });

  socket.on('chat message', (msg) => {
    const nickname = nicknames[socket.id] || 'Anonymous';
    io.emit('chat message', `${nickname}: ${msg}`);
  });

  socket.on('disconnect', () => {
    const nickname = nicknames[socket.id] || 'Anonymous';
    io.emit('chat message', `${nickname} has disconnected`);
    delete nicknames[socket.id];
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});