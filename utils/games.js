const { decider, IDGen } = require('./utils');

// playerData looks like this
// {
//   id: PlayerOneID,
//   username: PlayerOneName,
//   color: "white" // use color decider to get this
// }

const games = [];

function Game(playerOneData, playerTwoData, uniqueID) {
	this.id = uniqueID;
	this.playerOne = playerOneData;
	this.playerTwo = playerTwoData;
	this.turn = 'white';
	this.moves = [];
	this.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
	this.over = false;
	this.pending = true;
}
const getGame = (id) => {
	const game = games.find((game) => game.id === id);

	return game;
};

const getPendingGame = () => {
	const pendingGame = games.find((game) => game.pending);

	return pendingGame;
};

const joinPendingGame = (playerData, gameID) => {
	const game = games.find((game) => game.id === gameID);

	game.pending = false;
	game.playerTwo = playerData;
};

const createGame = (playerOneData, playerTwoData, uniqueID = IDGen()) => {
	const newGame = new Game(playerOneData, playerTwoData, uniqueID);

	games.push(newGame);
};

const updateGameDetails = (id, updatedFields) => {
	const game = getGame(id);
	if (!game) return;

	const updatedGame = { ...game, ...updatedFields };

	return updatedGame;
};

module.exports = {
	Game,
	getGame,
	updateGameDetails,
	createGame,
	getPendingGame,
	joinPendingGame,
};
