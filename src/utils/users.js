const users = [];

const addUser = ({ id, username, room }) => {
  usersname = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(user => {
    return user.room === room && user.username === username;
  });

  if (existingUser) {
    return {
      error: "Username is already in use"
    };
  }

  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = id => {
  const index = users.findIndex(i => {
    return i.id === id;
  });
  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = id => {
  const user = users.find(i => {
    return i.id === id;
  });

  if (user) return user;
  return undefined;
};

const getUsersInRoom = room => {
  const usersInRoom = users.filter(i => {
    return i.room === room;
  });

  return usersInRoom;
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
};
