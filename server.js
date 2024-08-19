const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const debug = require('debug')('chat:server');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const MAX_MESSAGE_LENGTH = 500;
const MAX_USERNAME_LENGTH = 30;
const MAX_MESSAGES = 50;

let messages = [];
let users = {};
let typingUsers = new Set();

const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98FB98', 
    '#DDA0DD', '#40E0D0', '#FF69B4', '#BA55D3', '#FF7F50',
    '#20B2AA', '#FFA500', '#7B68EE', '#00FA9A', '#FF1493',
    '#1E90FF', '#FFD700', '#32CD32', '#FF4500', '#9370DB',
    '#00CED1', '#FF6347', '#8A2BE2', '#00FF7F', '#DC143C',
    '#4682B4', '#FF69B4', '#228B22', '#FF8C00', '#9932CC'
];

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function formatMessage(message) {
    return message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>');
}

function replaceEmojis(message) {
    const emojiMap = {
        ':)': '😊', ':(': '😢', ':D': '😃', ';)': '😉', ':P': '😛', '<3': '❤️'
    };
    return message.replace(/:\)|:\(|:D|;\)|:P|<3/g, match => emojiMap[match] || match);
}

app.get('/', (req, res) => {
    debug('Serving index.html');
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/script.js', (req, res) => {
    debug('Serving script.js');
    res.sendFile(path.join(__dirname, 'script.js'));
});

io.on('connection', (socket) => {
  let username = socket.handshake.query.username;
  debug(`New connection attempt: ${username}`);

  if (!username || username.length > MAX_USERNAME_LENGTH) {
      debug(`Invalid username: ${username}. Disconnecting.`);
      socket.disconnect();
      return;
  }

  users[socket.id] = { name: username, color: getRandomColor() };
  debug(`User connected: ${username} (${socket.id})`);

  const lastMessages = messages.slice(-MAX_MESSAGES).map(msg => ({
      ...msg,
      reactions: Object.fromEntries(
          Object.entries(msg.reactions).map(([reaction, users]) => [reaction, Array.from(users)])
      )
  }));
  
  socket.emit('init', lastMessages, Object.values(users));
  io.emit('user joined', users[socket.id], Object.values(users));
  io.emit('user count', Object.keys(users).length);
  debug(`Sent init data to ${username}. Current user count: ${Object.keys(users).length}`);

    socket.on('chat message', (msg) => {
        debug(`Received message from ${username}: ${msg}`);
        if (msg.length > MAX_MESSAGE_LENGTH) {
            debug(`Message too long (${msg.length} chars). Ignoring.`);
            return;
        }

        if (msg.startsWith('/nick ')) {
            const newNickname = msg.slice(6).trim();
            if (newNickname && newNickname.length <= MAX_USERNAME_LENGTH) {
                const oldNickname = users[socket.id].name;
                users[socket.id].name = newNickname;
                io.emit('user renamed', oldNickname, users[socket.id]);
                io.emit('user count', Object.keys(users).length);
                debug(`User ${oldNickname} renamed to ${newNickname}`);
            }
            return;
        }

        if (msg === '/clear') {
            socket.emit('clear chat');
            debug(`${username} cleared their chat`);
            return;
        }

        if (msg === '/color') {
            const newColor = getRandomColor();
            users[socket.id].color = newColor;
            io.emit('user color changed', users[socket.id]);
            debug(`${username} changed color to ${newColor}`);
            return;
        }

        const formattedMsg = formatMessage(replaceEmojis(msg));

        const messageData = {
            id: Date.now(),
            user: users[socket.id],
            text: formattedMsg,
            timestamp: new Date().toISOString(),
            reactions: {}
        };

        messages.push(messageData);
        if (messages.length > MAX_MESSAGES) messages = messages.slice(-MAX_MESSAGES);
        io.emit('chat message', messageData);
        debug(`Broadcasted message: ${messageData.id}`);
    });

    socket.on('typing', () => {
        debug(`${username} is typing`);
        typingUsers.add(username);
        socket.broadcast.emit('user typing', Array.from(typingUsers));
    });

    socket.on('stop typing', () => {
        debug(`${username} stopped typing`);
        typingUsers.delete(username);
        socket.broadcast.emit('user typing', Array.from(typingUsers));
    });

    socket.on('message reaction', (messageId, reaction) => {
        debug(`Reaction from ${username}: ${reaction} on message ${messageId}`);
        const message = messages.find(msg => msg.id === messageId);
        if (message) {
            if (!message.reactions[reaction]) {
                message.reactions[reaction] = new Set();
            }
            
            if (message.reactions[reaction].has(username)) {
                message.reactions[reaction].delete(username);
                debug(`Removed reaction ${reaction} from ${username} on message ${messageId}`);
            } else {
                message.reactions[reaction].add(username);
                debug(`Added reaction ${reaction} from ${username} on message ${messageId}`);
            }

            const updatedReactions = Object.fromEntries(
                Object.entries(message.reactions).map(([key, value]) => [key, Array.from(value)])
            );

            io.emit('message reaction', messageId, updatedReactions);
            debug(`Broadcasted updated reactions for message ${messageId}`);
        } else {
            debug(`Message ${messageId} not found for reaction`);
        }
    });

    socket.on('disconnect', () => {
        const username = users[socket.id].name;
        debug(`User disconnected: ${username} (${socket.id})`);
        delete users[socket.id];
        typingUsers.delete(username);
        io.emit('user left', username, Object.values(users));
        io.emit('user count', Object.keys(users).length);
        io.emit('user typing', Array.from(typingUsers));
        debug(`Updated user list and typing status after ${username} disconnected`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    debug(`Server running on port ${PORT}`);
});