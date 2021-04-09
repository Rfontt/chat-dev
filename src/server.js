const path = require('path');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server);
const FormatMessage = require('./util/message');
const { UserJoin, GetCurrentUser, GetRoomUsers, LeaveChat } = require('./util/users');

const PORT = 3000 || process.env.PORT;
const botName = 'Chat-dev';

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
  socket.on('joinRoom', ({ codName, room }) => {
    const user = UserJoin(socket.id, codName, room);
    socket.join(user.room);

    socket.emit('message', FormatMessage(botName, 'Welcome, friend.'));
    socket.broadcast.to(user.room).emit('message', FormatMessage(botName,  `${user.codName} has joined the chat.`));

    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: GetRoomUsers(user.room)
    })
  });

  socket.on('chatMessage', message => {
    const userCurrent = GetCurrentUser(socket.id);

    io.to(userCurrent.room).emit('message', FormatMessage(userCurrent.codName, message));
  })

  socket.on('disconnect', () => {
    const user = LeaveChat(socket.id);

    io.to(user.room).emit('message', FormatMessage(botName, `${user.codName} disconnected`));
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: GetRoomUsers(user.room)
    })
  })
})

server.listen(PORT);
