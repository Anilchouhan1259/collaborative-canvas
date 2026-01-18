const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const { createRoom, getRoom, removeUserFromRoom } = require("./rooms");
const {
  addStroke,
  getStrokes,
  undo,
  redo
} = require("./drawing_state");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("JOIN_ROOM", ({ roomId, user }) => {
    socket.join(roomId);

    const room = createRoom(roomId);
    room.users.set(socket.id, user);

    socket.emit("SYNC_STATE", {
      strokes: getStrokes(roomId),
      users: Array.from(room.users.values())
    });
    socket.to(roomId).emit("USER_JOINED", user);
  });

  socket.on("DRAW_UPDATE", ({ roomId, strokeFragment }) => {
    socket.to(roomId).emit("STROKE_UPDATE", strokeFragment);
  });

  socket.on("DRAW_END", ({ roomId, stroke }) => {
    addStroke(roomId, stroke);
    io.to(roomId).emit("STROKE_COMMITTED", stroke);
  });

  socket.on("UNDO", ({ roomId }) => {
    console.log("UNDO clicked");
    const removedStroke = undo(roomId);
    if (removedStroke) {
      io.to(roomId).emit("UNDO_APPLIED", removedStroke.id);
    }
  });

  socket.on("REDO", ({ roomId }) => {
    const restoredStroke = redo(roomId);
    if (restoredStroke) {
      io.to(roomId).emit("REDO_APPLIED", restoredStroke);
    }
  });

  socket.on("CURSOR_MOVE", ({ roomId, cursor }) => {
    socket.to(roomId).emit("CURSOR_UPDATE", {
      socketId: socket.id,
      cursor
    });
  });

  socket.on("disconnect", () => {
    const { roomId, user } = removeUserFromRoom(socket.id);
    if (roomId && user) {
      socket.to(roomId).emit("USER_LEFT", user);
    }
    console.log("User disconnected:", socket.id);
  });
});
app.use(
  express.static(
    path.join(__dirname, "../client")
  )
);
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
