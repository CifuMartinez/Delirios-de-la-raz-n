document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const legadoElements = {
        title: document.querySelector('.legado-section h2'),
        text: document.querySelector('.legado-section .texto-grande'),
        tabs: document.querySelectorAll('.tab')
    };

    // Asegurarse de que ninguna tab tenga la clase 'active' al inicio
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // Configuración inicial
    gsap.set([legadoElements.title, legadoElements.text], {
        opacity: 0,
        y: 30
    });

    // Configuración inicial para las tabs
    gsap.set(legadoElements.tabs, {
        opacity: 0,
        y: 30
    });

    // Timeline para la legado section
    gsap.timeline({
        scrollTrigger: {
            trigger: ".legado-section",
            start: "top center",
            toggleActions: "play none none none",
            onEnter: async () => {
                // 1. Primero hacer visible el título y aplicar typewriter
                gsap.set(legadoElements.title, { 
                    opacity: 1,
                    y: 0
                });
                const titleText = legadoElements.title.innerHTML;
                legadoElements.title.innerHTML = '';
                await typewriterEffect(legadoElements.title, titleText, 20);
                
                // 2. Animar el texto grande
                await gsap.to(legadoElements.text, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });

                // 3. Animar las tabs con stagger
                gsap.to(legadoElements.tabs, {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    stagger: {
                        each: 0.1,
                        ease: "power2.out"
                    }
                });
            }
        }
    });

    // Función para obtener la altura según el tamaño de pantalla
    function getTabHeight() {
        return window.innerWidth <= 520 ? '80px' : '60px';
    }
    
    tabs.forEach(tab => {
        const header = tab.querySelector('.tab-content-grid, .tab-header');
        
        if (header) {
            header.addEventListener('click', () => {
                const isActive = tab.classList.contains('active');
                const tabHeight = getTabHeight();
                
                // Cerrar todas las pestañas con animación
                tabs.forEach(t => {
                    if (t.classList.contains('active')) {
                        const content = t.querySelector('.tab-content-grid');
                        const textColumn = t.querySelector('.text-column');
                        
                        // Primero animamos la opacidad del texto
                        gsap.to(textColumn, {
                            opacity: 0,
                            duration: 0.6,
                            ease: 'power2.inOut'
                        });
                        
                        // Luego animamos la altura
                        gsap.to(content, {
                            height: tabHeight,
                            duration: 0.4,
                            ease: 'power4.inOut',
                            onComplete: () => {
                                t.classList.remove('active');
                            }
                        });
                    }
                });
                
                // Si la pestaña no estaba activa, abrirla con animación
                if (!isActive) {
                    tab.classList.add('active');
                    const content = tab.querySelector('.tab-content-grid');
                    const textColumn = tab.querySelector('.text-column');
                    
                    // Configurar estados iniciales
                    gsap.set(content, { height: tabHeight });
                    gsap.set(textColumn, { opacity: 0 });
                    
                    // Timeline para coordinar las animaciones
                    const tl = gsap.timeline();
                    
                    tl.to(content, {
                        height: 'auto',
                        duration: 0.6,
                        ease: 'power2.out'
                    })
                    .to(textColumn, {
                        opacity: 1,
                        duration: 0.4,
                        ease: 'power2.out'
                    }, "-=0.6");
                }
            });
        }
    });
    
    // Actualizar alturas cuando cambie el tamaño de la ventana
    window.addEventListener('resize', () => {
        const tabHeight = getTabHeight();
        tabs.forEach(tab => {
            if (!tab.classList.contains('active')) {
                const content = tab.querySelector('.tab-content-grid');
                gsap.set(content, { height: tabHeight });
            }
        });
    });
});
