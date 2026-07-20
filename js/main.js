// Main Application Script Entrypoint
import { initHeader } from './components/header.js';
import { initCarousel } from './components/carousel.js';
import { initCatalog } from './components/catalog.js';
import { initAnimations } from './components/animations.js';
import { initRouter } from './components/router.js'; // Import SPA router

// EASY TO CONFIGURE: Edit this phone number (include country code, no symbols)
// Country code + Area code + Phone number (Argentina: +54 9 11 5494-3154)
const WHATSAPP_NUMBER = "5491154943154"; 

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Header Navigation
  initHeader();
  
  // Initialize Image Gallery Carousel
  initCarousel();
  
  // Initialize Garment Catalog, Budget Drawer and Filters
  initCatalog(WHATSAPP_NUMBER);
  
  // Initialize SPA Routing Engine (Handles path parsing and page switches)
  initRouter();
  
  // Initialize Scroll Reveals
  initAnimations();

  // Configure general WhatsApp links across the website
  configureWhatsAppButtons();
});

// Utility to set WhatsApp links dynamically on static elements
function configureWhatsAppButtons() {
  const defaultText = "Hola, vi el catálogo de Adontex y quería hacer una consulta.";
  const encodedText = encodeURIComponent(defaultText);
  const generalWaLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;

  // Update floating button
  const floatBtn = document.querySelector('.whatsapp-float');
  if (floatBtn) {
    floatBtn.setAttribute('href', generalWaLink);
    floatBtn.setAttribute('target', '_blank');
    floatBtn.setAttribute('rel', 'noopener noreferrer');
  }

  // Update all other general contact WhatsApp links
  const contactWaBtns = document.querySelectorAll('.whatsapp-general-link');
  contactWaBtns.forEach(btn => {
    btn.setAttribute('href', generalWaLink);
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener noreferrer');
  });
}
