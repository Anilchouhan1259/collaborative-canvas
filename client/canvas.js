 const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');

        const colorPicker = document.getElementById('colorPicker');
        const brushSize = document.getElementById('brushSize');
        const sizeValue = document.getElementById('sizeValue');
        const brushBtn = document.getElementById('brushBtn');
        const eraserBtn = document.getElementById('eraserBtn');
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');


        let stokeWidth = brushSize.value;     
        sizeValue.textContent = stokeWidth;      

      
        let isDrawing = false;
        let currentStroke = null;
        let currentTool = 'brush';
        let currentColor = '#000000';
       
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', drawing);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        
        canvas.addEventListener("pointermove", (e) => {
        if (isDrawing) return;
        const cursor = {
            x: e.clientX,
            y: e.clientY
        };
        ws.send("CURSOR_MOVE", {
            roomId: ws.ROOM_ID,
            userId: ws.USER.id,
            cursor
        });
        });
        canvas.addEventListener("mouseleave", () => {
        ws.send("CURSOR_HIDE", { roomId: ws.ROOM_ID });
        });
        colorPicker.addEventListener('change', (e) => {
            
            if (currentTool === 'brush') {
                currentColor=e.target.value;
            }
        });
        brushSize.addEventListener("input", (e) => {
            stokeWidth = e.target.value;         
            sizeValue.textContent = stokeWidth;    
        });
        brushBtn.addEventListener('click', () => {
            currentTool = 'brush';
            brushBtn.classList.add('active');
            eraserBtn.classList.remove('active');
        });

        eraserBtn.addEventListener('click', () => {
            currentTool = 'eraser';
            ctx.strokeStyle = '#ffffff';
            eraserBtn.classList.add('active');
            brushBtn.classList.remove('active');
        });

        undoBtn.addEventListener('click', undo);
        redoBtn.addEventListener('click', redo);

        function redrawAll(strokes) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            strokes.forEach(s => drawFullStroke(s));
            }
        function renderUsers(){
            usersList.innerHTML = "";
            users.forEach(user => {
            const li = document.createElement("li");
            li.textContent = user.name;
            li.style.color = user.color;
            usersList.appendChild(li);
            });
        }  
        function drawFullStroke(stroke) {
        if (!stroke || stroke.points.length < 2) return;

        ctx.strokeStyle = stroke.tool === "eraser" ? "#fff" : stroke.color;
        ctx.lineWidth = stroke.width;

        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        stroke.points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.stroke();
        }  
        function startDrawing(e) {
            isDrawing = true;
            ws.send("CURSOR_HIDE", { roomId: ws.ROOM_ID });;
            const rect = canvas.getBoundingClientRect();
            currentStroke = {
            id: crypto.randomUUID(),
            userId: ws.USER.id,
            color: currentColor,
            width: stokeWidth,
            tool: currentTool,
            points: [{ x:e.clientX - rect.left, y: e.clientY - rect.top, t: Date.now() }]
        };
        }
        function drawing(e){
            if (!isDrawing || !currentStroke) return;
            const rect = canvas.getBoundingClientRect();
            const point = {x:e.clientX - rect.left,y:e.clientY - rect.top};
            currentStroke.points.push(point);
            drawSegment(currentStroke);
            ws.send("DRAW_UPDATE", {
                roomId: ws.ROOM_ID,
                strokeFragment: {
                currentStroke
                }
            });
        }
        function drawSegment(stroke) {
            const len = stroke.points.length;
            if (len < 2) return;

            const p1 = stroke.points[len - 2];
            const p2 = stroke.points[len - 1];
            ctx.strokeStyle = stroke.tool === "eraser" ? "#fff" : stroke.color;
            ctx.lineWidth = stroke.width;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }
        function stopDrawing() {
            if (!isDrawing || !currentStroke) return;
            isDrawing = false;
            ws.send("DRAW_END", {
                roomId: ws.ROOM_ID,
                stroke: currentStroke
            });
            currentStroke = null;
        }
        function undo() {
        socket.emit("UNDO", {
            roomId: ws.ROOM_ID,
        });
        }
        function redo(){
            socket.emit("REDO",{
                roomId: ws.ROOM_ID,
            });
        }