var edges, paddle, canvas, cpuMode
var rightKey; var leftKey
var blocksleft=0
var rows=[]
var powerupSprites=[]
var balls=[]
var gameState=0
var speedMultiplier=1

let startGame=()=>{
    gameState=1
        balls[0].velocityY=-4*speedMultiplier
        balls[0].velocityX=random([-4, 4])*speedMultiplier
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
    ball.setCollider('circle', 0, 0, 20)
    return ball
}
let createPowerupSprite =(type, x, y)=>{
    let powerupSprite
    if(type==='triplicate'){
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
let getDeviceType = () => {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (
      /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        ua
      )
    ) {
      return 'mobile';
    }
    return 'desktop';
  };

function setup(){
    cpuMode= createCheckbox('Enable CPU mode', false);
    cpuMode.position(0, 0)
    cpuMode.size(200, 200)
    canvas=createCanvas(700, 700)
    balls.push(createBall(200, height-40))
    console.log(balls)
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
    /*rightKey=createSprite(650, 50, 80, 80)
    rightKey.draw=()=>{
        push()
        rectMode(CENTER)
        fill('white')
        rect(0, 0, 80, 80)
        strokeWeight(7)
        stroke(0)
        line(-20, 0, 20, 0)
        line(20, 0, 0,-20)
        line(20, 0, 0, 20)
        pop()
    }
    rightKey.debug=1
    leftKey=createSprite(50, 50, 80, 80)
    leftKey.draw=()=>{
        push()
        rectMode(CENTER)
        fill('white')
        rect(0, 0, 80, 80)
        strokeWeight(7)
        stroke(0)
        line(-20, 0, 20, 0)
        line(-20, 0, 0,-20)
        line(-20, 0, 0,20)
        pop()
    }
    console.log(leftKey)*/
}
    
    


function draw(){
    clear()
    background(75)
    //WIP
    if(cpuMode.checked()){
        if(gameState==0){
            startGame()
        }
        if(paddle.x>balls[0].x){
            paddle.x-=5*speedMultiplier
        }
        if(paddle.x<balls[0].x){
            paddle.x+=5*speedMultiplier
        }
    }
    if(gameState==0){
        balls[0].x=paddle.x
    }
    //Unused
    /*if(ball.y>height+10){
        gameState=2
    }*/
    //Unused
    /*if(blocksleft===0){
        location.reload()
    }*/
    for(let iii=0;iii<balls.length;iii++){
        if(balls[iii].y>height+5){
            balls.splice(iii, 1)
            break
        }
        balls[iii].bounceOff(paddle)
        balls[iii].bounceOff(edges)
        for(let ballC of balls){
            balls[iii].bounceOff(ballC)
        }
        for(let ii=0;ii<rows.length;ii++){
            for(let i=0;i<rows[ii].length;i++){
                balls[iii].bounceOff(rows[ii][i], ()=>{
                    rows[ii][i].destroy()
                    blocksleft--
                })
            }
        }
    }
    for(let i = 0;i<powerupSprites.length;i++){
        paddle.collide(powerupSprites[i], ()=>{
            let sprite = powerupSprites[i]
            sprite.destroy()
            if(sprite.type==='triplicate'){
                
            }
            if(sprite.type==='launchMore'){

            }
            powerupSprites[i].destroy()
            powerupSprites.splice(i, 1)
        })
    }
    if(getDeviceType()=='desktop'){
        if(keyDown(LEFT_ARROW)&&!(paddle.x<55)&&!(cpuMode.checked())){
            paddle.x-=5*speedMultiplier
        }
        if(keyDown(RIGHT_ARROW)&&!(paddle.x>width-55)&&!(cpuMode.checked())){
            paddle.x+=5*speedMultiplier
        }
        if(keyDown('space')&&gameState==0&&!(cpuMode.checked())){
            startGame()
        }
        /*rightKey.y=999999
        leftKey.y=999999*/
    }else{
        /*rightKey.y=650
        leftKey.y=650
        if(rightKey.mouseIsOver&&!(paddle.x>width-55)&&!(cpuMode.checked())){
            paddle.x+=5*speedMultiplier
        }
        if(leftKey.mouseIsOver&&!(paddle.x<55)&&!(cpuMode.checked())){
            paddle.x-=5*speedMultiplier
        }*/
    }
    drawSprites()
}
