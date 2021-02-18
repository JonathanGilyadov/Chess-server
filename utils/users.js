const users = [];

// Join user to chat
const userJoin = (id, username) => {
  const user = { id, username, inGame: false };

  users.push(user);

  return user;
};

// Get current user
const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

// User leaves chat
const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// Get room users
const getUsers = () => {
  return users;
};

// Get user looking to play
const getLookingToPlayUsers = () => {
  return users.filter((user) => user.inGame === 'LOOKING_TO_PLAY');
};

const getLookingToPlayUser = () => {
  return users.find((user) => user.inGame === 'LOOKING_TO_PLAY');
};

const updateInGameStatus = (id, inGame) => {
  const user = users.find((user) => user.id === id);

  if (!user) return;

  if (inGame !== 'LOOKING_TO_PLAY' && inGame !== false && inGame !== true)
    return { success: false, err: 'Param inGame is not acceptable' };

  user.inGame = inGame;
  return { success: true, err: 'Status changed successfully' };
};

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getUsers,
  getLookingToPlayUser,
  getLookingToPlayUsers,
  updateInGameStatus,
};
