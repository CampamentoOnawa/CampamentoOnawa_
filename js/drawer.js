/* =============================================
   CAMPAMENTO ONAWA — Drawer Hiperrealista JS
   Map-unfold animation & interactions
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('drawerToggle');
    const drawer = document.getElementById('drawerNav');
    const overlay = document.getElementById('drawerOverlay');
    const closeBtn = document.getElementById('drawerClose');

    if (!toggle || !drawer || !overlay) return;

    // Toggle drawer
    function openDrawer() {
        drawer.classList.add('open');
        overlay.classList.add('active');
        toggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        overlay.classList.remove('active');
        toggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
        if (drawer.classList.contains('open')) {
            closeDrawer();
        } else {
            openDrawer();
        }
    });

    // Close on overlay click
    overlay.addEventListener('click', closeDrawer);

    // Close on close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeDrawer);
    }

    // Close on link click
    drawer.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
            closeDrawer();
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && drawer.classList.contains('open')) {
            closeDrawer();
        }
    });

    // Active section highlighting
    const sections = ['nosotros', 'vision', 'transformacion', 'experiencias', 'inversion'];
    const clueLinks = drawer.querySelectorAll('.drawer__clue[href^="#"]');

    function updateActiveClue() {
        const scrollY = window.scrollY + window.innerHeight / 3;

        let activeId = '';
        sections.forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;
                if (scrollY >= top && scrollY < bottom) {
                    activeId = id;
                }
            }
        });

        clueLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === '#' + activeId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveClue, { passive: true });
    updateActiveClue();

    // Paper rustle sound effect (subtle, using Web Audio)
    let audioCtx = null;

    function playPaperSound() {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }

            // White noise burst to simulate paper rustle
            const duration = 0.15;
            const bufferSize = audioCtx.sampleRate * duration;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                // Shaped noise — starts loud, fades quickly
                const envelope = Math.pow(1 - i / bufferSize, 3);
                data[i] = (Math.random() * 2 - 1) * envelope * 0.03;
            }

            const source = audioCtx.createBufferSource();
            source.buffer = buffer;

            // Bandpass filter to make it sound papery
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 3000;
            filter.Q.value = 0.5;

            const gain = audioCtx.createGain();
            gain.gain.value = 0.15;

            source.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);
            source.start();
        } catch (e) {
            // Audio not supported, silently ignore
        }
    }

    // Play sound on toggle
    toggle.addEventListener('click', () => {
        playPaperSound();
    });
});
