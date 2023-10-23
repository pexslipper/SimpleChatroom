const express = require('express');
const { createServer } = require('node:http');
const { platform } = require('node:os');
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
const gravity = 0.5
const platforms = [
  {X:50,Y:200,width:150},
  {X:250,Y:150,width:150},
  {X:1050,Y:300,width:150},
  {X:450,Y:175,width:150},
  {X:730,Y:350,width:150},
  {X:350,Y:380,width:150},
  {X:1100,Y:400,width:150},
]

io.on('connection', (socket) => {
    players[socket.id] = {
        x:100 * Math.random(),
        y:100,
        name:(Math.random() + 1).toString(36).substring(7),
        vx:0,
        vy:0,
    }
  io.emit('updatePlayers',players)
  io.emit('platform', platforms)


socket.on('updatePlayersmovement', (key) => { 
  
  switch (key) {
    // W up
    case 'pressup':
      players[socket.id].vy = -10
      io.emit('updatePlayers', players)
      break
    // release W up
    case 'releaseup':
      players[socket.id].vy = 0
      io.emit('updatePlayers', players)
      break
    
    // S down
    case 'down':
      players[socket.id].y = players[socket.id].y + 10
      io.emit('updatePlayers', players)
      break

    // A left
    case 'left':
      players[socket.id].vx = -2
      io.emit('updatePlayers', players)
      break
    // release A left
    case 'releaseleft':
      players[socket.id].vx = 0
      io.emit('updatePlayers', players)
      break

    // D right  
    case 'right':
      players[socket.id].vx = +2
      io.emit('updatePlayers', players)
      break
    // release D left
    case 'releaseright':
      players[socket.id].vx = 0
      io.emit('updatePlayers', players)
      break

  }
  // const newpos = players[socket.id].y + msg
  // players[socket.id].y = newpos
  // console.log(newpos)
  // io.emit('updatePlayers',players)
  // io.emit('message', {message:msg.message , id:msg.id});
})


socket.on('message', (msg) => { 
  io.emit('message', {message:msg.message , id:msg.id});
})

socket.on('disconnect', (reason) => { 
  delete players[socket.id]
  io.emit('updatePlayers',players)
})


// const platforms = [
//   {
//     positionX: 1250 - 1200,
//     positionY: 200
//   },
//   {
//     positionX: 1250 - 1000,
//     positionY: 150
//   },
//   {
//     positionX: 1250 - 200,
//     positionY: 300
//   },
//   {
//     positionX: 1250 - 800,
//     positionY: 175
//   },
//   {
//     positionX: 1250 - 520,
//     positionY: 350
//   },
//   {
//     positionX: 1250 - 900,
//     positionY: 380
//   },
//   {
//     positionX: 1250 - 150,
//     positionY: 400
//   },
// ]

setInterval(() => {
  
  
  for(const id in players){

    players[id].y += players[id].vy
    players[id].x += players[id].vx

    if(players[id].y + 60 <= 500 )
    {
      players[id].vy += gravity
    } else {
      players[id].y = 441
    }  

    if(players[id].x <= 1)
    {
      players[id].x = 0
    } else if(players[id].x+30 >= 1249)
    {
      players[id].x = 1220
    }

        platforms.forEach(platform => {
    if(
        players[id].y + 60 <= platform.Y && 
        players[id].y + 60 + players[id].vy >= platform.Y &&
        players[id].x + 30 >= platform.X && 
        players[id].x <= platform.X + platform.width
        ){
            players[id].vy = 0 
        }
})


  }


  // Emit the updated position to all connected clients
  io.emit('updatePlayers',players)
}, 1000/60); // Update approximately 30 times per second


  });


  
server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});