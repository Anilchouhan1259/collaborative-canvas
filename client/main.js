const strokes = [];
ws.on("SYNC_STATE", ({ strokes: serverStrokes }) => {
  strokes.length = 0;
  strokes.push(...serverStrokes);
  redrawAll(strokes);
});

ws.on("STROKE_COMMITTED", (stroke) => {
  strokes.push(stroke);
  redrawAll(strokes);
});

ws.on("STROKE_UPDATE", ({ id, point }) => {
  let stroke = strokes.find(s => s.id === id);
  if (!stroke )return;
  stroke.points.push(point);
  redrawAll(strokes);
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
