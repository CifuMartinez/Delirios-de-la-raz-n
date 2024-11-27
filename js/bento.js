document.addEventListener('DOMContentLoaded', () => {
    const cajas = document.querySelectorAll('.parent > div');
    let cajaActiva = null;
    const bentoSection = document.querySelector('.bento-section');
    
    // Configuración inicial
    gsap.set(cajas, {
        opacity: 0,
        y: 100 
    });

    // Función para manejar el scroll en móvil
    function handleMobileScroll() {
        if (window.innerWidth <= 480) {
            const bentoRect = bentoSection.getBoundingClientRect();
            
            // Si la sección está visible
            if (bentoRect.top <= 0 && bentoRect.bottom >= 0) {
                bentoSection.style.overflowY = 'auto';
                document.body.style.overflow = 'hidden';
            } else {
                bentoSection.style.overflowY = 'hidden';
                document.body.style.overflow = '';
            }
        }
    }

    // ScrollTrigger para la animación y el scroll móvil
    ScrollTrigger.create({
        trigger: ".bento-section",
        start: "top center",
        end: "bottom top",
        onEnter: () => {
            // Animación de entrada de las cajas
            gsap.to(cajas, {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: {
                    amount: 0.8
                },
                ease: "ease.inOut"
            });
            
            // Manejar scroll móvil
            handleMobileScroll();
        },
        onLeave: handleMobileScroll,
        onEnterBack: handleMobileScroll,
        onLeaveBack: handleMobileScroll
    });

    // Event listener para el scroll
    window.addEventListener('scroll', handleMobileScroll);

    cajas.forEach(caja => {
        if (caja.classList.contains('caja2') || 
            caja.classList.contains('caja4') || 
            caja.classList.contains('caja7') ||
            caja.classList.contains('caja8')) {
            
            const video = caja.querySelector('video');
            const contentOverlay = caja.querySelector('.content-overlay, .caja2-text');
            const animationContainer = caja.querySelector('.caja2-animation, .caja4-animation, .caja7-animation, .caja8-animation');
            
            video.loop = true; // Asegurar que el video esté en bucle
            
            // Click en la caja
            caja.addEventListener('click', () => {
                // Si hay otra caja activa, resetearla
                if (cajaActiva && cajaActiva !== caja) {
                    resetCajaActiva();
                }

                if (video.paused) {
                    // Reproducir video y mostrar animación
                    handleVideoPlay(video);
                    if (contentOverlay) contentOverlay.style.opacity = '0';
                    if (animationContainer) animationContainer.style.opacity = '1';
                    cajaActiva = caja;
                } else {
                    // Pausar video y ocultar animación
                    handleVideoPause(video, caja);
                    if (contentOverlay) contentOverlay.style.opacity = '1';
                    if (animationContainer) animationContainer.style.opacity = '0';
                    cajaActiva = null;
                }
            });
        } else {
            // Para las cajas con flip
            caja.addEventListener('click', () => {
                if (cajaActiva && cajaActiva !== caja) {
                    resetCajaActiva();
                }
                
                caja.classList.toggle('flip-vertical-left');
                cajaActiva = caja.classList.contains('flip-vertical-left') ? caja : null;
            });
        }
    });

    // Función helper para manejar la reproducción del video
    const handleVideoPlay = (video) => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Video reproduciendo');
                })
                .catch(error => {
                    console.log('Error al reproducir:', error);
                });
        }
    };

    // Función helper para manejar la pausa del video
    const handleVideoPause = (video, caja) => {
        if (!video.paused) {
            video.pause();
            video.currentTime = 0;
        }
    };

    // Función para resetear la caja activa
    const resetCajaActiva = () => {
        if (cajaActiva) {
            const videoActivo = cajaActiva.querySelector('video');
            const contentOverlay = cajaActiva.querySelector('.content-overlay, .caja2-text');
            const animationContainer = cajaActiva.querySelector('.caja2-animation, .caja4-animation, .caja7-animation, .caja8-animation');
            
            if (videoActivo) {
                handleVideoPause(videoActivo, cajaActiva);
                if (contentOverlay) contentOverlay.style.opacity = '1';
                if (animationContainer) animationContainer.style.opacity = '0';
            } else {
                cajaActiva.classList.remove('flip-vertical-left');
            }
            cajaActiva = null;
        }
    };

    // Limpiar event listener cuando sea necesario
    return () => {
        window.removeEventListener('scroll', handleMobileScroll);
    };
});
