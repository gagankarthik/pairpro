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
  console.log('A user connected', socket.id);

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
    if (rooms[room]) {
      socket.to(room).emit('offer', offer);
    } else {
      console.error(`Room ${room} does not exist`);
    }
  });

  socket.on('answer', (answer, room) => {
    if (rooms[room]) {
      socket.to(room).emit('answer', answer);
    } else {
      console.error(`Room ${room} does not exist`);
    }
  });

  socket.on('candidate', (candidate, room) => {
    if (rooms[room]) {
      socket.to(room).emit('candidate', candidate);
    } else {
      console.error(`Room ${room} does not exist`);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
    for (const room in rooms) {
      rooms[room] = rooms[room].filter(id => id !== socket.id);
      if (rooms[room].length === 0) {
        delete rooms[room];
        console.log(`Room ${room} deleted as it is empty`);
      }
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Listening on *:${PORT}`);
});
