document.addEventListener('DOMContentLoaded', () => {
    const wheel = document.querySelector('.scientists-grid');
    const cards = document.querySelectorAll('.scientist-card');
    
    // Elementos para la animación de entrada
    const scientistElements = {
        panelTitle: document.querySelector('.scientists-section .panel-title'),
        panelTexts: document.querySelectorAll('.scientists-section .texto-grande'),
        scientistsGrid: document.querySelector('.scientists-grid'),
        indicaciones: document.querySelector('.indicaciones-wrapper')
    };

    // Configuración inicial de opacidad
    gsap.set([scientistElements.panelTitle, ...scientistElements.panelTexts], {
        opacity: 0,
        y: 30
    });

    // La grid y las indicaciones tienen opacidad y scale inicial
    gsap.set([scientistElements.scientistsGrid, scientistElements.indicaciones], {
        opacity: 0,
        scale: 0.95
    });

    // Timeline para la scientist section
    gsap.timeline({
        scrollTrigger: {
            trigger: ".scientists-section",
            start: "top center",
            toggleActions: "play none none none",
            onEnter: async () => {
                // 1. Primero hacer visible el título y aplicar typewriter
                gsap.set(scientistElements.panelTitle, { 
                    opacity: 1,
                    y: 0
                });
                const titleText = scientistElements.panelTitle.innerHTML;
                scientistElements.panelTitle.innerHTML = '';
                await typewriterEffect(scientistElements.panelTitle, titleText, 20);
                
                // 2. Crear timeline para las animaciones secuenciales
                const tl = gsap.timeline();
                
                // Animar los textos con stagger
                tl.to(scientistElements.panelTexts, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.4,
                    ease: "power2.out"
                })
                // Animar grid e indicaciones inmediatamente después
                .to([scientistElements.scientistsGrid, scientistElements.indicaciones], {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    ease: "power2.out",
                    onComplete: () => {
                        if (!hasInteracted) {
                            mouseAnimation.play();
                        }
                    }
                }, "<+0.8"); 
            }
        }
    });

    // Función typewriter
    function typewriterEffect(element, text, speed = 30) {
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

    let momentum = 0;
    let position = 0;
    let radius = calculateRadius();
    let isDragging = false;
    let startX = 0;
    let currentX = 0;

    // Calcular radio basado en el viewport
    function calculateRadius() {
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Ajustamos el radio según el tamaño de pantalla
        if (viewportWidth <= 768) {
            return Math.min(viewportHeight * 0.3, viewportWidth * 0.4); // Más pequeño en móviles
        } else if (viewportWidth <= 1024) {
            return Math.min(viewportHeight * 0.35, viewportWidth * 0.45); // Tamaño medio en tablets
        } else {
            return Math.min(viewportHeight * 0.4, 325); // Tamaño normal en desktop
        }
    }

    function initializeWheel() {
        wheel.style.bottom = `-${radius}px`;
        wheel.style.height = `${radius * 2}px`;

        const initialRotation = position;

        cards.forEach((card, index) => {
            const angle = (index / cards.length) * 360 + initialRotation;
            positionCard(card, angle);
        });

        // Inicializar el indicador en la misma dirección
        const wheelIndicator = document.querySelector('.wheel-indicator');
        if (wheelIndicator) {
            wheelIndicator.style.transform = `translate(-50%, -50%) rotate(${initialRotation}deg)`;
        }
    }

    function positionCard(card, angle) {
        const radian = (angle * Math.PI) / 180;
        
        // Calculamos si la card está en el centro (ángulo cercano a 0 o 360)
        const normalizedAngle = ((angle % 360) + 360) % 360;
        const isCenter = normalizedAngle < 30 || normalizedAngle > 330;
        
        // Aplicamos una escala mayor si la card está en el centro
        const scale = isCenter ? 1.2 : 1;
        
        card.style.transform = `
            translate(-50%, -50%)
            rotate(${angle}deg)
            translate(0, ${-radius}px)
            rotate(${-angle}deg)
            scale(${scale})
        `;

        // Ajustamos el z-index para que la card central esté por encima
        card.style.zIndex = isCenter ? '4' : '1';
    }

    function snapToNearestCard() {
        const cardAngle = 360 / cards.length;
        const currentAngle = position % 360;
        const targetCard = Math.round(currentAngle / cardAngle);
        const targetAngle = targetCard * cardAngle;
        
        const correction = targetAngle - currentAngle;
        if (Math.abs(momentum) < 0.1) {
            const smoothCorrection = correction * Math.min(0.15, Math.abs(correction) / 150);
            position += smoothCorrection;
        }
    }

    function update() {
        momentum *= 0.96;
        
        // Ajustamos la posición para que se mueva en incrementos más definidos
        const cardAngle = 360 / cards.length;
        const positionDelta = momentum * 0.2;
        
        // Actualizamos la posición
        position += positionDelta;

        if (Math.abs(momentum) < 1) {
            snapToNearestCard();
        }

        const currentRotation = position;

        cards.forEach((card, index) => {
            const angle = (index / cards.length) * 360 + currentRotation;
            positionCard(card, angle);
        });

        // Actualizar la rotación del indicador
        const wheelIndicator = document.querySelector('.wheel-indicator');
        if (wheelIndicator) {
            wheelIndicator.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;
        }

        updateActiveIndicator(currentRotation);

        requestAnimationFrame(update);
    }

    function updateActiveIndicator(currentPosition) {
        const circles = document.querySelectorAll('.indicator-circle');
        const cardAngle = 360 / cards.length;
        const normalizedPosition = ((currentPosition % 360) + 360) % 360;
        
        circles.forEach((circle, index) => {
            const circleAngle = (index * cardAngle + 360) % 360;
            const diff = Math.abs(normalizedPosition - circleAngle);
            
            // Solo aplicamos cambios si hay momentum (durante el scroll)
            if (Math.abs(momentum) > 0.1) {
                const direction = Math.sign(momentum);
                let isActive = false;
                
                if (direction > 0) {
                    // Movimiento horario
                    isActive = (diff < cardAngle / 2) || 
                              (diff > (360 - cardAngle / 2)) ||
                              (circleAngle > normalizedPosition && 
                               circleAngle <= normalizedPosition + cardAngle * 2);
                } else {
                    // Movimiento antihorario
                    isActive = (diff < cardAngle / 2) || 
                              (diff > (360 - cardAngle / 2)) ||
                              (circleAngle < normalizedPosition && 
                               circleAngle >= normalizedPosition - cardAngle * 2);
                }
                
                // Aplicar opacidad gradual durante el movimiento
                if (isActive) {
                    const distance = Math.abs(diff);
                    const opacity = 1 - (distance / (cardAngle * 2));
                    circle.style.opacity = Math.max(0.3, opacity);
                } else {
                    circle.style.opacity = 0.3;
                }
            } else {
                // Cuando no hay momentum, todos los círculos tienen la misma opacidad
                circle.style.opacity = 0.3;
            }
        });
    }

    function handleWheel(e) {
        // Si el viewport es menor a 480px, no procesar el evento wheel
        if (window.innerWidth <= 480) {
            return;
        }

        e.preventDefault();
        const cardAngle = 360 / cards.length;
        const scrollSpeed = 0.02;
        
        let newMomentum = e.deltaY * scrollSpeed;
        
        if (Math.abs(newMomentum) > 0.1) {
            momentum += newMomentum * (cardAngle / 30);
            const maxMomentum = 8;
            momentum = Math.max(Math.min(momentum, maxMomentum), -maxMomentum);
        }
    }

    // Manejar resize de ventana
    function handleResize() {
        radius = calculateRadius();
        initializeWheel();
    }

    // Event listeners
    window.addEventListener('resize', debounce(handleResize, 250));
    wheel.addEventListener('wheel', handleWheel, { passive: false });

    // Función debounce para evitar muchas llamadas durante el resize
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Añadir después de los event listeners existentes
    const scientistData = {
        'James Frank': {
            firstName: 'James',
            lastName: 'Frank',
            colorClass: 'green',
            quote: 'El informe Franck',
            description: '<p>Franck era un científico de renombre que había huido de la Alemania nazi debido a su origen judío. Su <strong class="green">experiencia personal le había sensibilizado ante las atrocidades de la guerra</strong>, y estaba profundamente preocupado por las implicaciones morales de su trabajo.</p>'+
            '<p>El <strong class="green">informe Franck </strong>que entregó en 1945 junto a otos científicos al presidente Truman,representó una de las <strong class="green">primeras expresiones públicas de disidencia</strong> dentro del Proyecto Manhattan.</p>'
        },
        'J.R Oppenheimer': {
            firstName: 'J.R',
            lastName: 'Oppenheimer',
            colorClass: 'blue',
            quote: '"Ahora soy <span>la Muerte</span>, el <span>destructor de mundos</span>"',
            description: '<p>Oppenheimer era un hombre <strong class="blue">profundamente enamorado de la ciencia.</strong></p>' + 
                        '<p>Sin embargo, al ver cómo su trabajo se había convertido en un arma de destrucción masiva, <strong class="blue">experimentó una gran disonancia cognitiva.</strong> Lo que él consideraba como la belleza de la física nuclear se había transformado en una pesadilla.</p>' + 
                        '<p>A medida que se acercaba el final de la guerra, Oppenheimer comenzó a cuestionar si era moralmente <strong class="blue">justificable utilizar un arma tan destructiva,</strong> incluso para acortar el conflicto y salvar vidas. La posibilidad de una carrera armamentista y la amenaza de una <strong class="blue">guerra nuclear global lo aterrorizaban.</strong></p>'
        },
        'Leo Szilard': {
            firstName: 'Leo',
            lastName: 'Szilard',
            colorClass: 'red',
            quote: '"La carrera armamentista nuclear es una <span>amenaza existencial</span> para la humanidad"',
            description: '<p>Uno de los principales impulsores del Proyecto Manhattan, Szilard posteriormente se convirtió en un ferviente defensor del control de las armas nucleares. Su visión pesimista sobre la naturaleza humana y su temor a una guerra nuclear lo llevaron a abogar por la <strong class="red">cooperación internacional en materia de desarme.</strong></p>' +
            '<p>Tras la guerra, Szilard se dedicó a promover el control de las armas nucleares y a fomentar el uso pacífico de la energía atómica. Fundó el Consejo para un Mundo Vivible, una <strong class="red">organización dedicada a reducir la amenaza de las armas nucleares.</strong></p>'
        },
        'Albert Einstein': {
            firstName: 'Albert',
            lastName: 'Einstein',
            colorClass: 'green',
            quote: '"El mundo es un lugar peligroso de vivir, no por aquellos que hacen el mal, sino por aquellos que se sientan y permiten que suceda.',
            description: '<p>Einstein era consciente de que los descubrimientos científicos tenían un <strong class="green">impacto directo en la sociedad.</strong> La famosa ecuación E=mc², que sentó las bases para el desarrollo de la energía nuclear, fue un claro ejemplo de cómo un avance científico podía tener <strong class="green">consecuencias tanto beneficiosas como devastadoras.</strong></p>'+
            '<p>Para Einstein, los científicos tenían una responsabilidad especial de <strong class="green">advertir sobre los posibles peligros de sus descubrimientos</strong> y de trabajar para garantizar que la ciencia se utilizara de manera ética y responsable.</p>'
        },
        'Rychard Feynman': {
            firstName: 'Rychard',
            lastName: 'Feynman',
            colorClass: 'blue',
            quote: '"Un instrumento del mal, como si hubiesemos descendido a las zonas más oscuras del infierno"',
            description: '<p>Feynman se involucró en el Proyecto Manhattan con la convicción de que estaba contribuyendo a un esfuerzo mayor: <strong class="blue">derrotar al nazismo y acortar la Segunda Guerra Mundial.</strong> Sin embargo, a medida que el proyecto avanzaba y se acercaba su culminación, Feynman comenzó a experimentar dudas y a cuestionar las implicaciones morales de su trabajo.</p>'+
            '<p>Feynman dedicó gran parte de su vida a la <strong class="blue">enseñanza y la divulgación científica,</strong> siempre buscando transmitir su pasión por la física y su comprensión de la naturaleza. En sus reflexiones sobre el Proyecto Manhattan, Feynman destacó la importancia de la responsabilidad social de los cientficos y la necesidad de considerar las consecuencias de sus descubrimientos.</p>'
        },
        'Enrico Fermi': {
            firstName: 'Enrico',
            lastName: 'Fermi',
            colorClass: 'red',
            quote: 'El padre de la era nuclear',
            description: '<p>Fermi fue una figura clave en el desarrollo de la energía nuclear, siendo el primer científico en lograr una <strong class="red">reacción nuclear en cadena controlada.</strong> Su inteligencia y liderazgo fueron fundamentales para el éxito del Proyecto Manhattan.</p>'+
            '<p>Fermi era conocido por su <strong class="red">cautela y su capacidad para evaluar los riesgos.</strong> Aunque no expresó públicamente sus dudas con la misma vehemencia que otros científicos, su preocupación por las consecuencias de la energía nuclear era evidente para quienes lo conocían.</p>'
        }
        
    };

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const name = card.querySelector('.scientist-name').textContent;
            const imgSrc = card.querySelector('img.image-hover').src;
            const data = scientistData[name];

            if (data) {
                showModal(name, imgSrc, data.quote, data.description);
            }
        });
    });

    function showModal(name, imgSrc, quote, description) {
        const modal = document.querySelector('.scientist-modal');
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        isModalOpen = true;
        // Mantener el video visible
        scientistsSection.style.backgroundColor = 'transparent';
        video.style.opacity = '1';
        
        // Actualizar contenido del modal
        updateModalContent(name, imgSrc, quote, description);
        
        document.body.appendChild(overlay);
        modal.style.display = 'block';
        
        setupNavigation(name);
        
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.onclick = () => closeModal(modal, overlay);
        overlay.onclick = () => closeModal(modal, overlay);
    }

    function updateModalContent(name, imgSrc, quote, description) {
        const modal = document.querySelector('.scientist-modal');
        const scientist = scientistData[name];
        
        modal.querySelector('.modal-img').src = imgSrc;
        modal.querySelector('.modal-name').innerHTML = 
        `<span class="first-name ${scientist.colorClass}">${scientist.firstName}</span> 
         <span class="last-name ${scientist.colorClass}">${scientist.lastName}</span>`;
        modal.querySelector('.quote-text').innerHTML = quote;
        modal.querySelector('.modal-description').innerHTML = description;
    }

    function setupNavigation(currentName) {
        const modal = document.querySelector('.scientist-modal');
        const scientistNames = Object.keys(scientistData);
        const currentIndex = scientistNames.indexOf(currentName);
        
        const prevIndex = (currentIndex - 1 + scientistNames.length) % scientistNames.length;
        const nextIndex = (currentIndex + 1) % scientistNames.length;
        
        const prevScientist = scientistData[scientistNames[prevIndex]];
        const nextScientist = scientistData[scientistNames[nextIndex]];
        
        // Actualizar nombres de navegación
        modal.querySelector('.prev-name').className = `prev-name ${prevScientist.colorClass}`;
    modal.querySelector('.next-name').className = `next-name ${nextScientist.colorClass}`;
    
    modal.querySelector('.prev-name').textContent = 
        `${prevScientist.firstName} ${prevScientist.lastName}`;
    modal.querySelector('.next-name').textContent = 
        `${nextScientist.firstName} ${nextScientist.lastName}`;
    
    modal.querySelector('.nav-prev').onclick = () => navigateToScientist(scientistNames[prevIndex]);
    modal.querySelector('.nav-next').onclick = () => navigateToScientist(scientistNames[nextIndex]);
    }

    function navigateToScientist(name) {
        const card = Array.from(cards).find(card => 
            card.querySelector('.scientist-name').textContent === name
        );
        const imgSrc = card.querySelector('img.image-hover').src;
        const data = scientistData[name];
        
        updateModalContent(name, imgSrc, data.quote, data.description);
        setupNavigation(name);
    }

    function closeModal(modal, overlay) {
        modal.style.display = 'none';
        overlay.remove();
        isModalOpen = false;
        
        // Ocultar el video al cerrar el modal
        scientistsSection.style.backgroundColor = 'var(--blue-details)';
        video.style.opacity = '0';
    }

    // Añadir manejo del video de fondo
    const video = document.querySelector('.background-video');
    const scientistsSection = document.querySelector('.scientists-section');
    let hoverTimeout;
    let isModalOpen = false;

    // Iniciar el video cuando se carga la página
    video.play();

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!isModalOpen) {
                clearTimeout(hoverTimeout);
                scientistsSection.style.backgroundColor = 'transparent';
                video.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (!isModalOpen) {
                hoverTimeout = setTimeout(() => {
                    scientistsSection.style.backgroundColor = 'var(--blue-details)';
                    video.style.opacity = '0';
                }, 300);
            }
        });
    });

    // Inicializar
    initializeWheel();
    update();

    // Añadir después de la declaración de scientistData
    // Inicializar los colores de las cards
    function initializeCardColors() {
        cards.forEach(card => {
            const name = card.querySelector('.scientist-name').textContent;
            const scientist = scientistData[name];
            if (scientist) {
                card.querySelector('.scientist-name').className = 
                    `scientist-name ${scientist.colorClass}`;
            }
        });
    }

    // Llamar a la función después de definir scientistData
    initializeCardColors();

    function handleMouseDown(e) {
        isDragging = true;
        startX = e.clientX || e.touches[0].clientX;
        currentX = startX;
        wheel.style.cursor = 'grabbing';
    }

    function handleMouseMove(e) {
        if (!isDragging) return;
        
        const x = e.clientX || e.touches[0].clientX;
        const deltaX = x - currentX;
        currentX = x;
        
        // Ajustar la sensibilidad según el tamaño de pantalla
        const sensitivity = window.innerWidth <= 480 ? 0.15 : 0.1;
        
        // Convertir el movimiento horizontal en rotación
        const cardAngle = 360 / cards.length;
        momentum = deltaX * sensitivity;
        position += momentum * (cardAngle / 30);
    }

    function handleMouseUp() {
        isDragging = false;
        wheel.style.cursor = 'grab';
    }

    // Event listeners para arrastrar
    wheel.addEventListener('mousedown', handleMouseDown);
    wheel.addEventListener('mousemove', handleMouseMove);
    wheel.addEventListener('mouseup', handleMouseUp);
    wheel.addEventListener('mouseleave', handleMouseUp);

    // Soporte para dispositivos táctiles
    wheel.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleMouseDown(e);
    }, { passive: false });

    wheel.addEventListener('touchmove', (e) => {
        e.preventDefault();
        handleMouseMove(e);
    }, { passive: false });

    wheel.addEventListener('touchend', handleMouseUp);

    // Configurar animación Lottie
    const mouseAnimation = lottie.loadAnimation({
        container: document.querySelector('.mouse-animation'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'img/mouse-move/data.json',
        assetsPath: 'img/mouse-move/'
    });

    // Función para detectar si es dispositivo móvil
    const isMobile = () => window.innerWidth <= 768;

    // Detectar rotación de las cards
    const scientistsGrid = document.querySelector('.scientists-grid');
    if (scientistsGrid) {
        let hasInteracted = false;
        let initialPosition = 0;

        // Para dispositivos móviles
        if (window.innerWidth <= 480) {
            let touchStartX = 0;
            
            scientistsGrid.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                handleMouseDown(e);
            });

            scientistsGrid.addEventListener('touchmove', (e) => {
                if (!hasInteracted) {
                    const touchDelta = Math.abs(e.touches[0].clientX - touchStartX);
                    if (touchDelta > 10) {
                        hasInteracted = true;
                        mouseAnimation.stop();
                    }
                }
                handleMouseMove(e);
            });

            scientistsGrid.addEventListener('touchend', () => {
                handleMouseUp();
            });
        }

        // Para desktop
        else {
            // Detectar uso del wheel (scroll) en la grid
            scientistsGrid.addEventListener('wheel', (e) => {
                if (!hasInteracted && Math.abs(e.deltaY) > 0) {
                    hasInteracted = true;
                    mouseAnimation.stop();
                }
            });

            // Detectar arrastre del mouse
            let isDragging = false;
            let startX = 0;

            scientistsGrid.addEventListener('mousedown', (e) => {
                isDragging = true;
                startX = e.clientX;
            });

            scientistsGrid.addEventListener('mousemove', (e) => {
                if (isDragging && !hasInteracted) {
                    const dragDelta = Math.abs(e.clientX - startX);
                    if (dragDelta > 10) { // Umbral de arrastre
                        hasInteracted = true;
                        mouseAnimation.stop();
                    }
                }
            });

            scientistsGrid.addEventListener('mouseup', () => {
                isDragging = false;
            });

            scientistsGrid.addEventListener('mouseleave', () => {
                isDragging = false;
            });
        }

        // Opcional: Reiniciar la animación si se sale de la sección
        document.addEventListener('scroll', () => {
            const scientistsSection = document.querySelector('.scientists-section');
            const rect = scientistsSection.getBoundingClientRect();
            
            // Si la sección no está visible
            if (rect.bottom < 0 || rect.top > window.innerHeight) {
                hasInteracted = false;
                mouseAnimation.play();
            }
        });
    }

    // Manejar cambios de tamaño de ventana
    window.addEventListener('resize', debounce(() => {
        const wasMobile = isMobile();
        if (wasMobile !== isMobile()) {
            location.reload(); // Recargar para aplicar el comportamiento correcto
        }
    }, 250));
});