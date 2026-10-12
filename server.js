const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Tampilkan file HTML/CSS/JS
app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    socket.on('chat message', (data) => socket.broadcast.emit('chat message', data));
    socket.on('typing', (nama) => socket.broadcast.emit('typing', nama));
    socket.on('stop typing', () => socket.broadcast.emit('stop typing'));
});

// Port untuk Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server nyala di port ${PORT}`);
});