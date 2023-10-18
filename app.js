const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');


const app = express();
const server = createServer(app);
const io = new Server(server);

app.use('/static', express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});


// server handle
const players = {}

io.on('connection', (socket) => {
    console.log('a user connected');
    players[socket.id] = {
        x:100 * Math.random(),
        y:100,
        name:(Math.random() + 1).toString(36).substring(7),
        vx:0,
        vy:0,
    }

io.emit('updatePlayers',players)

socket.on('disconnect', (reason) => { 
    delete players[socket.id]
    io.emit('updatePlayers',players)
    console.log(reason)
})

  });


  
server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});