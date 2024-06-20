const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const nicknames = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('set nickname', (nickname) => {
    nicknames[socket.id] = nickname;
    socket.broadcast.emit('chat message', `${nickname} has connected`);
  });

  socket.on('chat message', (data) => {
    const nickname = nicknames[socket.id] || data.nickname || 'Anonymous';
    socket.broadcast.emit('chat message', `${nickname}: ${data.message}`);
  });

  socket.on('disconnect', () => {
    const nickname = nicknames[socket.id] || 'Anonymous';
    socket.broadcast.emit('chat message', `${nickname} has disconnected`);
    delete nicknames[socket.id];
  });

  socket.on('typing', (nickname) => {
    socket.broadcast.emit('typing', nickname);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});