class Block {
    constructor(x, y, sketch) {
      this.x = x; 
      this.y = y;
      this.angle = 0;
      this.opacity = 70;
      this.isActive = false;
      this.distMouse = sketch.distMouse;
      this.size = sketch.size;
      this.offset = sketch.offset;
    }
    
    display(p) {
      p.noFill();
      p.push();
      p.translate(this.x, this.y);
      p.rotate(this.angle);
      
      if (this.isActive) {
        p.stroke(205, 22, 19);
        this.drawX(p);
      } else {
        p.stroke(243, 239, 221, this.opacity);
        if (this.angle > 0 && this.angle < 45) {
          this.drawRect(p);
        } else {
          this.drawX(p);
        }
      }
      p.pop();
    }
    
    move(p) {
      let distance; 
      if (p.pmouseX - p.mouseX != 0 || p.pmouseY - p.mouseY != 0) {
        distance = p.dist(p.mouseX, p.mouseY, this.x, this.y);
        if (distance < this.distMouse) {
          this.angle += 1;
          if (!this.isActive) {
            this.opacity = 255;
          }
        }
      }
      
      if (this.angle > 0 && this.angle < 90) {
        this.angle += 1;
        if (!this.isActive && this.opacity > 70) {
          this.opacity -= 3;
        }
      } else {
        this.angle = 0;
        if (!this.isActive) {
          this.opacity = 70;
        }
      }
    }
    
    drawRect(p) {
     /* p.rect(0, 0, this.size - this.offset, this.size - this.offset); */
     p.circle(0, 0, this.size - this.offset);
    }
    
    drawX(p) {
      let margin = -this.size/2;
      p.line(margin + this.offset/2, margin + this.offset/2, margin + this.size - this.offset/2, margin + this.size - this.offset/2);
      p.line(margin + this.size - this.offset/2, margin + this.offset/2, margin + this.offset/2, margin + this.size - this.offset/2);
    }
  }
    