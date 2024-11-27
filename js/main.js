let windowWidth = window.innerWidth;
let resizeTimer;
gsap.registerPlugin(ScrollTrigger);

//RESIZE PANTALLA PARA ACTUALIZAR RESPONSIVE
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Solo recarga si el ancho cambió significativamente (más de 50px)
        if (Math.abs(windowWidth - window.innerWidth) > 50) {
            location.reload();
        }
        windowWidth = window.innerWidth;
    }, 250);
});

// ANIMACIÓN EXPLOSIÓN (HEADER)
// Configuración de la secuencia de imágenes del background header
const sequenceContainer = document.querySelector('.sequence-container');
if (!sequenceContainer) {
    console.error('No se encontró el contenedor de la secuencia');
}

const frameCount = 22;
const currentFrame = index => {
    return `./img/Explosion secuencia/explosion${index + 1}.png`;
};

const images = [];
const sequence = {
    frame: 0
};

// Precargar imágenes
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.style.opacity = 0;
    sequenceContainer.appendChild(img);
    images.push(img);
}

// Mostrar el primer frame
if (images.length > 0) {
    images[0].style.opacity = 1;
}


// Animación de la secuencia
gsap.to(sequence, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
        trigger: "header",
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 0.5,
        onUpdate: self => {
            if (sequence.frame >= 0) {
                images[Math.round(sequence.frame)].style.opacity = 1;
                images.forEach((img, index) => {
                    if (index !== Math.round(sequence.frame)) {
                        img.style.opacity = 0;
                    }
                });
            }
        }
    }
});


// ANIMACIÓN CARA (QUOTE)
const faceSequenceContainer = document.querySelector('.face-sequence-container');
if (!faceSequenceContainer) {
    console.error('No se encontró el contenedor de la secuencia de la cara');
}

const faceFrameCount = 25;
const faceCurrentFrame = index => {
    return `./img/Cara secuencia/frame${index + 1}.png`;
};

const faceImages = [];
const faceSequence = {
    frame: 0
};

// Precargar imágenes de la cara
for (let i = 0; i < faceFrameCount; i++) {
    const img = new Image();
    img.src = faceCurrentFrame(i);
    img.style.opacity = 0;
    faceSequenceContainer.appendChild(img);
    faceImages.push(img);
}

// Mostrar el primer frame de la cara
if (faceImages.length > 0) {
    faceImages[0].style.opacity = 1;
}

// Animación de la secuencia de la cara
gsap.to(faceSequence, {
    frame: faceFrameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
        trigger: ".quote-section",
        start: "top center",
        end: "center center",
        pin: false,
        scrub: 0.5,
        onUpdate: self => {
            if (faceSequence.frame >= 0) {
                faceImages[Math.round(faceSequence.frame)].style.opacity = 1;
                faceImages.forEach((img, index) => {
                    if (index !== Math.round(faceSequence.frame)) {
                        img.style.opacity = 0;
                    }
                });
            }
        }
    }
});

// ANIMACIÓN SUPERPOSICIÓN Y OPACIDAD (HEADER/QUOTE)
gsap.timeline({
    scrollTrigger: {
        trigger: ".quote-section",
        start: "top 100%",
        end: "top 80%",
        scrub: 1,
    }
})
.to(".overlay", {
    backgroundColor: 'rgba(0, 0, 0, 1)',
    ease: "easeInOut",
    duration: 0.5
})
.to(".titular", {
    opacity: 0,
    ease: "none",
    duration: 0.3
}, "<")
.to(".quote-container", {
    opacity: 1,
    y: 0,
    ease: "none",
    duration: 0.5
}, ">=0.1");

// ANIMACIÓN QUOTE (QUOTE)

// Animación de la quote section
const quoteElements = {
    iconContainer: document.querySelector('.icon-container'),
    titleContainer: document.querySelector('.title-container'),
    title: document.querySelector('.title-container h2'),
    quoteContent: document.querySelector('.quote-content')
};

// Configuración inicial - incluimos el title
gsap.set([quoteElements.iconContainer, quoteElements.title, quoteElements.quoteContent], {
    opacity: 0,
    y: 30
});

