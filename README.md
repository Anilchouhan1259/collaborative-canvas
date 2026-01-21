# 🎨 Collaborative Canvas

A real-time multi-user drawing application where multiple users can draw simultaneously on a shared canvas using Socket.IO.

Each user joins a common room and their drawing strokes are broadcast to all other connected clients instantly.  
The server maintains a global drawing state including undo/redo functionality.


##  Setup Instructions

This project works with:

```bash
npm install && npm start
```

### Steps:

1. Clone the repository:
```bash
git clone https://github.com/Anilchouhan1259/collaborative-canvas.git
cd collaborative-canvas
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open browser:
```
http://localhost:3000
```

---

## 👥 How to Test with Multiple Users

1. Open the application in two or more browser tabs.
2. Draw in one window → others update instantly.
3. Undo/Redo is global and affects all connected users.

You can also test using:
- Different browsers
- Different devices on the same network

---

## 🐞 Known Limitations / Bugs

- Single hardcoded room.
- No authentication.
- No reconnection recovery.


---

## 🧠 Tech Stack

- Frontend: HTML5 Canvas, Vanilla JS
- Backend: Node.js, Express
- Real-Time: Socket.IO

## ⏿ Live Link 

https://collaborative-canvas-hcca.onrender.com/