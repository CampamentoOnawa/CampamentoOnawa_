/* =============================================
   CAMPAMENTO ONAWA — Main JavaScript V3
   Pure JS — No external libraries
   Starfield (scoped), Lamp Cursor, Random Hero,
   Counters, Scroll Reveals, Micro-interactions
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ─── Hero image carousel handled by js/hero-carousel.js ─


    // ─── Navigation is now handled by js/drawer.js ─
    const siteLogo = document.getElementById('siteLogo');

    // Scroll: logo shrink + ocultar scroll indicator del hero
    const heroScrollIndicator = document.getElementById('heroScrollDown');

    window.addEventListener('scroll', () => {
        const sy = window.scrollY;
        if (siteLogo) siteLogo.classList.toggle('site-logo--scrolled', sy > 60);
        if (heroScrollIndicator) {
            heroScrollIndicator.classList.toggle('hero__scroll-indicator--hidden', sy > 80);
        }
    }, { passive: true });

    const aboutSection = document.querySelector('.about');

    // ─── Enhanced Starfield Canvas ───
    const canvas = document.getElementById('starfield');

    if (canvas && aboutSection && !prefersReducedMotion) {
        const ctx = canvas.getContext('2d');
        let stars = [];
        let shootingStars = [];
        let animFrame;
        let isStarfieldVisible = false;

        function resizeCanvas() {
            canvas.width = aboutSection.offsetWidth;
            canvas.height = aboutSection.offsetHeight;
        }

        function createStars() {
            stars = [];
            const area = canvas.width * canvas.height;
            const count = Math.min(Math.floor(area / 8000), 150);
            for (let i = 0; i < count; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.2 + 0.3,
                    baseAlpha: Math.random() * 0.4 + 0.15,
                    alpha: 0,
                    speed: Math.random() * 0.002 + 0.001,
                    phase: Math.random() * Math.PI * 2,
                });
            }
        }

        function spawnShootingStar() {
            if (shootingStars.length > 2) return;
            shootingStars.push({
                x: Math.random() * canvas.width * 0.6,
                y: Math.random() * canvas.height * 0.3,
                vx: 5 + Math.random() * 4,
                vy: 2 + Math.random() * 2.5,
                life: 1,
                decay: 0.012 + Math.random() * 0.008,
                length: 50 + Math.random() * 40
            });
        }

        let time = 0;
        function drawStars() {
            if (!isStarfieldVisible) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            time += 0.016;

            for (let i = 0; i < stars.length; i++) {
                const s = stars[i];
                // Gentle twinkling only
                s.alpha = s.baseAlpha + Math.sin(time * s.speed * 60 + s.phase) * 0.15;
                s.alpha = Math.max(0, Math.min(1, s.alpha));

                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(220, 215, 205, ${s.alpha})`;
                ctx.fill();
            }

            // Shooting stars
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const ss = shootingStars[i];
                ss.x += ss.vx;
                ss.y += ss.vy;
                ss.life -= ss.decay;

                if (ss.life <= 0) {
                    shootingStars.splice(i, 1);
                    continue;
                }

                const gradient = ctx.createLinearGradient(
                    ss.x, ss.y,
                    ss.x - ss.vx * ss.length / 5, ss.y - ss.vy * ss.length / 5
                );
                gradient.addColorStop(0, `rgba(255, 245, 230, ${ss.life * 0.8})`);
                gradient.addColorStop(1, 'rgba(255, 245, 230, 0)');

                ctx.beginPath();
                ctx.moveTo(ss.x, ss.y);
                ctx.lineTo(ss.x - ss.vx * ss.length / 5, ss.y - ss.vy * ss.length / 5);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1.2;
                ctx.stroke();
            }

            animFrame = requestAnimationFrame(drawStars);
        }

        resizeCanvas();
        createStars();

        // Occasional shooting stars
        setInterval(() => {
            if (isStarfieldVisible && Math.random() > 0.5) spawnShootingStar();
        }, 4000);

        // Visibility observer
        const starfieldObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    isStarfieldVisible = true;
                    drawStars();
                } else {
                    isStarfieldVisible = false;
                    cancelAnimationFrame(animFrame);
                }
            });
        }, { threshold: 0.05 });

        starfieldObserver.observe(aboutSection);

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resizeCanvas();
                createStars();
            }, 250);
        });

        // Pause when tab hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                isStarfieldVisible = false;
                cancelAnimationFrame(animFrame);
            } else if (aboutSection.getBoundingClientRect().top < window.innerHeight) {
                isStarfieldVisible = true;
                drawStars();
            }
        });
    }


    // ─── Hero Text Reveal ───────────────────────
    const heroElements = document.querySelectorAll('.reveal-up');
    heroElements.forEach(el => {
        const delay = parseFloat(el.dataset.delay) || 0;
        el.style.transitionDelay = delay + 's';
        setTimeout(() => {
            el.classList.add('revealed');
        }, 100);
    });


    // ─── Scroll Reveal with IntersectionObserver ─
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseFloat(entry.target.dataset.delay || 0) * 1000;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    scrollRevealElements.forEach(el => revealObserver.observe(el));

    // ─── Hoja de Ruta: chips "Actualmente contamos con" — animación al entrar en viewport ───
    const amenitiesSection = document.getElementById('amenitiesSection');
    if (amenitiesSection && !prefersReducedMotion) {
        const isMobileView = () => window.innerWidth < 768;
        const amenitiesObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    amenitiesSection.classList.add('amenities--in-view');
                    amenitiesObserver.unobserve(amenitiesSection);
                }
            });
        }, {
            threshold: isMobileView() ? 0.06 : 0.12,
            rootMargin: isMobileView() ? '0px 0px 30px 0px' : '0px 0px -20px 0px'
        });
        amenitiesObserver.observe(amenitiesSection);
    }
    const visionSection = document.getElementById('vision');
    const visionForestBg = document.querySelector('.vision__forest-bg');

    if (visionSection && visionForestBg && !prefersReducedMotion) {
        window.addEventListener('scroll', () => {
            const rect = visionSection.getBoundingClientRect();
            // Only animate if section is visible in viewport
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                // Calculate scroll progress through the section
                const scrollProgress = 1 - (rect.bottom / (window.innerHeight + rect.height));
                // Move background down slightly (parallax) and blur it as we scroll deep into the timeline
                const yOffset = scrollProgress * 150;
                const blurAmount = Math.max(0, scrollProgress * 4);

                visionForestBg.style.transform = `translateY(${yOffset}px) scale(1.1)`;
                visionForestBg.style.filter = `blur(${blurAmount}px)`;
            }
        }, { passive: true });
    }

    // ─── Hoja de Ruta: línea progresiva + activación de nodos al hacer scroll ───
    const roadmapTimeline = document.getElementById('roadmapTimeline');
    const timelineTrailProgress = document.getElementById('timelineTrailProgress');
    const visionSectionForTimeline = document.getElementById('vision');

    if (roadmapTimeline && timelineTrailProgress && visionSectionForTimeline && !prefersReducedMotion) {
        let trailTicking = false;

        function updateTimelineTrailProgress() {
            const rect = visionSectionForTimeline.getBoundingClientRect();
            const wh = window.innerHeight;
            // Progreso 0→1 al recorrer la sección visión (donde está el timeline)
            const raw = (wh - rect.top) / (wh + rect.height);
            const progress = Math.min(Math.max(raw, 0), 1);
            const percent = Math.round(progress * 100);
            timelineTrailProgress.style.height = percent + '%';
            trailTicking = false;
        }

        function onScrollTimeline() {
            if (trailTicking) return;
            trailTicking = true;
            requestAnimationFrame(updateTimelineTrailProgress);
        }

        const timelineSectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) updateTimelineTrailProgress();
            });
        }, { threshold: 0 });
        timelineSectionObserver.observe(visionSectionForTimeline);
        window.addEventListener('scroll', onScrollTimeline, { passive: true });
    }

    // Activar nodos de la hoja de ruta cuando cada etapa entra en viewport
    const timelineItems = document.querySelectorAll('.timeline__item');
    if (timelineItems.length && !prefersReducedMotion) {
        const nodeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const node = entry.target.querySelector('.timeline__node');
                if (node) {
                    if (entry.isIntersecting) {
                        node.classList.add('timeline__node--in-view');
                    } else {
                        node.classList.remove('timeline__node--in-view');
                    }
                }
            });
        }, { threshold: 0.25, rootMargin: '0px 0px -15% 0px' });

        timelineItems.forEach(function (item) {
            nodeObserver.observe(item);
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const targetPos = target.getBoundingClientRect().top + window.scrollY - 20;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });






    // ─── Vision Section — Scroll-Reactive Gradient ─────
    const visionEl = document.getElementById('vision');
    const aurora = document.getElementById('visionAurora');
    const orbs = document.getElementById('visionOrbs');

    if (visionEl && aurora && orbs && !prefersReducedMotion) {
        let visionActive = false;
        let ticking = false;

        function updateVisionLayers() {
            const rect = visionEl.getBoundingClientRect();
            const wh = window.innerHeight;

            // progress 0→1 as user scrolls through the section
            const raw = (wh - rect.top) / (wh + rect.height);
            const p = Math.min(Math.max(raw, 0), 1);

            // Smoothed easing for organic feel
            const smooth = p * p * (3 - 2 * p); // smoothstep

            // Aurora: fades in from 0→1, shifts up 80px
            aurora.style.opacity = (smooth * 1).toFixed(3);
            aurora.style.transform = 'translateY(' + (smooth * -80).toFixed(1) + 'px) scale(' + (1 + smooth * 0.05).toFixed(3) + ')';

            // Orbs: delayed fade (starts at 20% scroll), drifts up 50px
            const orbP = Math.min(Math.max((p - 0.15) / 0.85, 0), 1);
            const orbSmooth = orbP * orbP * (3 - 2 * orbP);
            orbs.style.opacity = (orbSmooth * 0.9).toFixed(3);
            orbs.style.transform = 'translateY(' + (orbSmooth * -50).toFixed(1) + 'px)';

            ticking = false;
        }

        function onVisionScroll() {
            if (!visionActive || ticking) return;
            ticking = true;
            requestAnimationFrame(updateVisionLayers);
        }

        const visionObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                visionActive = e.isIntersecting;
                if (visionActive) onVisionScroll();
            });
        }, { threshold: 0 });
        visionObs.observe(visionEl);

        window.addEventListener('scroll', onVisionScroll, { passive: true });
    }
});
