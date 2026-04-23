/* =============================================
   CAMPAMENTO ONAWA — Before/After Comparison Slider
   Pure JavaScript drag-to-compare implementation
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('comparisonSlider');
    const handle = document.getElementById('comparisonHandle');

    if (!slider || !handle) return;

    const afterImage = slider.querySelector('.comparison__image--after');
    let isDragging = false;
    let sliderRect = null;

    /**
     * Updates the slider position based on a percentage (0–100)
     * @param {number} percent — position from left edge
     */
    function updateSlider(percent) {
        // Clamp between 5% and 95%
        percent = Math.max(5, Math.min(95, percent));

        // Update clip-path on the "after" image (reveals from right)
        afterImage.style.clipPath = `inset(0 0 0 ${percent}%)`;

        // Move the handle
        handle.style.left = `${percent}%`;
    }

    /**
     * Gets the percentage position from a pointer event
     * @param {PointerEvent|TouchEvent} e
     * @returns {number} percent (0–100)
     */
    function getPercent(e) {
        sliderRect = slider.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const x = clientX - sliderRect.left;
        return (x / sliderRect.width) * 100;
    }

    // ----- Pointer Events -----
    function onPointerDown(e) {
        e.preventDefault();
        isDragging = true;
        slider.style.cursor = 'col-resize';
        updateSlider(getPercent(e));
    }

    function onPointerMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        updateSlider(getPercent(e));
    }

    function onPointerUp() {
        isDragging = false;
        slider.style.cursor = 'col-resize';
    }

    // Mouse events
    slider.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // Touch events
    slider.addEventListener('touchstart', onPointerDown, { passive: false });
    window.addEventListener('touchmove', onPointerMove, { passive: false });
    window.addEventListener('touchend', onPointerUp);

    // Initialize at 50%
    updateSlider(50);

    // Handle window resize — recalculate rect
    window.addEventListener('resize', () => {
        sliderRect = slider.getBoundingClientRect();
    });
});
