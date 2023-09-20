const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../chat.html'))
});

app.get('/login/:username/:password', (req, res) => {
  console.log(req.params.username);
  console.log(req.params.password);
  login(req.params.username, req.params.password);
});

io.on('connection', (socket) => {

  socket.on('login', (username, password) => {
    login(username, password);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

/* log in function */
function login(username, password) {
  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {    
    if (err) {
      console.error("Login query failed:", err.message);
    } else if (row) {
      console.log("Login successful:", row.username);
    } else {
      console.log("Login failed: incorrect username or password");
    }
  });
}

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});