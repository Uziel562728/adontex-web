// Carousel component functionality - Zero Latency Infinite Loop
export function initCarousel() {
  const viewport = document.querySelector('.carousel-viewport');
  const track = document.querySelector('.carousel-track');
  if (!viewport || !track) return;

  // Clone carousel items for seamless infinite scroll
  const originalItems = Array.from(track.children);
  
  // Clone twice to make sure we have enough scroll runway for wide screens
  originalItems.forEach(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });
  originalItems.forEach(item => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });

  // Calculate the single-width limit of original track content
  let originalWidth = 0;
  function calculateWidth() {
    originalWidth = 0;
    // Calculate gap dynamically (24px or 16px on mobile to match CSS)
    const gap = window.innerWidth <= 768 ? 16 : 24;
    for (let i = 0; i < originalItems.length; i++) {
      originalWidth += originalItems[i].offsetWidth + gap;
    }
  }
  calculateWidth();
  window.addEventListener('resize', calculateWidth);

  // Scroll/Drag State Variables
  let isDragging = false;
  let startX;
  let scrollLeft;
  let autoplaySpeed = 0.65; // Speed in pixels per frame
  let isAutoplayPaused = false;
  let resumeTimer = null;
  let animationFrameId = null;

  // Autoplay function using requestAnimationFrame for 60fps smoothness
  function animate() {
    if (!isAutoplayPaused && !isDragging) {
      viewport.scrollLeft += autoplaySpeed;
      
      // Infinite loop reset: once scrolled past the width of original items, reset smoothly
      if (viewport.scrollLeft >= originalWidth) {
        viewport.scrollLeft -= originalWidth;
      }
    }
    animationFrameId = requestAnimationFrame(animate);
  }

  // Mouse drag interaction (PC)
  viewport.addEventListener('mousedown', (e) => {
    isDragging = true;
    viewport.classList.add('active');
    startX = e.pageX - viewport.offsetLeft;
    scrollLeft = viewport.scrollLeft;
    isAutoplayPaused = true;
    if (resumeTimer) clearTimeout(resumeTimer);
    
    // Prevent dragging images outline
    e.preventDefault();
  });

  viewport.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      viewport.classList.remove('active');
      queueAutoplayResume(1000);
    }
  });

  viewport.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      viewport.classList.remove('active');
      queueAutoplayResume(1000);
    }
  });

  viewport.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - viewport.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag sensitivity
    viewport.scrollLeft = scrollLeft - walk;

    // Loop resets during dragging
    if (viewport.scrollLeft >= originalWidth * 2) {
      viewport.scrollLeft -= originalWidth;
    } else if (viewport.scrollLeft <= 0) {
      viewport.scrollLeft += originalWidth;
    }
  });

  // Touch swipe interaction (Mobile)
  viewport.addEventListener('touchstart', () => {
    isDragging = true;
    isAutoplayPaused = true;
    if (resumeTimer) clearTimeout(resumeTimer);
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    isDragging = false;
    queueAutoplayResume(2000); // 2-second pause before autoplay kicks back in on touch
    
    // Boundary check on swipe end
    if (viewport.scrollLeft >= originalWidth * 2) {
      viewport.scrollLeft -= originalWidth;
    } else if (viewport.scrollLeft <= 0) {
      viewport.scrollLeft += originalWidth;
    }
  }, { passive: true });

  // Autoplay pause/resume helper functions
  function queueAutoplayResume(delay) {
    if (resumeTimer) clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      // Only resume if there are no active hovers currently
      if (activeHovers === 0) {
        isAutoplayPaused = false;
      }
    }, delay);
  }

  // Zero-latency hover tracking on individual photographs (PC)
  let activeHovers = 0;
  
  // Query all items inside the track (including cloned items)
  const carouselItems = track.querySelectorAll('.carousel-item');
  
  carouselItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      activeHovers++;
      isAutoplayPaused = true; // Pause immediately (zero delay)
      if (resumeTimer) clearTimeout(resumeTimer);
    });

    item.addEventListener('mouseleave', () => {
      activeHovers--;
      if (activeHovers <= 0) {
        activeHovers = 0;
        // Resume immediately when cursor completely leaves all carousel photos
        isAutoplayPaused = false;
      }
    });
  });

  // Start autoplay
  animate();
}
