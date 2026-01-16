const rooms = new Map();
function createRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      users: new Map()
    });
  }
  return rooms.get(roomId);
}

function getRoom(roomId) {
  return rooms.get(roomId);
}

function removeUserFromRoom(socketId) {
  for (const [roomId, room] of rooms.entries()) {
    if (room.users.has(socketId)) {
      const user = room.users.get(socketId);
      room.users.delete(socketId);

      // Cleanup empty room
      if (room.users.size === 0) {
        rooms.delete(roomId);
      }

      return { roomId, user };
    }
  }
  return {};
}

module.exports = {
  createRoom,
  getRoom,
  removeUserFromRoom
};
