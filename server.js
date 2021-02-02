const { userJoin, userLeave, getUsers } = require('./utils/users');

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const PORT = 8080;

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('joinRoom', ({ username }) => {
    const user = userJoin(socket.id, username);

    socket.emit('message', 'Welcome');

    socket.broadcast.emit('message', `${user.username} has joined the chat`);
  });

  socket.emit('roomUsers', getUsers());

  socket.on('disconnect', () => {
    console.log('A client has disconnected');
    const user = userLeave(socket.id);

    if (user) {
      io.emit('message', `${user.username} has left`);

      // Send users and room info
      io.emit('roomUsers', getUsers());
    }
  });
});

http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
