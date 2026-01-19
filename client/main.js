const strokes = [];
ws.on("SYNC_STATE", ({ strokes: serverStrokes }) => {
  strokes.length = 0;
  strokes.push(...serverStrokes);
  redrawAll(strokes);
});

ws.on("STROKE_COMMITTED", (stroke) => {
   const index = strokes.findIndex(s => s.id === stroke.id);

  if (index !== -1) {
    strokes[index] = stroke; // ✅ replace temp stroke
  } else {
    strokes.push(stroke); // fallback
  }

  redrawAll(strokes);
});

ws.on("STROKE_UPDATE", (strokeFragment) => {
   let stroke = strokes.find(s => s.id === strokeFragment.id);

  if (!stroke) {
    stroke = {...strokeFragment};
    strokes.push(stroke);
  }else{
    // console.log(stroke.points,"local stroke point");
    // console.log(strokeFragment.points,"server stroke fragment");
    const len = stroke.points.length
    // console.log(strokeFragment.points[len-1],"current point");
    stroke.points.push(strokeFragment.points[len-1]);
  }
  

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
