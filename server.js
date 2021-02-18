const { Game, inputGame, getGame } = require('./utils/games');
const {
  userJoin,
  userLeave,
  getUsers,
  updateInGameStatus,
  getLookingToPlayUser,
  getCurrentUser,
} = require('./utils/users');
const { IDGen } = require('./utils/utils');

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

  socket.on('message', ({ value, id }) => {
    io.to(id).emit('chatMessage', value);
  });

  socket.on('lookingToPlay', ({ username }) => {
    const userLookingToPlay = getLookingToPlayUser();
    const roomID = IDGen();

    if (!userLookingToPlay) {
      updateInGameStatus(socket.id, 'LOOKING_TO_PLAY');

      socket.emit('statusSearch', { status: 'LOOKING_FOR_GAME' });
      socket.join(roomID);
    } else {
      const game = new Game(
        socket.id,
        username,
        userLookingToPlay.id,
        userLookingToPlay.username,
        roomID
      );
      inputGame(game);
      socket.join(roomID);
      socket.emit('statusSearch', { status: 'FOUND_GAME', game });
      socket
        .to(userLookingToPlay.id)
        .emit('statusSearch', { status: 'FOUND_GAME', game });
    }
  });

  socket.on('move', ({ id, fen, move }) => {
    const game = getGame(id);
    console.log(game);
    game.moves.push(move);
    game.fen = fen;
    game.turn = game.turn === 'white' ? 'black' : 'white';
    io.to(id).emit('chatMessage', 'A move was played');
  });

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
