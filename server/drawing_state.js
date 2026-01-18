const drawingState = new Map();
function initRoom(roomId) {
  if (!drawingState.has(roomId)) {
    drawingState.set(roomId, {
      strokes: [],
      undoStack: [],
      redoStack: []
    });
  }
  return drawingState.get(roomId);
}
function addStroke(roomId, stroke) {
  const state = initRoom(roomId);
  state.strokes.push(stroke);
  state.redoStack = []; 
}

function getStrokes(roomId) {
  const state = initRoom(roomId);
  console.log("called");
  return state.strokes;
}

function undo(roomId) {
  const state = initRoom(roomId);
  if (state.strokes.length === 0) return null;

  const stroke = state.strokes.pop();
  console.log(state.strokes.length);
  state.undoStack.push(stroke);
  return stroke;
}

function redo(roomId) {
  const state = initRoom(roomId);
  if (state.undoStack.length === 0) return null;

  const stroke = state.undoStack.pop();
  state.strokes.push(stroke);
  return stroke;
}

module.exports = {
  addStroke,
  getStrokes,
  undo,
  redo
};
