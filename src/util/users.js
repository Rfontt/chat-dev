const users = [];

function UserJoin(id, codName, room) {
  const user = { id, codName, room };

  users.push(user);

  return user;
}

function GetCurrentUser(id) {
  return users.find(user => user.id === id);
}

function GetRoomUsers(room) {
  return users.filter(user => user.room === room);
}

function LeaveChat(id) {
  const index = users.findIndex(user => user.id === id);

  if(index != -1) {
    return users.splice(index, 1)[0];
  }
}

module.exports = {
  UserJoin,
  GetCurrentUser,
  GetRoomUsers,
  LeaveChat
 };
