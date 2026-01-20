const strokes = [];
const users = [];
ws.on("SYNC_STATE", ({ strokes: serverStrokes ,users:serverUsers}) => {
  strokes.length = 0;
  strokes.push(...serverStrokes);
  users.length=0;
  users.push(...serverUsers);
  renderUsers(users);
  redrawAll(strokes);
});
ws.on("USER_JOINED",(user)=>{
  users.push(user);
  renderUsers();
})
ws.on("USER_LEFT",(user)=>{
  const index = users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users.splice(index, 1);
    renderUsers();
  }
})
ws.on("STROKE_COMMITTED", (stroke) => {
   const index = strokes.findIndex(s => s.id === stroke.id);
  if (index !== -1) {
    strokes[index] = stroke; 
  } else {
    strokes.push(stroke); 
  }
});

ws.on("STROKE_UPDATE", (strokeFragment) => {
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
  strokes.push(stroke);
  redrawAll(strokes);
});
