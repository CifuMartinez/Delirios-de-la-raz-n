class Letter {
    constructor(x, y) {
      this.alphabets = ["SI", "NO"];
      this.letter = random(this.alphabets);
      this.size = random(10, 30);
      this.f = random(fonts);
      this.colors=["#f3efdd","#36684b"];
      this.color=random(this.colors);
      this.x = x;
      this.y = y;
      this.dx = random(-5, 5);
      this.dy = random(-5, 5);
      
      this.angle = random(360);
      this.angleV = random(1, 3);
    }
    
    update() {
      this.x += this.dx;
      this.y += this.dy;
      this.angle += this.angleV;
    }
    
    display() {
      push();
      translate(this.x, this.y);
      rotate(radians(this.angle));
      textSize(this.size);
      textFont(this.f);
      textAlign(CENTER, CENTER);
      fill(this.color);
      noStroke();
      text(this.letter, 0, 0);
      pop();
    }
    
    offScreen() {
      return (
        this.x > width + 50 ||
        this.x < -50 ||
        this.y > height + 50 ||
        this.y < -50
      );
    }
  }