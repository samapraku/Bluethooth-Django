var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 20;
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var fillStyle = "#0095DD";


var x = canvas.width/2;
var y = canvas.height-30;
var dx = 3;
var dy = -3;
var paddleHeight = 10;
var paddleWidth = 150;
var paddleX = (canvas.width-paddleWidth)/2;
var brickRowCount = 9;
var brickColumnCount = 3;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;

var bricks = [];
for(var c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(var r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

var moveX = (canvas.width)/2;
var moveY = (canvas.height)/2;


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
var displaySocket = new WebSocket(
    'ws://' + window.location.host +
    '/ws/bluetooth/' ); 

displaySocket.onmessage = function(e) {
    var data = JSON.parse(e.data);
    var message = data['message'];
    processMsg(message);
   
};

displaySocket.onclose = function(e) {
    console.error('Chat socket closed unexpectedly');
};


function processMsg(message){
        if(message === "right") {
            rightPressed = true;
        }
        else if(message === "left") {
            leftPressed = true;
        }
    
        if(message === "up"){
            if(!upPressed){
             upPressed = true;
            draw();
            }
        }
        else if(message === "down"){
            if(upPressed){
            upPressed = false;
            draw();
            }
        }
    
        else if(message === "middle"){
           fillStyle = generateRandomColor();
        }
              
}

function reset(){
    rightPressed = false;
    leftPressed = false;
}

function generateRandomColor()
{
    var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
    return randomColor;
}

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }

    if(e.key == "Up" || e.key == "ArrowUp"){
        
        if(!upPressed){
        upPressed = true;
        draw();
        }
    }
    else if(e.key == "Down" || e.key == "ArrowDown"){
        if(upPressed){
        upPressed = false;
        draw();
        }
    }

}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }

    if(e.key == "Up" || e.key == "ArrowUp"){
        
    }
    else if(e.key == "Down" || e.key == "ArrowDown"){
        
    }

}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.closePath();
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 28;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 28;
    }

    x += dx;
    y += dy;
    
   reset();
    
    if(upPressed){        
     requestAnimationFrame(draw);
    }

}
/*
function moveBallX(){

    if(rightPressed) {
        moveX += 7;
        if (moveX + ballRadius > canvas.width){
            moveX = canvas.width - ballRadius;
        }
    }
    else if(leftPressed) {
        moveX -= 7;  
        if(moveX - 17 < 0){
            moveX = ballRadius;
        }
    }
    
}

function moveBallY(){
    if(downPressed) {
        moveY += 7;
        if (moveY + ballRadius > canvas.height){
            moveY = canvas.height - ballRadius;
        }
    }
    else if(upPressed) {
        moveY -= 7;  
        if(moveY - 17 < 0){
            moveY = ballRadius;
        }
    }

}  */

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#B38C5B";
    ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "##B38C5B";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function collisionDetection() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

draw()



