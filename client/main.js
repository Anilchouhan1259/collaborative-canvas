const strokes = [];
const users = [];
const remoteCursors = new Map(); 

ws.on("SYNC_STATE", ({ strokes: serverStrokes ,users:serverUsers}) => {
  strokes.length = 0;
  strokes.push(...serverStrokes);
  users.length=0;
  users.push(...serverUsers);
  renderUsers(users);
  redrawAll(strokes);
});

ws.on("USER_JOINED",(user)=>{
  console.log(user);
  users.push(user);
  renderUsers();
})

ws.on("USER_LEFT",(user)=>{
  const cursor = remoteCursors.get(user.id);
  if (cursor) {
    cursor.el.remove();
    remoteCursors.delete(user.id);
  }
  const index = users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users.splice(index, 1);
    renderUsers();
  }
})

ws.on("STROKE_COMMITTED", (stroke) => {
   const cursor = remoteCursors.get(stroke.userId);
  if (cursor) {
    cursor.drawing = false;
    cursor.el.style.display = "block";
  }
  const index = strokes.findIndex(s => s.id === stroke.id);
  if (index !== -1) {
    strokes[index] = stroke; 
  } else {
    strokes.push(stroke); 
  }
});

ws.on("STROKE_UPDATE", (strokeFragment) => {
  const socketId = strokeFragment.userId;

  const cursor = remoteCursors.get(socketId);
  if (cursor) {
    cursor.drawing = true;
    cursor.el.style.display = "none";
  }
   let stroke = strokes.find(s => s.id === strokeFragment.id);

  if (!stroke) {
    stroke = {...strokeFragment};
    strokes.push(stroke);
  }else{
    const len = stroke.points.length
    stroke.points.push(strokeFragment.points[len]);
  }
  drawSegment(stroke);
});

ws.on("UNDO_APPLIED", (strokeId) => {
  const index = strokes.findIndex(s => s.id === strokeId);
  if (index !== -1) {
    strokes.splice(index, 1);
    redrawAll(strokes);
  }
});

ws.on("REDO_APPLIED", (stroke) => {
  console.log(stroke);
  strokes.push(stroke);
  redrawAll(strokes);
});

ws.on("CURSOR_UPDATE", ({ socketId, cursor,userId }) => {
  if (socketId === ws.socket.id) return;
  let entry = remoteCursors.get(socketId);
  if (!entry) {
    const el = document.createElement("div");
    el.className = "cursor";

    const user = users.find(u => u.id === userId);
    el.style.backgroundColor = user?.color || "#000";

    document.getElementById("cursor-layer").appendChild(el);

    entry = { el, drawing: false };
    remoteCursors.set(socketId, entry);
  }

  if (!entry.drawing) {
    entry.el.style.left = cursor.x + "px";
    entry.el.style.top = cursor.y + "px";
    entry.el.style.display = "block";
  }
});
ws.on("CURSOR_HIDE", (socketId) => {
  const cursor = remoteCursors.get(socketId);
  if (cursor) cursor.el.style.display = "none";
});
