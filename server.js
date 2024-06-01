const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, 'public')));

// Servir archivos del directorio 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.single('frame'), (req, res) => {
  if (req.file) {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, 'uploads', `${Date.now()}-${req.file.originalname}`);

    fs.rename(tempPath, targetPath, err => {
      if (err) return res.status(500).send('Error al mover el archivo');

      // Emitir el nombre del archivo a través de WebSocket
      io.emit('frame', path.basename(targetPath));
      res.status(200).send('File uploaded');
    });
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
