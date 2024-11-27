document.addEventListener('DOMContentLoaded', () => {
    const cajas = document.querySelectorAll('.parent > div');
    let cajaActiva = null; // Para rastrear la caja actualmente volteada
    
    // Configuración inicial de las cajas (ocultas)
    gsap.set(cajas, {
        opacity: 0,
        y: 100 
    });

    // Animación de entrada con ScrollTrigger
    gsap.to(cajas, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: {
            amount: 0.8 // Tiempo total para que aparezcan todas las cajas
        },
        ease: "ease.inOut",
        scrollTrigger: {
            trigger: ".bento-section",
            start: "top center",
            toggleActions: "play none none none"
        }
    });
    
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
});
