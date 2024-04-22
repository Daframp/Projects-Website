let perceptionRadius = 100;
let MaxForce = 0.5;
let maxVelocity = 4;

class boid{
    constructor(xPos, yPos){
        this.position= createVector(xPos,yPos);
        this.velocity = createVector(-xPos, -yPos);
        if (this.velocity.mag == 0){
        this.velocity = p5.Vector.random2D(); 
        }
        this.acceleration = createVector();
    }

    destroy(flock, effects, zoom, fishToSpawn, shark){
        if (shark.alive == true){
        let index = flock.indexOf(this);
        shark.score += 3;
        shark.hunger += 0.05 / zoom;
        shark.hunger = min(shark.hunger, 1);
        effects.push(new deathEffect(this.position, 50));
        flock.splice(index, 1);
        console.log(shark.fishSpawned, fishToSpawn);
        if (shark.fishSpawned < fishToSpawn){
        this.spawnFish(flock, shark, zoom);
        }
        }
    }

    spawnFish(flock, shark, zoom){
        shark.fishSpawned += 1;
        let x;
        let y;
        if (random(1)> 0.5){
            x = -width/2
            if (random(1)>0.5){
                x = abs(x);
            }
            y = random(-height/2, height/2);
        }else{
            y = -height/2
            if (random(1)>0.5){
                y = abs(y);
            }
            x = random(-width/2, width/2);
        }
        flock.push(new boid(x * zoom,y * zoom));
    }

    alignment(flock){
        let force = createVector();
        let NumOfLocals = 0;
        for (let other of flock){
            if (this.includeBoid(other, perceptionRadius)){
                force.add(other.velocity);
                NumOfLocals++;
            }
        }
        if (NumOfLocals > 0){
        force.div(NumOfLocals);
        }
        force.limit(MaxForce);
        return force;
    }

    cohesion(flock){
        let force = createVector();
        let NumOfLocals = 0;
        for (let other of flock){
            if (this.includeBoid(other,perceptionRadius)){
                force.add(other.position);
                NumOfLocals++;
            }
        }
        if (NumOfLocals > 0){
            force.div(NumOfLocals);
        }
        force.sub(this.position);
        force.limit(MaxForce);
        return force;
    }

    separation(flock){
        let force = createVector();
        let NumOfLocals = 0;
        let currentForce = createVector();
        for (let other of flock){
            if (this.includeBoid(other, perceptionRadius)){
                currentForce = p5.Vector.sub(this.position, other.position);
                let distance = dist(this.position.x, this.position.y, other.position.x, other.position.y)
                if (distance > 0){
                currentForce.div(pow(distance, 2));
                }
                force.add(currentForce);
            }
        if (NumOfLocals > 0){
            force.div(NumOfLocals);
        }
        }
        force.limit(MaxForce);
        force.mult(2);
        return force;
    }

    wiggle(shark){
        let force = createVector(0,0);
        let distance = dist(this.position.x, this.position.y, shark.position.x, shark.position.y);
        if (distance <= (perceptionRadius + 30) * 2* (1 + shark.score / 250)){
        force.x = random(-1, 1);
        force.y = random(-1, 1);
        force.mult(0.5);
        }
        return force;
    }

    includeBoid(other, perceptionDist){
        let distance = dist(this.position.x, this.position.y, other.position.x, other.position.y)
        if (this !== other && distance <= perceptionDist){
            return true;
        }
        return false;
    }

    avoidShark(shark){
        let force = createVector();
        let distance = dist(this.position.x, this.position.y, shark.position.x, shark.position.y);
        if (distance <= perceptionRadius * 2* (1 + shark.score / 250)){
            force = p5.Vector.sub(this.position, shark.position);
            if (distance > 0){
            force.div(distance);
            }
        }
        return force;
    }

    avoidOrca(orca){
        let force = createVector();
        let distance = dist(this.position.x, this.position.y, orca.position.x, orca.position.y);
        if (distance <=200){
            force = p5.Vector.sub(this.position, orca.position);
            if (distance > 0){
            force.div(distance);
            }
        }
        return force;
    }
    
    sharkCollision(flock, shark, effects, zoom, fishToSpawn){
        let distance = dist(this.position.x, this.position.y, shark.position.x, shark.position.y);
        if (distance < 20 * (1 + shark.score/70) ){
         this.destroy(flock, effects, zoom, fishToSpawn, shark);
        }
    }

    update(flock, shark, orca, effects, zoom, fishToSpawn){
        this.sharkCollision(flock, shark, effects, zoom, fishToSpawn);

        this.acceleration.mult(0);
        this.acceleration.add(this.cohesion(flock));
        this.acceleration.add(this.separation(flock));
        this.acceleration.add(this.alignment(flock));
        this.acceleration.add(this.avoidShark(shark));
        this.acceleration.add(this.avoidOrca(orca));
        this.acceleration.add(this.wiggle(shark));
        this.acceleration.mult(0.8);

        this.velocity.add(this.acceleration);
        this.velocity.setMag(maxVelocity);
        this.position.add(this.velocity);
    }

    show(zoom) {
        strokeWeight(15);
        stroke(250);
        fill(250);
        this.LoopEdges(zoom);
        push();
        translate(this.position.x, this.position.y);
        
        rotate(atan(this.velocity.y/this.velocity.x));
        if (this.velocity.x < 0){
           rotate(PI);
        }
        stroke(50, 70, 200, 230);
        fill(50, 70, 200, 200)
        triangle(-13,0.5, -13,-0.5,-11.5,0);
        ellipse(6,0,15,3);
        strokeWeight(3);
        stroke(40);
        point(12,-4);
        pop();
    }

    LoopEdges(zoom){
        if (this.position.x > width/2 * zoom   ) {
            this.position.x = -width/2 * zoom;
          } else if (this.position.x < -width/2 * zoom) {
            this.position.x = width/2* zoom;
          }
          if (this.position.y > height/2* zoom) {
            this.position.y = -height/2 * zoom;
          } else if (this.position.y < -height/2* zoom) {
            this.position.y = height/2* zoom;
          }
    }
}
