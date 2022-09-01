var edges, paddle, canvas, cpuMode, rightKey, startKey, leftKey, resetButton, speedMultiplierSlider, blocksleft = 0, rows = [], powerupSprites = [], balls = [], gameState = 0, speedMultiplier = 1, ballBounceOff, powerupSound, explotionSound
var gui, particles={
    stars:{
        particles:[],
        defTunp:20,
        tunp:20,
        decay:10
    }
}
let startGame = () => {
    gameState = 1
    balls[0].velocityY = -4 * speedMultiplier * (height / 700)
    balls[0].velocityX = random([-4 * (width / 700), 4 * (width / 700)]) * speedMultiplier
}
let createBlockSprites = (y, w, h) => {
    let r = Math.round(random(0, 255))
    let g = Math.round(random(0, 255))
    let b = Math.round(random(0, 255))
    let row = new Group()
    for (let x = width / 50; x < width - (width / 50); x += width / 20) {
        let sprite = createSprite(x, y, w, h)
        blocksleft++
        sprite.draw = () => {
            push()
            fill(r, g, b)
            rectMode(CENTER)
            rect(0, 0, w, h)
            pop()
        }
        row.add(sprite)
    }
    return row
}
let createBlockSprite = (x, y, w, h) => {
    let r = Math.round(random(0, 255))
    let g = Math.round(random(0, 255))
    let b = Math.round(random(0, 255))
    let sprite = createSprite(x, y, w, h)
    blocksleft++
    sprite.draw = () => {
        push()
        fill(r, g, b)
        rectMode(CENTER)
        rect(0, 0, w, h)
        pop()
    }
    return sprite
}
let createBall = (x, y, vX, vY, type) => {
    let ball, color
    ball = createSprite(x, y, 10, 15 * (width / 700))
    if (type === 'normal') {
        color = 'white'
    }
    if (type === 'explosive') {
        color = 'orange'
    }
    if (color) {
        ball.draw = () => {
            push()
            fill(color)
            ellipse(0, 0, 15 * (width / 700))
            pop()
        }
    } else {
        ball.draw = () => {
            push()
            fill(255)
            ellipse(0, 0, 15 * (width / 700))
            pop()
        }
    }
    ball.setCollider('circle', 0, 0, (15 * width / 700) / 2)
    ball.velocityX = vX * speedMultiplier
    ball.velocityY = vY * speedMultiplier
    ball.type = type
    return ball
}
let createPowerupSprite = (type, x, y, i) => {
    let powerupSprite
    let varPriority
    if (width < height)
        varPriority = width
    else
        varPriority = height
    if (type === 'triplicate') {
        powerupSprite = createSprite(x, y, 40 * (varPriority / 700), 40 * (varPriority / 700))
        powerupSprite.draw = () => {
            push()
            fill('green')
            rectMode(CENTER)
            noStroke()
            rect(0, 0, 40 * (varPriority / 700), 40 * (varPriority / 700))
            fill('white')
            ellipse(0, -10 * (varPriority / 700), 7 * (varPriority / 700))
            ellipse(10 * (varPriority / 700), 10 * (varPriority / 700), 7 * (varPriority / 700))
            ellipse(-10 * (varPriority / 700), 10 * (varPriority / 700), 7 * (varPriority / 700))
            stroke(255)
            strokeWeight(2 * (varPriority / 700))
            line(4 * (varPriority / 700), -5 * (varPriority / 700), 9 * (varPriority / 700), 8 * (varPriority / 700))
            line(-4 * (varPriority / 700), -5 * (varPriority / 700), -9 * (varPriority / 700), 8 * (varPriority / 700))
            pop()
        }
        powerupSprite.balli = i
    }
    if (type === 'launchMore') {
        powerupSprite = createSprite(x, y, 40 * (varPriority / 700), 40 * (varPriority / 700))
        powerupSprite.draw = () => {
            push()
            rectMode(CENTER)
            fill('green')
            noStroke()
            rect(0, 0, 40 * (varPriority / 700), 40 * (varPriority / 700))
            fill('white')
            ellipse(10 * (varPriority / 700), -10 * (varPriority / 700), 7 * (varPriority / 700))
            ellipse(-10 * (varPriority / 700), -10 * (varPriority / 700), 7 * (varPriority / 700))
            rect(0 * (varPriority / 700), 10 * (varPriority / 700), 25 * (varPriority / 700), 5 * (varPriority / 700))
            stroke(255)
            strokeWeight(2 * (varPriority / 700))
            line(10 * (varPriority / 700), -10 * (varPriority / 700), 3 * (varPriority / 700), 5 * (varPriority / 700))
            line(-10 * (varPriority / 700), -10 * (varPriority / 700), -3 * (varPriority / 700), 5 * (varPriority / 700))
            pop()
        }
    }
    if (type === 'explotionBall') {
        powerupSprite = createSprite(x, y, 40 * (varPriority / 700), 40 * (varPriority / 700))
        powerupSprite.draw = () => {
            push()
            rectMode(CENTER)
            fill('cyan')
            noStroke()
            rect(0, 0, 40 * (varPriority / 700), 40 * (varPriority / 700))
            fill('white')
            triangle(5 * (varPriority / 700), 0, 0, -20 * (varPriority / 700), -5 * (varPriority / 700), 0)
            triangle(0, 0, 10 * (varPriority / 700), -15 * (varPriority / 700), -5 * (varPriority / 700), -5 * (varPriority / 700))
            triangle(0, 3 * (varPriority / 700), 0, -7 * (varPriority / 700), 15 * (varPriority / 700), -5 * (varPriority / 700))
            triangle(15 * (varPriority / 700), 15 * (varPriority / 700), 0, -15 * (varPriority / 700), -5 * (varPriority / 700), 0)
            triangle(5 * (varPriority / 700), 0, 0, 15 * (varPriority / 700), -5 * (varPriority / 700), 0)
            triangle(5 * (varPriority / 700), 0, -10 * (varPriority / 700), -15 * (varPriority / 700), -5 * (varPriority / 700), 0)
            triangle(15 * (varPriority / 700), 15 * (varPriority / 700), 0, -15 * (varPriority / 700), -5 * (varPriority / 700), 0)
            triangle(0, 3 * (varPriority / 700), 0, -7 * (varPriority / 700), -15 * (varPriority / 700), 3 * (varPriority / 700))
            fill('orange')
            ellipse(0.5 * (varPriority / 700), -2.5 * (varPriority / 700), 7 * (varPriority / 700))
            pop()
        }
    }
    if (type === 'lengthenPaddle') {
        powerupSprite = createSprite(x, y, 40 * (varPriority / 700), 40 * (varPriority / 700))
        powerupSprite.draw = () => {
            push()
            rectMode(CENTER)
            fill('blue')
            rectMode(CENTER)
            noStroke()
            rect(0, 0, 40 * (varPriority / 700))
            fill('white')
            rect(0, 0, 15 * (varPriority / 700), 5 * (varPriority / 700))
            stroke(255)
            strokeWeight(2 * (varPriority / 700))
            line(10 * (varPriority / 700), 0, 15 * (varPriority / 700), 0)
            line(15 * (varPriority / 700), 0, 12 * (varPriority / 700), -3 * (varPriority / 700))
            line(15 * (varPriority / 700), 0, 12 * (varPriority / 700), 3 * (varPriority / 700))
            line(-10 * (varPriority / 700), 0, -15 * (varPriority / 700), 0)
            line(-15 * (varPriority / 700), 0, -12 * (varPriority / 700), -3 * (varPriority / 700))
            line(-15 * (varPriority / 700), 0, -12 * (varPriority / 700), 3 * (varPriority / 700))
            pop()
        }
    }
    if (type === 'shortenPaddle') {
        powerupSprite = createSprite(x, y, 40 * (varPriority / 700), 40 * (varPriority / 700))
        powerupSprite.draw = () => {
            push()
            fill('red')
            rectMode(CENTER)
            noStroke()
            rect(0, 0, 40 * (varPriority / 700))
            fill('white')
            rect(0, 0, 15 * (varPriority / 700), 5 * (varPriority / 700))
            stroke(255)
            strokeWeight(2 * (varPriority / 700))
            line(10 * (varPriority / 700), 0, 15 * (varPriority / 700), 0)
            line(10 * (varPriority / 700), 0, 13 * (varPriority / 700), -3 * (varPriority / 700))
            line(10 * (varPriority / 700), 0, 13 * (varPriority / 700), 3 * (varPriority / 700))
            line(-10 * (varPriority / 700), 0, -15 * (varPriority / 700), 0)
            line(-10 * (varPriority / 700), 0, -13 * (varPriority / 700), -3 * (varPriority / 700))
            line(-10 * (varPriority / 700), 0, -13 * (varPriority / 700), 3 * (varPriority / 700))
            pop()
        }
    }
    //this one is more difficult because it uses stars
    if (type === 'levelFinish') {
        powerupSprite = createSprite(x, y, 40, 40)
        powerupSprite.draw = () => {
            push()
            if(particles.stars.tunp<=0){
                new Particle(random(x-40 * (varPriority / 700), x+40 * (varPriority / 700)), powerupSprites[powerupSprites.indexOf(powerupSprite)].y, particles.stars.decay)
                particles.stars.tunp=particles.stars.defTunp
            }
            fill('gold')
            rectMode(CENTER)
            noStroke()
            rect(0, 0, 40 * (varPriority / 700))
            fill('white')
            rect(-3 * (varPriority / 700), 3 * (varPriority / 700), 50 / 3 * (varPriority / 700), 25 / 3 * (varPriority / 700))
            fill('red')
            ellipse(3 * (varPriority / 700), -3 * (varPriority / 700), 15 * (varPriority / 700))
            fill('gold')
            ellipse(3 * (varPriority / 700), -3 * (varPriority / 700), 10 * (varPriority / 700))
            stroke('red')
            strokeWeight(3 * (varPriority / 700))
            line(0, -8.5 * (varPriority / 700), 6 * (varPriority / 700), 2.5 * (varPriority / 700))
            pop()
            particles.stars.tunp--
        }
    }
    if (powerupSprite) {
        powerupSprite.type = type
        powerupSprite.velocityY = (4 * speedMultiplier) * (height / 700)
        powerupSprites.push(powerupSprite)
    }
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
let drawPaddle = () => {
    push()
    rectMode(CENTER)
    fill(0, 0, 255)
    noStroke()
    rect(paddle.x, paddle.y, paddle.width, paddle.height)
    pop()
}
function preload() {
    ballBounceOff = loadSound('assets/retro-game-hit-6-sound-effect-039136185_nw_prev.m4a')
    powerupSound = loadSound('assets/retro-game-jump-01-sound-effect-076827096_nw_prev.m4a')
    explotionSound = loadSound('assets/y2mate.com - Retro Explosion Sound Effect.mp3')
}
function setup() {
    canvas = createCanvas(windowWidth, windowHeight)
    gui = createGui()
    cpuMode = createCheckbox('cpu mode', 0, 0, 20 * (width / 700), 20 * (width / 700));
    paddle = createSprite(width / 2, height, 100 * (width / 500), 40 * (height / 1000))
    balls.push(createBall(paddle.x, height - (height / 20), 0, 0, 'normal'))
    paddle.draw = () => { }
    edges = createEdgeSprites()
    for (let y = height / 25; y <= height / 2 - (height / 100); y += height / 20)
        rows.push(createBlockSprites(y, 50 * (width / 1400), 25 * (height / 700)))
    leftKey = createButton("<", width / 200, height - (height / 100) - (50 * height / 700), 50 * height / 700, 50 * height / 700)
    rightKey = createButton(">", width - (width / 200) - (50 * height / 700), height - (height / 100) - (50 * height / 700), 50 * height / 700, 50 * height / 700)
    startKey = createButton('Start', width / 4, height - (height / 6), width / 2, height / 10)
    resetButton = createButton('Try again?', width / 4, height - (height / 2), width / 2, height / 10)
    leftKey._style.textSize = 20 * width / 700
    rightKey._style.textSize = 20 * width / 700
    startKey._style.textSize = 20 * width / 700
    resetButton._style.textSize = 20 * width / 700
    startKey._style.strokeWeight = 2 * width / 700
    rightKey._style.strokeWeight = 2 * width / 700
    leftKey._style.strokeWeight = 2 * width / 700
    resetButton._style.strokeWeight = 2 * width / 700
    cpuMode._style.strokeWeight = 2 * width / 700
    resetButton.enabled = false
    resetButton.visible = false
    startKey.enabled = false
    startKey.visible = false
    resetButton.onPress=()=>{
        resetButton.enabled = false
        resetButton.visible = false
        cpuMode.enabled=true
        cpuMode.visible=true
        paddle = createSprite(width / 2, height, 100 * (width / 500), 40 * (height / 1000))
        balls.push(createBall(paddle.x, height - (height / 20), 0, 0, 'normal'))
        paddle.draw = () => { }
        edges = createEdgeSprites()
        for (let y = height / 25; y <= height / 2 - (height / 100); y += height / 20) {
            rows.push(createBlockSprites(y, 50 * (width / 1400), 25 * (height / 700)))
        }
        if (getDeviceType() == 'tablet' || getDeviceType() == 'mobile'){
            startKey.enabled=true
            startKey.visible=true
            leftKey.enabled = true
            leftKey.visible = true
            rightKey.enabled = true
            rightKey.visible = true
        }
        gameState = 0
    }
    background(0)
}
function draw() {
    ballBounceOff.playbackRate=speedMultiplier
    powerupSound.playbackRate=speedMultiplier
    explotionSound.playbackRate=speedMultiplier
    background('rgba(0, 0, 0, 0.6)')
    //CPU mode will only follow the first ball in the array and doesn't have an AI, it will only follow the x position of the ball.
    if (balls[0] == null && !cpuMode.val && gameState != 2&&gameState!=3) {
        gameState = 2
        for (let row of rows) {
            for (let block of row) {
                blocksleft--
            }
            row.destroyEach()
            rows.splice(rows.indexOf(row), 1)
        }
        for (let sprite of powerupSprites) {
            sprite.destroy()
            powerupSprites.splice(powerupSprites.indexOf(sprite), 1)
        }
        paddle.destroy()
        paddle = null
        cpuMode.enabled = false
        cpuMode.visible = false
        leftKey.enabled = false
        leftKey.visible = false
        rightKey.enabled = false
        rightKey.visible = false
        resetButton.enabled = true
        resetButton.visible = true
    }
    if (blocksleft==0 && !cpuMode.val && gameState != 2&&gameState!=3) {
        gameState = 3
        for (let row of rows) {
            for (let block of row) {
                blocksleft--
            }
            row.destroyEach()
            rows.splice(rows.indexOf(row), 1)
        }
        for (let sprite of powerupSprites) {
            sprite.remove()
            powerupSprites.splice(powerupSprites.indexOf(sprite), 1)
        }
        for(let ball of balls){
            ball.remove()
            balls.splice(balls.indexOf(ball), 1)
        }
        paddle.destroy()
        paddle = null
        cpuMode.enabled = false
        cpuMode.visible = false
        leftKey.enabled = false
        leftKey.visible = false
        rightKey.enabled = false
        rightKey.visible = false
        resetButton.enabled = true
        resetButton.visible = true
    }
    if (cpuMode.val && !(balls[0] == null)) {
        if (gameState == 0) {
            startGame()
        }
        if (paddle.x > balls[0].x) {
            paddle.x -= 6 * speedMultiplier * (width / 500)
        }
        if (paddle.x < balls[0].x) {
            paddle.x += 6 * speedMultiplier * (width / 500)
        }
    } else if (cpuMode.val && balls[0] == null) {
        for (let e = 0; e < rows.length; e++) {
            for (let ee = 0; ee < rows[e].length; ee++) {
                blocksleft--
            }
            rows[e].destroyEach()
            rows[e].splice(e, 1)
        }
        paddle = createSprite(width / 2, height, 100 * (width / 500), 40 * (height / 1000))
        balls.push(createBall(paddle.x, height - (height / 20), 0, 0, 'normal'))
        paddle.draw = () => { }
        edges = createEdgeSprites()
        for (let y = height / 25; y <= height / 2 - (height / 100); y += height / 20) {
            rows.push(createBlockSprites(y, 50 * (width / 1400), 25 * (height / 700)))
        }
        gameState = 0
        startGame()
    }
    if (gameState == 1) {
        for (let ball of balls) {
            if (ball.type === 'normal') {
                if (ball.y > height + 5) {
                    balls.splice(balls.indexOf(ball), 1)
                }else{
                    ball.bounceOff(paddle, () => { ballBounceOff.play() })
                    ball.bounceOff(edges, () => { ballBounceOff.play() })
                    for (let row of rows) {
                        for (let block of row) {
                            ball.bounceOff(block, () => {
                                if (random([1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1])) {
                                    createPowerupSprite(selectPowerup(), block.x, block.y, balls.indexOf(ball))
                                }
                                block.destroy()
                                blocksleft--
                                ballBounceOff.play()
                            })
                        }
                    }
                }
            }
            if (ball.type === 'explosive') {
                if (ball.y > height + 5) {
                    balls.splice(balls.indexOf(ball), 1)
                }else{
                    ball.bounceOff(paddle, () => { ballBounceOff.play() })
                    ball.bounceOff(edges, () => { ballBounceOff.play() })
                    for (let row of rows) {
                        for (let block of row) {
                            if (block) {
                                ball.overlap(block, () => {
                                    explotionSound.play()
                                    ball.velocityX = 0
                                    ball.velocityY = 0
                                    ball.width = 100 * (width / 700)
                                    ball.height = 100 * (width / 700)
                                    ball.setCollider('circle', 0, 0, 50 * (width / 700))
                                    ball.draw = () => {
                                        push()
                                        fill('orange')
                                        ellipse(0, 0, 100 * (width / 700))
                                        pop()
                                    }
                                    for (let row of rows) {
                                        for (let block of row) {
                                            ball.overlap(block, () => {
                                                if (random([1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1])) {
                                                    createPowerupSprite(selectPowerup(), block.x, block.y, balls.indexOf(ball))
                                                }
                                                block.destroy()
                                                blocksleft--
                                            })
                                        }
                                    }
                                    let alpha = 100
                                    fade = setInterval(() => {
                                        ball.draw = () => {
                                            push()
                                            fill(255, 165, 0, alpha)
                                            ellipse(0, 0, width/700)
                                            pop()
                                            alpha -= 10 * speedMultiplier
                                        }
                                    })
                                    setTimeout(() => { ball.destroy(); balls.splice(balls.indexOf(ball), 1); clearInterval(fade) }, 2000)
                                })
                            }
                        }
                    }
                }
            }
        }
        for (let i = 0; i < powerupSprites.length; i++) {
            if (powerupSprites[i]) {
                if (powerupSprites[i].y > height + 20) {
                    powerupSprites[i].destroy()
                    powerupSprites.splice(i, 1)
                } else {
                    paddle.overlap(powerupSprites[i], () => {
                        powerupSound.play()
                        let sprite = powerupSprites[i]
                        if (sprite.type === 'triplicate') {
                            while (!(balls[sprite.balli])) {
                                sprite.balli--
                            }
                            balls.push(createBall(balls[sprite.balli].x, balls[sprite.balli].y, 4 * (width / 700) * speedMultiplier, -4 * (height / 700) * speedMultiplier, 'normal'))
                            balls.push(createBall(balls[sprite.balli].x, balls[sprite.balli].y, -4 * (width / 700) * speedMultiplier, -4 * (height / 700) * speedMultiplier, 'normal'))
                        }
                        if (sprite.type === 'launchMore') {
                            balls.push(createBall(paddle.x, paddle.y - 20, random(-4 * (width / 700) * speedMultiplier, 4 * (width / 700)), 4 * (height / 700) * speedMultiplier, 'normal'))
                            balls.push(createBall(paddle.x, paddle.y - 20, random(-4 * (width / 700) * speedMultiplier, 4 * (width / 700)), 4 * (height / 700) * speedMultiplier, 'normal'))
                        }
                        if (sprite.type === 'explotionBall') {
                            balls.push(createBall(paddle.x, paddle.y - 20, 0, -4 * (height / 700), 'explosive'))
                        }
                        if (sprite.type === 'lengthenPaddle') {
                            paddle.width += 10 * (width / 700)
                            setTimeout(() => { paddle.width -= 10 * (width / 700) }, 10000 / speedMultiplier)
                        }
                        if (sprite.type === 'shortenPaddle') {
                            paddle.width -= 10 * (width / 700)
                            setTimeout(() => { paddle.width += 10 * (width / 700) }, 10000 / speedMultiplier)
                        }
                        if (sprite.type === 'levelFinish') {
                            for (let e = 0; e < rows.length; e++) {
                                for (let ee = 0; ee < rows[e].length; ee++) {
                                    blocksleft--
                                }
                                rows[e].destroyEach()
                                rows[e].splice(e, 1)
                            }
                        }
                        sprite.destroy()
                        powerupSprites.splice(i, 1)
                    })
                }
            }
        }
    }
    if (getDeviceType() == 'desktop') {
        if (gameState != 2&&gameState!=3) {
            if (keyDown(LEFT_ARROW) && !(paddle.x < 0) && !(cpuMode.val)) {
                paddle.x -= 5 * speedMultiplier * (width / 500)
            }
            if (keyDown(RIGHT_ARROW) && !(paddle.x > width) && !(cpuMode.val)) {
                paddle.x += 5 * speedMultiplier * (width / 500)
            }
        }
        if (keyDown('space') && gameState == 0 && !(cpuMode.val)) {
            startGame()
        }

        leftKey.enabled = false
        leftKey.visible = false
        rightKey.enabled = false
        rightKey.visible = false
    }
    if (getDeviceType() == 'tablet' || getDeviceType() == 'mobile') {
        if (gameState != 2&&gameState!=3) {
            if (leftKey.val && !(paddle.x < 0) && !(cpuMode.val) && paddle != null) {
                paddle.x -= 5 * speedMultiplier * (width / 500)
            }
            if (rightKey.val && !(paddle.x > width) && !(cpuMode.val) && paddle != null) {
                paddle.x += 5 * speedMultiplier * (width / 500)
            }
        }
        if (startKey.val && gameState == 0 && !(cpuMode.val)) {
            startGame()
            startKey.enabled=false
            startKey.visible=false
        }
        if(gameState==1||gameState==0){
            leftKey.enabled = true
            leftKey.visible = true
            rightKey.enabled = true
            rightKey.visible = true
        }
    }
    drawSprites()
    if (paddle != null)
        drawPaddle()
    drawGui()
    if (gameState != 2&&gameState!=3) {
        push()
        textAlign(LEFT)
        fill(255)
        textSize(width / 100)
        text('Enable CPU mode', cpuMode.w + (cpuMode.w / 10), (cpuMode.w / 2) + (cpuMode.w / 10))
        pop()
        if (gameState == 0 && getDeviceType() == 'desktop') {
            balls[0].x = paddle.x
            textAlign(CENTER)
            push()
            noStroke()
            textSize(width / 100)
            fill(255)
            text('To start press space and move with the right and left arrow keys,', width / 2, height / 2 - (height / 100))
            text('or just enable CPU mode', width / 2, height / 2 + (height / 100))
            pop()
            startKey.enabled = false
            startKey.visible = false
        }
        if (gameState == 0 && (getDeviceType() == 'tablet' || getDeviceType() == 'mobile')) {
            balls[0].x = paddle.x
            textAlign(CENTER)
            push()
            noStroke()
            textSize(width / 100)
            fill(255)
            text('To start press the start button and move with the right and left buttons,', width / 2, height / 2 - (height / 100))
            text('or just enable CPU mode', width / 2, height / 2 + (height / 100))
            pop()
            startKey.enabled = true
            startKey.visible = true
        }
    }
    if (gameState == 2) {
        push()
        textAlign(CENTER)
        textSize(width / 50)
        text('Game Over', width / 2, height / 4)
        pop()
    }
    if (gameState == 3) {
        push()
        textAlign(CENTER)
        textSize(width / 50)
        text('You won!', width / 2, height / 4)
        pop()
    }
    for(let star of particles.stars.particles){
        star.draw()
    }
}
let selectPowerup = () => {
    let select = random(0, 100)
    if (select > 98) {
        return 'levelFinish'
    }
    else if (select > 75) {
        return 'launchMore'
    }
    else if (select > 55) {
        return 'shortenPaddle'
    }
    else if (select > 35) {
        return 'lengthenPaddle'
    }
    else if (select > 20) {
        return 'explotionBall'
    }
    else if (select < 20) {
        return 'triplicate'
    }
}