// Timeline para la quote section
gsap.timeline({
    scrollTrigger: {
        trigger: ".quote-section",
        start: "top center",
        toggleActions: "play none none none",
        onEnter: async () => {
            // 1. Primero, animar la cabeza (icon-container)
            await gsap.to(quoteElements.iconContainer, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out"
            });

            // 2. Hacer visible el contenedor del título antes del typewriter
            gsap.set(quoteElements.title, { opacity: 1 });
            
            // Efecto typewriter en el título
            const titleText = quoteElements.title.innerHTML;
            quoteElements.title.innerHTML = '';
            await typewriterEffect(quoteElements.title, titleText, 40);
            
            // 3. Finalmente, animar todo el quote content
            gsap.to(quoteElements.quoteContent, {
                opacity: 1,
                y: 20,
                duration: 2,
                ease: "power2.out"
            });
        }
    }
});

// Función typewriter
function typewriterEffect(element, text, speed = 20) {
    element.innerHTML = '';
    let htmlContent = '';
    let isTag = false;
    let tagContent = '';
    
    return new Promise(resolve => {
        function type(i = 0) {
            if (i < text.length) {
                if (text[i] === '<') {
                    isTag = true;
                    tagContent = '<';
                } else if (text[i] === '>') {
                    isTag = false;
                    tagContent += '>';
                    htmlContent += tagContent;
                } else {
                    if (isTag) {
                        tagContent += text[i];
                    } else {
                        htmlContent += text[i];
                        element.innerHTML = htmlContent;
                    }
                }
                setTimeout(() => type(i + 1), isTag ? 0 : speed);
            } else {
                resolve();
            }
        }
        type();
    });
}

//ANIMACIÓN ELEMENTOS CONTAINER (PANELES/DATA-ITEMS)

// Seleccionar elementos
let articles = gsap.utils.toArray(".panel");
let dataItems = gsap.utils.toArray(".data-item");
let dataContainer = document.querySelector('.data-container');

// Crear timeline principal
let tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".container",
        pin: true,
        scrub: 1,
        snap: {
            snapTo: "labels",
            duration: { min: 0.2, max: 3 },
            delay: 0.2,
            ease: "power1.inOut"
        },
        start: "top top",
        end: () => "+=" + (document.querySelector(".container").offsetWidth + dataContainer.offsetHeight * (dataItems.length * 2)),
    }
});

// Añadir animaciones al timeline
tl.addLabel('start');

// Animar cada panel individualmente
articles.forEach((_, index) => {
    if (index < articles.length - 1) {
        tl.to(articles, {
            xPercent: -100 * (index + 1),
            ease: "none",
            duration: 1
        })
        .addLabel(`panel${index + 1}`);
    }
});

tl.addLabel('panelsEnd');


dataItems.forEach((item, index) => {
    const isLastItem = index === dataItems.length - 1;
    // Label para el inicio de este item
    tl.addLabel(`item${index}Start`);

    // Entrada desde abajo hasta el centro
    tl.fromTo(item,
        {
            y: dataContainer.offsetHeight,
            opacity: 0
        },
        {
            y: (dataContainer.offsetHeight - item.offsetHeight) / 2,
            opacity: 1,
            duration: 1.5,
            ease: "power2.out",
            onStart: () => {
                // Actualizar bullets
                document.querySelectorAll('.bullet').forEach((bullet, bulletIndex) => {
                    bullet.classList.toggle('active', bulletIndex === index);
                });
            }
        }
    );

    // Pausa en el centro
    tl.addLabel(`item${index}Center`);

    // Solo animar la salida si NO es el último item
    if (!isLastItem) {
        tl.to(item, {
            y: -dataContainer.offsetHeight+100,
            opacity: 0,
            duration: 1,
            ease: "none"
        });
    }

    // Label para el final de este item
    tl.addLabel(`item${index}End`);
});





// MENU FLOTANTE
const floatingMenu = document.querySelector('.floating-menu');
const menuToggle = document.querySelector('.menu-toggle');
const menuItems = document.querySelector('.menu-items');

menuToggle.addEventListener('click', () => {
    floatingMenu.classList.toggle('active');
    menuItems.classList.toggle('active');
});

// Actualizar ítem activo basado en la sección visible
const menuLinks = document.querySelectorAll('.menu-item');
const sections = document.querySelectorAll('section');


