/* =============================================
   HERO IMAGE CAROUSEL — Crossfade + Subtle Zoom
   Rotates hero background images every 6 seconds
   with smooth dissolve transitions.
   ============================================= */
(function () {
    'use strict';

    var INTERVAL_MS = 6000;   // 6 seconds per slide
    var FADE_MS     = 2000;   // crossfade duration (CSS must match)

    var slides = document.querySelectorAll('.hero__slide');
    if (!slides || slides.length < 2) return;

    var current = 0;
    var transitioning = false;

    function crossfade() {
        if (transitioning) return;
        transitioning = true;

        var fromSlide = slides[current];
        var next      = (current + 1) % slides.length;
        var toSlide   = slides[next];

        // Reset the incoming slide's zoom animation
        toSlide.style.animation = 'none';
        void toSlide.offsetWidth;
        toSlide.style.animation = '';

        // Fade in next slide (both visible during crossfade)
        toSlide.classList.add('hero__slide--active');

        // After fade-in is underway, start fading out the old one
        setTimeout(function () {
            fromSlide.classList.remove('hero__slide--active');
            fromSlide.classList.add('hero__slide--exit');
        }, FADE_MS * 0.35);

        // Cleanup once transition is done
        setTimeout(function () {
            fromSlide.classList.remove('hero__slide--exit');
            current = next;
            transitioning = false;
        }, FADE_MS + 400);
    }

    setInterval(crossfade, INTERVAL_MS);
})();
