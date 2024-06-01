const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware para manejar cuerpos de solicitudes grandes
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/upload', (req, res) => {
    const frame = req.body.frame;
    if (frame) {
        // Emitir la imagen a través de WebSocket
        io.emit('frame', frame);
        res.status(200).send('File uploaded');
    } else {
        res.status(400).send('No file uploaded');
    }
});

io.on('connection', (socket) => {
    console.log('Client connected');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
