var edges, paddle, canvas, cpuMode
var blocksleft=0
var rows=[]
var powerupSprites=[]
var balls=[]
var gameState=0
var speedMultiplier=1

function setup(){
    cpuMode= createCheckbox('Enable CPU mode', false);
    canvas=createCanvas(700, 700)
    balls.push(createBall(200, height-40))
    paddle=createSprite(200, height, 100, 40)
    paddle.draw=()=>{
        push()
        fill(0, 0, 255)
        rect(0, 0, 100, 40)
        pop()
    }
    edges=createEdgeSprites()
    for(let y=100; y<=300; y+=40){
    rows.push(createBlockSprites(y, 50, 25))
    }
    
}

function draw(){
    clear()
    background(75)
    //WIP
    /*if(cpuMode.checked()){
        if(gameState==0){
            startGame()
        }
        if(paddle.x>ball.x){
            paddle.x-=5*speedMultiplier
        }
        if(paddle.x<ball.x){
            paddle.x+=5*speedMultiplier
        }
    }*/
    if(gameState==0){
        balls[0].x=paddle.x
    }
    if(ball.y>height+10){
        gameState=2
    }
    //Unused
    /*if(blocksleft===0){
        location.reload()
    }*/
    for(let ball of balls)
        ball.bounceOff(edges)
        ball.bounceOff(paddle)
        for(let balC of balls){
            ball.bounceOff(ballC)
        }
        for(let ii=0;ii<rows.length;ii++){
            for(let i=0;i<rows[ii].length;i++){
                ball.bounceOff(rows[ii][i], ()=>{
                    rows[ii][i].remove()
                    blocksleft--
                })
            }
    }
    for(let i = 0;i<powerupSprites.length;i++){
        paddle.collide(powerupSprites[i], ()=>{
            let sprite = powerupSprites[i]
            sprite.remove()
            if(sprite.type==='multiplicate'){
                
            }
            if(sprite.type==='launchMore'){

            }
            powerupSprites[i].remove()
            powerupSprites.splice(i, 1)
        })
    }
    if(keyDown(LEFT_ARROW)&&!(paddle.x<55)&&!(cpuMode.checked())){
        paddle.x-=5*speedMultiplier
    }
    if(keyDown(RIGHT_ARROW)&&!(paddle.x>width-55)&&!(cpuMode.checked())){
        paddle.x+=5*speedMultiplier
    }
    if(keyDown('space')&&gameState==0&&!(cpuMode.checked())){
        startGame()
    }
    drawSprites()
}
let startGame=()=>{
    gameState=1
        ball.velocityY=-4*speedMultiplier
        ball.velocityX=random([-4, 4])*speedMultiplier
}
let createBlockSprites=(y, w, h)=>{
    let r=Math.round(random(0, 255))
    let g=Math.round(random(0, 255))
    let b=Math.round(random(0, 255))
    let row=[]
    for(let x = 100;x<625;x+=60){
        let sprite = createSprite(x, y, w, h)
        blocksleft++
        sprite.draw=()=>{
            push()
            fill(r, g, b)
            rectMode(CENTER)
            rect(0, 0, w, h)
            pop()
        }
        row.push(sprite)
    }
    return row
}
let createBall=(x, y)=>{
    let ball
    ball=createSprite(x, y, 10, 15)
    ball.draw=()=>{
        push()
        fill(255)
        ellipse(0, 0, 15)
        pop()
    }
    ball.setCollider("circle", 0, 0, 20)
    return ball
}
let createPowerupSprite =(type, x, y)=>{
    let powerupSprite
    if(type==='multiplicate'){
        powerupSprite=createSprite(x, y, 40, 40)
        powerupSprite.draw=()=>{
            push()
            fill('blue')
            rectMode(CENTER)
            noStroke()
            rect(0, 0, 40, 40)
            fill('white')
            circle(0, -10, 10)
            circle(10, 10, 10)
            circle(-10, 10, 10)
            pop()
        }
        powerupsprite.type=type
        powerupSprite.velocityY=4
    }
    if(type==='launchMore'){
        powerupSprite=createSprite(x, y, 40, 40)
        powerupSprite.draw=()=>{
            push()
            translate(300, 100)
            rectMode(CENTER)
            fill('blue')
            noStroke()
            rect(0, 0, 40, 40)
            fill('white')
            circle(0, 0, 10)
            circle(13, 0, 10)
            circle(-13, 0, 10)
            pop()
        }
        powerupSprite.type=type
        powerupSprite.velocityY=4
    }

    powerupSprites.push(powerupSprite)
}