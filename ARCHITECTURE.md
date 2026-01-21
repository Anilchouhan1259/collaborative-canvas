# 🏗 Architecture – Collaborative Canvas

---

## 1. High-Level System

```
Browser (Canvas UI)
        |
        | WebSocket (Socket.IO)
        v
 Node.js Server (Express + Socket.IO)
```

---

## 2. Data Flow Diagram

```
User draws
   |
Client captures stroke
   |
socket.emit("DRAW_STROKE")
   |
Server stores + broadcasts
   |
Clients render stroke
```

Undo / Redo:
```
Client → UNDO → Server → Update → Clients redraw
Client → REDO → Server → Update → Clients redraw
```

## 4. Undo/Redo Strategy

Each room has:
```
strokes = []
undoStack = []
```

- Draw → push to strokes, clear undoStack  
- Undo → move last stroke to undoStack  
- Redo → restore stroke  

Undo/Redo is global.

---
