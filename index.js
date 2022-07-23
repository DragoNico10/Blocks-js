var ball, edges, paddle, canvas
var gameState=0

function setup(){
    canvas=createCanvas(400, 400)
    ball=createSprite(200, 360,10, 10)
    ball.draw=()=>{
        push()
        fill(255)
        ellipse(0, 0, 10)
        pop()
    }
    paddle=createSprite(200, 390, 100, 5)
    paddle.draw=()=>{
        push()
        fill(0, 0, 255)
        rect(0, 0, 100, 5)
        pop()
    }
    ball.setCollider("circle", 0, 0, 5)
    edges=createEdgeSprites()
    
}

function draw(){
    clear()
    background(75)
    if(gameState==0){
        ball.x=paddle.x
    }
    for(let i=0;i<2;i++){
        ball.bounceOff(edges[i])
    }
    if(keyDown(LEFT_ARROW)&&!(paddle.x<55)){
        paddle.x-=5
    }
    if(keyDown(RIGHT_ARROW)&&!(paddle.x>345)){
        paddle.x+=5
    }
    if(keyDown(SPACE)&&gameState==0){
        
    }
    drawSprites()
}