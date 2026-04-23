/* =============================================
   EVENTS CAROUSEL — js/events-carousel.js
   ============================================= */

(function () {
    'use strict';

    const track = document.getElementById('eventsTrack');
    const cards = track ? Array.from(track.querySelectorAll('.event-card')) : [];
    const prevBtn = document.getElementById('eventsPrev');
    const nextBtn = document.getElementById('eventsNext');
    const dots = Array.from(document.querySelectorAll('#eventsDots .events__dot'));
    const counter = document.getElementById('eventsCounter');
    const section = document.getElementById('eventos');

    if (!track || cards.length === 0) return;

    let current = 0;
    let isAnimating = false;
    let autoTimer = null;
    let isVisible = false;
    const TOTAL = cards.length;
    const AUTO_DELAY = 5000;

    // ── Build initial state ──────────────────────────────────────────────
    function updateCounter(index) {
        if (counter) {
            counter.classList.remove('events__counter--updated');
            void counter.offsetWidth;
            counter.textContent = `${index + 1} / ${TOTAL}`;
            counter.classList.add('events__counter--updated');
            setTimeout(function () {
                counter.classList.remove('events__counter--updated');
            }, 520);
        }
    }

    function setState(index, direction) {
        if (isAnimating) return;
        isAnimating = true;

        const prev = current;
        current = (index + TOTAL) % TOTAL;

        // Update dots & counter
        dots.forEach((d, i) => d.classList.toggle('events__dot--active', i === current));
        updateCounter(current);

        // Classes for transition
        const incoming = cards[current];
        const outgoing = cards[prev];

        if (prev === current) { isAnimating = false; return; }

        const enterFrom = direction === 'next' ? 'slide-from-right' : 'slide-from-left';
        const exitTo = direction === 'next' ? 'slide-to-left' : 'slide-to-right';

        // Reset incoming position
        incoming.classList.remove('slide-from-right', 'slide-from-left', 'slide-to-left', 'slide-to-right', 'event-card--active');
        incoming.classList.add(enterFrom);

        // Start transition after paint
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                outgoing.classList.add(exitTo);
                outgoing.classList.remove('event-card--active');
                incoming.classList.remove(enterFrom);
                incoming.classList.add('event-card--active');

                const onEnd = () => {
                    outgoing.removeEventListener('transitionend', onEnd);
                    outgoing.classList.remove(exitTo, 'slide-from-right', 'slide-from-left');
                    isAnimating = false;
                };
                outgoing.addEventListener('transitionend', onEnd, { once: true });
            });
        });
    }

    function goTo(index, dir) {
        const direction = dir || (index > current ? 'next' : 'prev');
        setState(index, direction);
        resetAuto();
    }

    function next() { goTo((current + 1) % TOTAL, 'next'); }
    function prev() { goTo((current - 1 + TOTAL) % TOTAL, 'prev'); }

    // ── Auto-advance ────────────────────────────────────────────────────
    function startAuto() {
        if (!isVisible) return; // Don't auto-advance if not on screen
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = setInterval(next, AUTO_DELAY);
    }

    function resetAuto() {
        if (autoTimer) clearInterval(autoTimer);
        startAuto();
    }

    // ── Init ────────────────────────────────────────────────────────────
    cards.forEach((c, i) => {
        c.classList.toggle('event-card--active', i === 0);
    });
    updateCounter(0);

    nextBtn && nextBtn.addEventListener('click', next);
    prevBtn && prevBtn.addEventListener('click', prev);
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goTo(i));
    });

    // Touch / swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].clientX;
        if (autoTimer) clearInterval(autoTimer);
    }, { passive: true });

    track.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
        startAuto();
    }, { passive: true });

    // Keyboard support
    document.addEventListener('keydown', e => {
        if (!isVisible) return;
        if (e.key === 'ArrowRight') next();
        if (e.key === 'ArrowLeft') prev();
    });

    // Pause when out of view
    if ('IntersectionObserver' in window && section) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                    startAuto();
                } else {
                    if (autoTimer) clearInterval(autoTimer);
                }
            });
        }, { threshold: 0.2 });
        observer.observe(section);
    } else {
        isVisible = true;
        startAuto();
    }

})();

