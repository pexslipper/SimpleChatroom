
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

//handle connect to server
const socket = io();
const players = {}
socket.on('updatePlayers',(playersinserver) => {
    //add new player
    for(const id in playersinserver){
        const playerinserver = playersinserver[id]

        if (!players[id]){
            players[id] = new Player (playerinserver.x,playerinserver.y,playerinserver.name,playerinserver.vx,playerinserver.vy)
        }
    }

    //delete disconnect player
    for(const id in players){
        if (!playersinserver[id]){
            delete players[id]
        }
    }


})

canvas.width = innerWidth
canvas.height = 500

const gravity = 0.5
class Player {
    constructor(x, y , name,vx,vy) {
        this.position = { x, y }
        this.name = name

        this.width = 30
        this.height = 60

        this.velocity = 
        {
            x:vx,
            y:vy
        }
    }

    draw(){
        c.fillStyle = 'black'
        c.fillRect(this.position.x,this.position.y,this.width,this.height) 
        c.fillStyle = 'white'
        //name here
        c.fillText(this.name, this.position.x, this.position.y - 8)

        c.fillText("X:"+this.position.x, this.position.x+35, this.position.y)
        c.fillText("Y:"+`${this.position.y+this.height}`, this.position.x+35, this.position.y+10);
        c.fillText("VY:"+this.velocity.y, this.position.x+35, this.position.y+20);

    }  

    update(){
        this.draw()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        if(this.position.y + this.height + this.velocity.y <= canvas.height )
        {
            this.velocity.y += gravity
        } else {
            this.velocity.y = 0
        }
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
    constructor(x,y){
        this.position = { x, y }

        this.width = 150    
        this.height = 15
    }

    draw(){
        c.fillStyle = 'green'
        c.fillRect(this.position.x,this.position.y,this.width,this.height)  
        c.fillText("X:"+this.position.x, this.position.x, this.position.y);
        c.fillText("Y:"+this.position.y, this.position.x+150, this.position.y);
    }

}

const platforms = [
    new Platform(canvas.width-1200,200),
    new Platform(canvas.width-1000,150),
    new Platform(canvas.width-200,300),
    new Platform(canvas.width-800,175),
    new Platform(canvas.width-520,350),
    new Platform(canvas.width-900,380),
    new Platform(canvas.width-150,400),
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
    if(players[socket.id]){
    if (moving.left.press && 
        players[socket.id].position.x > 0 && not_typing.status)
        {
        players[socket.id].velocity.x = -5
    } else if (moving.right.press &&
        players[socket.id].position.x + players[socket.id].width < 1690 && not_typing.status) {
        players[socket.id].velocity.x = 5
    } else {
        players[socket.id].velocity.x = 0
    }

    //handle message
    if(message.show){
        players[socket.id].drawSpeechRectangle(messageShow.message)
    }
    
    // handle platform
    platforms.forEach(platform => {
    if(
        players[socket.id].position.y + players[socket.id].height <= platform.position.y && 
        players[socket.id].position.y + players[socket.id].height + players[socket.id].velocity.y >= platform.position.y &&
        players[socket.id].position.x + players[socket.id].width >= platform.position.x && 
        players[socket.id].position.x <= platform.position.x + platform.width
        ){
            players[socket.id].velocity.y = 0 
        }
})

    // handle reset player position
    if (players[socket.id].position.y + players[socket.id].height >= 520)
    {
        players[socket.id].position.x =100
        players[socket.id].position.y =100
    }
}

}

animate()

addEventListener('keydown', ({keyCode}) => {
    switch(keyCode){
        // W up
        case 87:
            // players[socket.id].velocity.y -= 10
            if(not_typing.status){
            players[socket.id].velocity.y -= 10
            }
            break
        // S down
        case 83:
            if(not_typing.status){
            players[socket.id].velocity.y =+ 1
            }
            break

        // A left
        case 65:
            moving.left.press = true
            break
        // D right
        case 68:
            moving.right.press = true
            break

    }
})

addEventListener('keyup', ({keyCode}) => {
    switch(keyCode){
        // W up
        case 87:
            break
        // S down
        case 83:
            break
        // A left
        case 65:
            // players[socket.id].velocity.x = 0
            moving.left.press = false
            break
        // D right
        case 68:
            // players[socket.id].velocity.x = 0
            moving.right.press = false
            break
    }
})




// message handle for form input

const messageForm = document.getElementById('message-container')
const messageinput = document.getElementById('message-input')
const messageShow = {
    message : ''
}
//send message

messageForm.addEventListener('submit',e => {
    e.preventDefault()
    messageShow.message = messageinput.value
    message.show = true
    setTimeout(function() {
        message.show = false
    }, 2000)
    messageinput.value = ''
})

//handle cursor
const not_typing = {
    status : true
}
messageinput.addEventListener("focus", () => {
    // This code will run when the cursor enters the text input
    not_typing.status = false
});

messageinput.addEventListener("blur", () => {
    // This code will run when the cursor enters the text input
    not_typing.status = true
});


