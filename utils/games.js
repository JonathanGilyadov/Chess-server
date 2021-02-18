const { IDGEN, decider } = require('./utils');

const games = [];

function Game(
  PlayerOneID,
  PlayerOneName,
  PlayerTwoID,
  PlayerTwoName,
  uniqueID = IDGEN()
) {
  const colorDecider = decider();

  this.id = uniqueID;
  this.playerOne = {
    name: PlayerOneName,
    id: PlayerOneID,
    color: colorDecider && true,
  };
  this.playerTwo = {
    name: PlayerTwoName,
    id: PlayerTwoID,
    color: colorDecider && false,
  };
  this.turn = 'white';
  this.moves = [];
  this.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  this.over = false;
}

const inputGame = (game) => games.push(game);

const getGame = (id) => {
  const game = games.find((game) => game.id === id);

  return game;
};

const updateGame = (id, updatedFields) => {
  const game = getGame(id);
  if (!game) return;

  const updatedGame = { ...game, ...updatedFields };

  return updatedGame;
};

module.exports = {
  Game,
  inputGame,
  getGame,
  updateGame,
};
