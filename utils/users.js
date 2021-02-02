const users = [];

// Join user to chat
const userJoin = (id, username) => {
  const user = { id, username };

  users.push(user);

  return user;
};

// Get current user
const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

// User leaves chat
const userLeave = (id) => {
  console.log(id);
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// Get room users
const getUsers = () => {
  return users;
};

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getUsers,
};
