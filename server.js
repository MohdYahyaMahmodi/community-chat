const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const MAX_MESSAGE_LENGTH = 500;
const MAX_USERNAME_LENGTH = 30;
const MAX_MESSAGES = 50;

let messages = [];
let users = {};

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/script.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'script.js'));
});

io.on('connection', (socket) => {
    const username = socket.handshake.query.username;

    if (!username || username.length > MAX_USERNAME_LENGTH) {
        socket.disconnect();
        return;
    }

    users[socket.id] = username;

    // Send the last 50 messages to the new user
    socket.emit('init', messages.slice(-MAX_MESSAGES), Object.values(users));
    io.emit('user joined', username, Object.values(users));

    socket.on('chat message', (msg) => {
        if (msg.length > MAX_MESSAGE_LENGTH) {
            return;
        }

        const messageData = {
            user: username,
            text: msg,
            timestamp: new Date().toISOString()
        };

        messages.push(messageData);

        // Keep only the last 50 messages
        if (messages.length > MAX_MESSAGES) {
            messages = messages.slice(-MAX_MESSAGES);
        }

        io.emit('chat message', messageData);
    });

    socket.on('disconnect', () => {
        const username = users[socket.id];
        delete users[socket.id];
        io.emit('user left', username, Object.values(users));
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});