let fonts = [];
let letters = [];
let showMessage = true;
let isMousePressedInsideCanvas = false;

function preload() {
  fonts[0] = loadFont("fonts/CrimsonText-Regular.ttf");
  fonts[1] = loadFont("fonts/CrimsonText-SemiBold.ttf");
  fonts[2] = loadFont("fonts/PPMondwest-Regular.otf");
}

function setup() {
  const container = document.getElementById('canvasContainer');
  let canvasWidth = container.offsetWidth;
  let canvasHeight = container.offsetHeight;
  
  if (canvasWidth <= 480) {
    canvasHeight = Math.min(canvasHeight, canvasWidth * 1.2);
  }
  
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvasContainer');
  
  // Prevenir todos los tipos de scroll
  const canvasElement = document.getElementById('canvasContainer');
  
  canvasElement.addEventListener('wheel', (e) => {
    e.preventDefault();
  }, { passive: false });
  
  canvasElement.addEventListener('touchmove', (e) => {
    e.preventDefault();
  }, { passive: false });
  
  canvas.mouseOver(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden'; // También prevenir scroll en el html
  });
  
  canvas.mouseOut(() => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  });
  
  textAlign(CENTER, CENTER);
  textSize(24);
}

function windowResized() {
  const container = document.getElementById('canvasContainer');
  let canvasWidth = container.offsetWidth;
  let canvasHeight = container.offsetHeight;
  
  if (canvasWidth <= 480) {
    canvasHeight = Math.min(canvasHeight, canvasWidth * 1.2);
  }
  
  resizeCanvas(canvasWidth, canvasHeight);
}

function draw() {
  background("#000000");
  
  let messageSize = width <= 480 ? 20 : 24;
  
  if (showMessage) {
    if (fonts[0] && fonts[2]) {
      noStroke();
      
      textFont(fonts[0]);
      fill("#f3efdd");
      textSize(messageSize);
      text("¿Cual es la respuesta?", width/2, height/2 - messageSize/1.5);
      
      textFont(fonts[2]);
      fill("#36684b");
      textSize(messageSize - 1);
      text("Clica y descubre", width/2, height/2 + messageSize/1.5);
    }
  }
  
  let particleSize = width <= 480 ? 12 : 15;
  
  if (isMousePressedInsideCanvas) {
    showMessage = false;
    textFont(fonts[0]);
    fill("#f3efdd");
    ellipse(mouseX, mouseY, particleSize, particleSize);
    letters.push(new Letter(mouseX, mouseY, particleSize));
  }
  
  for (let i = letters.length - 1; i >= 0; i--) {
    letters[i].update();
    letters[i].display();
    if (letters[i].offScreen()) {
      letters.splice(i, 1);
    }
  }
}

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    isMousePressedInsideCanvas = true;
  }
}

function mouseReleased() {
  isMousePressedInsideCanvas = false;
}

