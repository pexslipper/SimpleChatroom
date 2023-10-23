const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

// Create a new Image object
const image = new Image();

// Set the source of the image
image.src = 'static/platform.png';
// When the image is loaded, draw it onto the canvas

//handle connect to server
const socket = io();
const players = {}
socket.on('updatePlayers',(playersinserver) => {
    //add new player
    for(const id in playersinserver){
        const playerinserver = playersinserver[id]

        if (!players[id]){
            players[id] = new Player (playerinserver.x,playerinserver.y,playerinserver.name,playerinserver.vx,playerinserver.vy,image)
        }   else{
            players[id].position.y = playersinserver[id].y
            players[id].position.x = playersinserver[id].x
            players[id].velocity.y = playersinserver[id].vy
            players[id].velocity.x = playersinserver[id].vx

        }
    }

    //delete disconnect player
    for(const id in players){
        if (!playersinserver[id]){
            delete players[id]
        }
    }


})

socket.on('platform',(platform) => {
    //add new player
    platform.forEach(data => {
        platforms.push(new Platform(data.X,data.Y,image))
    })
})


canvas.width = 1250
canvas.height = 500

const gravity = 0.5
class Player {
    constructor(x, y , name,vx,vy,image) {
        this.position = { x, y }
        this.name = name

        this.width = 30
        this.height = 60
        this.messagestatus = false
        this.message = ''
        this.velocity = 
        {
            x:vx,
            y:vy
        }
        this.image = image
    }

    draw(){
        // c.fillStyle = "#09f";        
        // set composite mode        
        // draw image      
        // c.drawImage(this.image, this.position.x,this.position.y-12,45,90); // Draw the image at coordinates (0, 0)
        

        c.fillStyle = 'black'            
        c.fillRect(this.position.x,this.position.y,this.width,this.height) 
        c.fillStyle = 'white'
        //name here
        c.fillText(this.name, this.position.x, this.position.y - 8)

        // c.fillText("X:"+this.position.x, this.position.x+35, this.position.y)
        // c.fillText("Y:"+`${this.position.y+this.height}`, this.position.x+35, this.position.y+10);
        // c.fillText("VY:"+this.velocity.y, this.position.x+35, this.position.y+20);

    }  

    update(){
        this.draw()
        // this.position.y += this.velocity.y
        // this.position.x += this.velocity.x

        // if(this.position.y + this.height + this.velocity.y <= canvas.height )
        // {
        //     this.velocity.y += gravity
        // } else {
        //     this.velocity.y = 0
        // }
    }

    drawSpeechRectangle(text) {
        const padding = 10; // Padding around the text
        const textWidth = c.measureText(text).width;
        const rectWidth = textWidth + 2 * padding;
        const rectHeight = 30; // You can adjust the height as needed
    
        // Draw the speech rectangle
        c.fillStyle = 'white'; // Background color
        c.strokeStyle = 'black'; // Border color
        c.lineWidth = 2; // Border width
        c.beginPath();
        c.rect(this.position.x + 20, this.position.y - 40, rectWidth, rectHeight);
        c.fill();
        c.stroke();
        
        // Draw the text
        c.fillStyle = 'black'; // Text color
        c.fillText(text, this.position.x + 20 + padding, this.position.y - 40 + rectHeight / 2 + 5); // You may need to adjust the Y position
    }
    
}
class Platform{
    constructor(x,y,img){
        this.position = { x, y }

        this.width = 150    
        this.height = 30
        this.img = img
    }

    draw(){
        c.drawImage(this.img, this.position.x-15,this.position.y-58,180,200); // Draw the image at coordinates (0, 0)
        // c.fillStyle = 'green'
        // c.fillRect(this.position.x,this.position.y,this.width,this.height)  
        // c.fillText("X:"+this.position.x, this.position.x, this.position.y);
        // c.fillText("Y:"+this.position.y, this.position.x+150, this.position.y);
    }

}

const platforms = [
]


const moving = {
    left : {
        press : false
    },
    right : {
        press : false
    },
    up : {
        press : false
    },
    down : {
        press : false
    },

}
const message = {
    show : false
    }

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width,canvas.height)

    for(const id in players){
        const newplayer = players[id]
        newplayer.update()
    }

    platforms.forEach(platform => {
        platform.draw()
    })
    //handle moving and scroll background
    // if(players[socket.id]){
    // if (moving.left.press && 
    //     players[socket.id].position.x > 0 && not_typing.status)
    //     {
    //     players[socket.id].velocity.x = -5
    // } else if (moving.right.press &&
    //     players[socket.id].position.x + players[socket.id].width < 1690 && not_typing.status) {
    //     players[socket.id].velocity.x = 5
    // } else {
    //     players[socket.id].velocity.x = 0
    // }

    //handle message
    for(const id in players){
        const newplayer = players[id]
        if(newplayer.messageShow){
            newplayer.drawSpeechRectangle(newplayer.message)
        }
    }

    
//     // handle platform
//     platforms.forEach(platform => {
//     if(
//         players[socket.id].position.y + players[socket.id].height <= platform.position.y && 
//         players[socket.id].position.y + players[socket.id].height + players[socket.id].velocity.y >= platform.position.y &&
//         players[socket.id].position.x + players[socket.id].width >= platform.position.x && 
//         players[socket.id].position.x <= platform.position.x + platform.width
//         ){
//             players[socket.id].velocity.y = 0 
//         }
// })

//     // handle reset player position
//     if (players[socket.id].position.y + players[socket.id].height >= 520)
//     {
//         players[socket.id].position.x =100
//         players[socket.id].position.y =100
//     }
// }

}

animate()

addEventListener('keydown', ({keyCode}) => {
    switch(keyCode){
        // W up
        case 87:
            if(not_typing.status){
            socket.emit('updatePlayersmovement','pressup')
            }
            break
        // S down
        case 83:
            if(not_typing.status){
            socket.emit('updatePlayersmovement','down')
            }
            break

        // A left
        case 65:
            if(not_typing.status){
            socket.emit('updatePlayersmovement','left')
            moving.left.press = true
            }
            break
        // D right
        case 68:
            if(not_typing.status){
            socket.emit('updatePlayersmovement','right')
            moving.right.press = true
            }
            break

    }
})

addEventListener('keyup', ({keyCode}) => {
    switch(keyCode){
        // W up
        case 87:
            socket.emit('updatePlayersmovement','releaseup')
            break
        // S down
        case 83:
            break

        // A left
        case 65:
            socket.emit('updatePlayersmovement','releaseleft')
            break
        // D right
        case 68:
            socket.emit('updatePlayersmovement','releaseright')
            break
    }
})




// message handle for form input

const messageForm = document.getElementById('message-container')
const messageinput = document.getElementById('message-input')


socket.on('message', (msg) => {
    players[msg.id].messageShow = true
    players[msg.id].message = msg.message
    setTimeout(function() {
        players[msg.id].messageShow = false
    }, 8000)
  });

messageForm.addEventListener('submit',e => {
    e.preventDefault()
    socket.emit('message', {message:messageinput.value , id:socket.id});
    messageinput.value = ''
})

//handle cursor
const not_typing = {
    status : true
}
messageinput.addEventListener("focus", () => {
    not_typing.status = false
});

messageinput.addEventListener("blur", () => {
    not_typing.status = true
});