// Creación del overlay de transición con animación Lottie
function createTransitionOverlay() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: black;
        opacity: 0;
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        transition: opacity 0.2s ease-out;
    `;
    
    // CARGA MENU ANIMACIÓN
    // Crear contenedor para la animación Lottie
    const lottieContainer = document.createElement('div');
    lottieContainer.id = 'lottieLoader';
    overlay.appendChild(lottieContainer);
    
    document.body.appendChild(overlay);

    // Inicializar la animación Lottie
    const animation = lottie.loadAnimation({
        container: lottieContainer,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: 'img/carga-menu.json'
    });

    return { overlay, animation };
}

// Modificar el manejo del scroll suave
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = targetId === 'inicio' 
            ? document.querySelector('header') 
            : document.getElementById(targetId);
        
        if (targetSection) {
            const { overlay, animation } = createTransitionOverlay();

            // Animar entrada del overlay y comenzar animación Lottie
            setTimeout(() => {
                overlay.style.opacity = '1';
                animation.play();
            }, 10);

            // Esperar a que el overlay esté completamente visible
            setTimeout(() => {
                if (targetId === 'inicio') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                } else {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
                
                document.querySelectorAll('.menu-item').forEach(menuItem => {
                    menuItem.classList.remove('active');
                });
                this.classList.add('active');
                
                if (floatingMenu.classList.contains('active')) {
                    floatingMenu.classList.remove('active');
                    document.querySelector('.menu-items').classList.remove('active');
                }

                // Animar salida del overlay y eliminarlo
                setTimeout(() => {
                    overlay.style.opacity = '0';
                    setTimeout(() => overlay.remove(), 800);
                }, 1200);
                
            }, 500);
        }
    });
});


// Actualizar menú según la sección visible
function updateActiveMenuItem() {
    const scrollPosition = window.scrollY;
    const header = document.querySelector('header');
    const sections = [header, ...document.querySelectorAll('section[id]')];
    
    let currentSection = null;
    
    sections.forEach(section => {
        if (!section) return;
        
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSection = section;
        }
    });
    
    if (currentSection) {
        const currentId = currentSection.tagName.toLowerCase() === 'header' ? 'inicio' : currentSection.id;
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentId}`) {
                item.classList.add('active');
            }
        });
    }
}


// Mantener estos event listeners al final
window.addEventListener('scroll', updateActiveMenuItem);
window.addEventListener('load', updateActiveMenuItem);

// Crear el cursor personalizado
function createCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    
    // Crear el símbolo + (por defecto)
    const symbol = document.createElement('span');
    symbol.className = 'cursor-symbol';
    symbol.textContent = '+';
    cursor.appendChild(symbol);
    
    // Crear el contenedor para las coordenadas
    const coordinates = document.createElement('div');
    coordinates.className = 'cursor-coordinates';
    cursor.appendChild(coordinates);
    
    document.body.appendChild(cursor);
    
    // Actualizar la posición del cursor
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        // Actualizar las coordenadas
        coordinates.textContent = `x:${Math.round(e.clientX)} y:${Math.round(e.clientY)}`;
    });
    
    // Añadir clase cuando se hace clic
    document.addEventListener('mousedown', () => {
        cursor.classList.add('clicked');
    });
    
    // Remover clase cuando se suelta el clic
    document.addEventListener('mouseup', () => {
        cursor.classList.remove('clicked');
    });
    
    // Ocultar el cursor cuando el mouse sale de la ventana
    document.addEventListener('mouseout', () => {
        cursor.style.display = 'none';
    });
    
    // Mostrar el cursor cuando el mouse entra en la ventana
    document.addEventListener('mouseover', () => {
        cursor.style.display = 'flex';
    });
    
    // Añadir efecto hover para elementos interactivos normales
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .menu-toggle, .menu-item, canvas, #canvasContainer, #canvasContainer1, .card-inner, .caja2, .caja4, .caja7, .caja8, .tab, .scientist-modal');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.2)';
            coordinates.classList.add('hide');
            
            // Ocultar el cursor si es la animación del mouse
            if (element.classList.contains('mouse-animation')) {
                cursor.style.opacity = '0';
            }
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            coordinates.classList.remove('hide');
            symbol.textContent = '+'; // Restaurar símbolo por defecto
            cursor.style.opacity = '1'; // Restaurar visibilidad del cursor
        });
    });

    // Manejo especial para áreas arrastrables
    const draggableAreas = document.querySelectorAll('.scientists-grid');
    draggableAreas.forEach(area => {
        area.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            coordinates.classList.add('hide');
            symbol.textContent = '< >'; // Cambiar a símbolos de navegación
            cursor.classList.add('navigation-mode');
        });
        
        area.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            coordinates.classList.remove('hide');
            symbol.textContent = '+'; // Restaurar símbolo por defecto
            cursor.classList.remove('navigation-mode');
        });
    });
}

// Inicializar el cursor cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', createCustomCursor);








