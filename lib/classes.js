class Particle{
    constructor(x, y,decay){
        this.pos=createVector(x, y)
        particles.stars.particles.push(this)
        this.decay=decay
        this.alpha=1
        let length
        height>width?(length=height):(length=width)
        this.r1 = 2*(length/700)
        this.r2 = 10*(length/700)
    }
    draw(){
        if(this.alpha<=0.1){
            particles.stars.particles.splice(particles.stars.particles.indexOf(this), 1)
        }
        push()
        translate(this.pos.x, this.pos.y)
        fill(`rgba(255, 255, 255, ${this.alpha})`)
        noStroke()
        beginShape();
        vertex(0 - this.r1, 0 - this.r1);
        vertex(0, 0 - this.r2)
        vertex(this.r1, 0 - this.r1)
        vertex(this.r2, 0)
        vertex(this.r1, this.r1)
        vertex(0, this.r2)
        vertex(0 - this.r1, this.r1)
        vertex(0 - this.r2, 0)
        endShape(CLOSE);
        pop()
        this.alpha-=0.5/this.decay
    }
}