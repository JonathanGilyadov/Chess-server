const {
	Game,
	inputGame,
	getGame,
	createGame,
	getPendingGame,
	joinPendingGame,
} = require('./utils/games');
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
		// Checking to see if there are any pending games
		const pendingGame = getPendingGame();

		// Defining user player data here for shorter code
		const id = socket.id;
		const thisPlayerData = {
			username,
			id,
		};

		// Either joining or creating a game
		if (!pendingGame) {
			// Creating room id here so socket can join it later
			const roomID = IDGen();

			// Updating user status
			updateInGameStatus(id, 'IN_QUEUE', roomID);
			createGame(thisPlayerData, null, roomID);

			// Sending status back to the client
			socket.emit('statusSearch', { status: 'LOOKING_FOR_GAME' });

			// Joinig the room
			socket.join(roomID);
		} else {
			// Getting game id
			const gameID = pendingGame.id;

			// Joining pending game
			// State wise
			joinPendingGame(thisPlayerData, gameID);
			// Socket wise
			socket.join(gameID);

			// Sending status back to the client
			socket.emit('statusSearch', {
				status: 'FOUND_GAME',
				game: pendingGame,
				message: 'this game from a direct emit',
			});

			// Sending status to the other client who created the game
			socket.to(gameID).emit('statusSearch', {
				status: 'FOUND_GAME',
				game: pendingGame,
				message: 'this game from room emit',
			});
		}
	});

	socket.on('move', ({ id, fen, move }) => {
		const game = getGame(id);
		console.log(game);
		game.moves.push(move);
		game.fen = fen;
		game.turn = game.turn === 'white' ? 'black' : 'white';

		const message = 'A move as been played';

		io.to(id).emit('chatMessage', { message, move, fen });
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
