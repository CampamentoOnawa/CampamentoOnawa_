/* =============================================
   GALERÍA LIGHTBOX — js/galeria.js
   ============================================= */

(function () {
    'use strict';

    const lightbox  = document.getElementById('galeriaLightbox');
    const lbImg     = document.getElementById('galeriaLbImg');
    const lbCaption = document.getElementById('galeriaLbCaption');
    const lbCounter = document.getElementById('galeriaLbCounter');
    const lbClose   = document.getElementById('galeriaLbClose');
    const lbPrev    = document.getElementById('galeriaLbPrev');
    const lbNext    = document.getElementById('galeriaLbNext');

    if (!lightbox) return;

    const items = Array.from(document.querySelectorAll('.galeria__item'));
    if (items.length === 0) return;

    let current = 0;
    let touchX  = 0;

    /* ── Helpers ──────────────────────────────────── */

    function getItemData(item) {
        const img = item.querySelector('img');
        const cap = item.querySelector('.galeria__caption');
        return {
            src: img ? img.src : '',
            alt: img ? img.alt : '',
            caption: cap ? cap.textContent : ''
        };
    }

    function showImage(index) {
        current = index;
        const data = getItemData(items[index]);

        // Fade out
        lbImg.classList.add('galeria-lightbox__img--loading');

        setTimeout(() => {
            lbImg.src = data.src;
            lbImg.alt = data.alt;
            if (lbCaption) lbCaption.textContent = data.caption;
            if (lbCounter) lbCounter.textContent = `${index + 1} / ${items.length}`;
        }, 160);
    }

    lbImg.addEventListener('load', () => {
        lbImg.classList.remove('galeria-lightbox__img--loading');
    });

    /* ── Open / Close ────────────────────────────── */

    function open(index) {
        showImage(index);
        lightbox.classList.add('galeria-lightbox--active');
        document.body.style.overflow = 'hidden';
    }

    function close() {
        lightbox.classList.remove('galeria-lightbox--active');
        document.body.style.overflow = '';
    }

    function prev() {
        showImage((current - 1 + items.length) % items.length);
    }

    function next() {
        showImage((current + 1) % items.length);
    }

    /* ── Event Listeners ─────────────────────────── */

    // Click on grid items
    items.forEach((item, i) => {
        item.addEventListener('click', () => open(i));
    });

    // Controls
    lbClose.addEventListener('click', close);
    lbPrev.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
    lbNext.addEventListener('click', (e) => { e.stopPropagation(); next(); });

    // Backdrop click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('galeria-lightbox--active')) return;
        if (e.key === 'Escape')     close();
        if (e.key === 'ArrowLeft')  prev();
        if (e.key === 'ArrowRight') next();
    });

    // Touch / swipe in lightbox
    lightbox.addEventListener('touchstart', (e) => {
        touchX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        const dx = touchX - e.changedTouches[0].screenX;
        if (Math.abs(dx) > 50) {
            dx > 0 ? next() : prev();
        }
    }, { passive: true });

})();
