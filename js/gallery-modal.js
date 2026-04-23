/* =============================================
   GALLERY MODAL — Lightbox for Experience Cards
   Shows ALL images from ALL slides in vivencias section
   ============================================= */
(function () {
    'use strict';

    const modal    = document.getElementById('galleryModal');
    const modalImg = document.getElementById('galleryModalImg');
    const modalTitle = document.getElementById('galleryModalTitle');
    const modalDesc  = document.getElementById('galleryModalDesc');
    const closeBtn = document.getElementById('galleryModalClose');
    const prevBtn  = document.getElementById('galleryModalPrev');
    const nextBtn  = document.getElementById('galleryModalNext');
    const counter  = document.getElementById('galleryModalCounter');

    if (!modal) return;

    // ── Build a flat list of ALL images across every slide in every card ──
    const allImages = [];

    // Map each card to the start index of its images (for click-to-open)
    const cardStartIndex = new Map();

    const cards = Array.from(document.querySelectorAll('.experiences__card'));

    cards.forEach((card) => {
        const slides = Array.from(card.querySelectorAll('.experiences__slide'));

        // Record where this card's images begin in the flat list
        cardStartIndex.set(card, allImages.length);

        slides.forEach((slide) => {
            const img = slide.querySelector('img');
            const h3  = slide.querySelector('.experiences__card-overlay h3');
            const p   = slide.querySelector('.experiences__card-overlay p');
            if (img) {
                allImages.push({
                    src:   img.src,
                    alt:   img.alt,
                    title: h3 ? h3.textContent : '',
                    desc:  p  ? p.textContent  : ''
                });
            }
        });
    });

    let currentIndex = 0;
    let touchStartX  = 0;
    let touchEndX    = 0;

    // ── Display image at index ──────────────────────────────────────────
    function showImage(index) {
        currentIndex = ((index % allImages.length) + allImages.length) % allImages.length;
        const data   = allImages[currentIndex];

        modalImg.classList.add('gallery-modal__img--loading');

        setTimeout(() => {
            modalImg.src            = data.src;
            modalImg.alt            = data.alt;
            modalTitle.textContent  = data.title;
            modalDesc.textContent   = data.desc;
            counter.textContent     = `${currentIndex + 1} / ${allImages.length}`;
        }, 150);
    }

    // Fade back in once the image loads
    modalImg.addEventListener('load', () => {
        modalImg.classList.remove('gallery-modal__img--loading');
    });

    // ── Open / Close ────────────────────────────────────────────────────
    function openModal(startIndex) {
        showImage(startIndex);
        modal.classList.add('gallery-modal--active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('gallery-modal--active');
        document.body.style.overflow = '';
    }

    function showPrev() { showImage(currentIndex - 1); }
    function showNext() { showImage(currentIndex + 1); }

    // ── Click on any card → open at its first image ─────────────────────
    cards.forEach((card) => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(cardStartIndex.get(card) || 0);
        });
    });

    // ── Controls ────────────────────────────────────────────────────────
    closeBtn.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('gallery-modal__backdrop')) {
            closeModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('gallery-modal--active')) return;
        if (e.key === 'Escape')     closeModal();
        if (e.key === 'ArrowLeft')  showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    // Touch / swipe support
    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) showNext();
            else showPrev();
        }
    }, { passive: true });

})();
