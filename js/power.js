const sketch1 = (p) => {
    let distMouse = 15;
    let size = 10;
    let offset = 4;
    let showMessage = true;
    let fonts = [];
    let cols, rows;
    let blocks = [];
    
    // Función para calcular el tamaño adecuado según el ancho de la pantalla
    const calculateSize = (containerWidth) => {
        if (containerWidth <= 480) {
            // Reducimos el número de columnas para pantallas pequeñas
            const desiredCols = 40; // Número de columnas para que no se vea tan alargado
            return Math.max(8, Math.floor(containerWidth / desiredCols)); // Mínimo 8px de tamaño
        }
        return 10; // Tamaño por defecto para pantallas grandes
    };
    
    p.preload = () => {
        fonts[0] = p.loadFont("fonts/CrimsonText-Regular.ttf");
        fonts[1] = p.loadFont("fonts/PPMondwest-Regular.otf");
    }
    
    const powerPattern = [
        "11111  11111  1   1  11111  11111",
        "1   1  1   1  1   1  1      1   1",
        "1   1  1   1  1   1  1      1   1",
        "11111  1   1  1 1 1  1111   1111 ",
        "1      1   1  1 1 1  1      1  1 ",
        "1      1   1   1 1   1      1   1",
        "1      11111   1 1   11111  1   1"
    ];
    
    p.setup = () => {
        const container = document.getElementById('canvasContainer1');
        let canvasWidth = container.offsetWidth;
        let canvasHeight = container.offsetHeight;
        
        if (canvasWidth <= 480) {
            canvasHeight = Math.min(canvasHeight, canvasWidth * 1.2);
        }
        
        const canvas = p.createCanvas(canvasWidth, canvasHeight);
        canvas.parent('canvasContainer1');
        
        // Prevenir todos los tipos de scroll
        const canvasElement = document.getElementById('canvasContainer1');
        
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
        
        size = calculateSize(canvasWidth);
        p.rectMode(p.CENTER);
        p.angleMode(p.DEGREES);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(24);
        
        initializeBlocks();
    };

    const initializeBlocks = () => {
        cols = Math.floor(p.width/size);
        rows = Math.floor(p.height/size);
        
        const startRow = Math.floor(rows/2) - Math.floor(powerPattern.length/2);
        const startCol = Math.floor(cols/2) - Math.floor(powerPattern[0].length/2);
        
        blocks = [];
        for (let i = 0; i < cols; i++) {
            blocks[i] = [];
            for (let j = 0; j < rows; j++) {
                blocks[i][j] = new Block(size/2 + i*size, size/2 + j*size, {
                    distMouse: distMouse,
                    size: size,
                    offset: offset
                });
                
                const patternRow = j - startRow;
                const patternCol = i - startCol;
                if (patternRow >= 0 && patternRow < powerPattern.length &&
                    patternCol >= 0 && patternCol < powerPattern[0].length) {
                    if (powerPattern[patternRow][patternCol] !== ' ') {
                        blocks[i][j].isActive = true;
                    }
                }
            }
        }
    };

    p.draw = () => {
        p.background(0);
        
        // Ajustar tamaño del texto según el ancho del canvas
        let messageSize = p.width <= 480 ? 20 : 24;
        
        // Mostrar mensaje inicial si showMessage es true
        if (showMessage) {
            if (fonts[0]) {
                p.noStroke();
                
                // Primera línea con Crimson
                p.textFont(fonts[0]);
                p.fill("#f3efdd");
                p.textSize(messageSize);
                p.text("Recorre la caja", p.width/2, p.height/2 - messageSize/1.5);
                
                // Segunda línea con Mondwest
                p.textFont(fonts[1]);
                p.fill("#cd1613");
                p.textSize(messageSize - 1);
                p.text("Cuidado con las bombas", p.width/2, p.height/2 + messageSize/1.5);
            }
        }
        
        // Dibujar los bloques solo si no se muestra el mensaje o si el mouse está sobre el canvas
        if (!showMessage || p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    blocks[i][j].move(p);
                    blocks[i][j].display(p);
                }
            }
        }
        
        // Ocultar mensaje cuando el mouse está sobre el canvas
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            showMessage = false;
        }
    };

    // Modificar windowResized para usar el nuevo cálculo de tamaño
    p.windowResized = () => {
        const container = document.getElementById('canvasContainer1');
        let canvasWidth = container.offsetWidth;
        let canvasHeight = container.offsetHeight;
        
        // Mantener la proporción en el resize
        if (canvasWidth <= 480) {
            canvasHeight = Math.min(canvasHeight, canvasWidth * 1.2);
        }
        
        p.resizeCanvas(canvasWidth, canvasHeight);
        size = calculateSize(canvasWidth);
        initializeBlocks();
    };
};

// Inicializar el sketch
new p5(sketch1, 'canvasContainer1');