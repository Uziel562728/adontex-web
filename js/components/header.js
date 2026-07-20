// Header component functionality
export function initHeader() {
  const header = document.querySelector('header');
  const burgerMenu = document.querySelector('.burger-menu');
  const navMenu = document.querySelector('.nav-menu');
  
  // Create overlay element dynamically for mobile slide-out
  const overlay = document.createElement('div');
  overlay.className = 'menu-overlay';
  document.body.appendChild(overlay);

  // Toggle mobile menu
  function toggleMenu() {
    const isOpen = burgerMenu.classList.toggle('open');
    navMenu.classList.toggle('open');
    overlay.classList.toggle('open');
    
    // Prevent background scrolling when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  burgerMenu.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  // Close mobile menu when clicking a link
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // Shrink header and add shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    updateActiveLink();
  });

  // Highlight current active section on scroll
  const sections = document.querySelectorAll('section[id]');
  
  function updateActiveLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100; // Offset for sticky header
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
      
      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  }

  // Run once on load to set active state
  updateActiveLink();
}
