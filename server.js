const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const rooms = {};

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('join', (room) => {
    if (!rooms[room]) {
      rooms[room] = [];
    }
    if (!rooms[room].includes(socket.id)) {
      rooms[room].push(socket.id);
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    }
  });

  socket.on('offer', (offer, room) => {
    socket.to(room).emit('offer', offer);
  });

  socket.on('answer', (answer, room) => {
    socket.to(room).emit('answer', answer);
  });

  socket.on('candidate', (candidate, room) => {
    socket.to(room).emit('candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
    for (const room in rooms) {
      rooms[room] = rooms[room].filter(id => id !== socket.id);
      if (rooms[room].length === 0) {
        delete rooms[room];
      }
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
