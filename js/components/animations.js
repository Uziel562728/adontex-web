// Scroll reveal animations component
export function initAnimations() {
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // Viewport
      rootMargin: '0px 0px -80px 0px', // Trigger slightly before element enters view
      threshold: 0.15 // 15% of element visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, stop observing this element
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: add class immediately if browser doesn't support IntersectionObserver
    revealElements.forEach(el => {
      el.classList.add('active');
    });
  }
}
