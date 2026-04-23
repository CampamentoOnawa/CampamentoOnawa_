/* =============================================
   CAMPAMENTO ONAWA — Parallax Effects
   Lightweight, pure JS, performance-first
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    const heroImg = document.querySelector('.hero__bg-img');
    const heroContent = document.querySelector('.hero__content');
    const heroScroll = document.querySelector('.hero__scroll-indicator');
    const investmentBg = document.querySelector('.investment__bg-img');

    let ticking = false;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function updateParallax() {
        const scrollY = window.scrollY;
        const windowH = window.innerHeight;

        // Hero parallax — only when hero is visible
        if (scrollY < windowH * 1.2) {
            if (heroImg) {
                const offset = scrollY * 0.3;
                heroImg.style.transform = `scale(1.1) translateY(${offset}px)`;
            }

            if (heroContent) {
                const contentOffset = scrollY * 0.45;
                const opacity = 1 - (scrollY / (windowH * 0.55));
                heroContent.style.transform = `translateY(-${contentOffset}px)`;
                heroContent.style.opacity = Math.max(0, opacity);
            }

            if (heroScroll) {
                const scrollOpacity = 1 - (scrollY / (windowH * 0.2));
                heroScroll.style.opacity = Math.max(0, scrollOpacity);
            }
        }

        // Investment background parallax
        if (investmentBg) {
            const section = investmentBg.closest('.investment');
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top < windowH && rect.bottom > 0) {
                    const progress = (windowH - rect.top) / (windowH + rect.height);
                    const bgOffset = (progress - 0.5) * 50;
                    investmentBg.style.transform = `translateY(${bgOffset}px)`;
                }
            }
        }

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    if (!prefersReducedMotion.matches) {
        window.addEventListener('scroll', onScroll, { passive: true });
        updateParallax();
    }

    prefersReducedMotion.addEventListener('change', (e) => {
        if (e.matches) {
            window.removeEventListener('scroll', onScroll);
            if (heroImg) heroImg.style.transform = 'scale(1.1)';
            if (heroContent) { heroContent.style.transform = ''; heroContent.style.opacity = ''; }
        } else {
            window.addEventListener('scroll', onScroll, { passive: true });
        }
    });
});
