const socket = io();

const ROOM_ID = "anil_room";
const USER = {
  id: Math.random().toString(36).slice(2),
  name: "painter-" + Math.floor(Math.random() * 1000),
  color: "#" + Math.floor(Math.random()*16777215).toString(16)
};

socket.emit("JOIN_ROOM", {
  roomId: ROOM_ID,
  user: USER
});

function send(event, payload) {
  socket.emit(event, payload);
}

function on(event, handler) {
  socket.on(event, handler);
}

window.ws = {
  socket,
  send,
  on,
  ROOM_ID,
  USER
};
