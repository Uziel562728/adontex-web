// SPA Client-Side Router Component - Sizing Selector, Form Requests and Inline Validations
import { products, getSlug, getProductSizesList } from '../data/products.js';

export function initRouter() {
  const homeView = document.getElementById('home-view');
  const routerView = document.getElementById('router-view');
  
  if (!homeView || !routerView) return;

  // Handle URL change
  function handleRoute() {
    const path = window.location.pathname;
    const cleanPath = path.replace(/^\/|\/$/g, '');

    if (cleanPath === '' || cleanPath === 'index.html') {
      // 1. Home Page View
      routerView.style.display = 'none';
      homeView.style.display = 'block';
      
      updateNavHighlight('home');
      
      const hash = window.location.hash;
      if (hash) {
        const target = document.querySelector(hash);
        if (target) {
          setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    } else if (cleanPath === 'solicitar-presupuesto') {
      // 2. Custom Printing Budget Request Form Route
      routerView.innerHTML = '';
      homeView.style.display = 'none';
      routerView.style.display = 'block';
      
      renderBudgetForm();
      updateNavHighlight('none');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      // 3. Product Page or 404 View
      const product = products.find(p => getSlug(p.name) === cleanPath);
      
      routerView.innerHTML = '';
      homeView.style.display = 'none';
      routerView.style.display = 'block';
      
      if (product) {
        renderProductDetail(product);
        updateNavHighlight('catalog');
      } else {
        renderNotFound();
        updateNavHighlight('none');
      }
      
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  // Render detailed product page with Sizing Selector and inline validations
  function renderProductDetail(product) {
    const sizesList = getProductSizesList(product);
    const hasSizingOptions = sizesList.length > 0;

    let sizingBlockMarkup = '';

    if (hasSizingOptions) {
      // Size distribution templates with checkbox
      sizingBlockMarkup = `
        <div class="sizes-selection-block">
          <h4 class="sizes-section-title">Seleccioná los talles</h4>
          
          <div class="sizes-define-later-row">
            <label class="sizes-checkbox-container">
              <input type="checkbox" id="chk-define-later">
              <span class="sizes-checkbox-checkmark"></span>
              Definir talles después
            </label>
          </div>
          
          <!-- Mode 1: Distribute S/M/L/XL counts -->
          <div class="sizes-distribute-container" id="sizes-distribute-box">
            <div class="sizes-detail-rows-list">
              ${sizesList.map(sz => `
                <div class="size-row-detail">
                  <span class="size-lbl">${sz}</span>
                  <div class="product-qty-selector size-qty-box">
                    <button type="button" class="qty-btn size-minus" data-size="${sz}">-</button>
                    <input type="number" class="qty-input size-input" data-size="${sz}" value="0" min="0" aria-label="Cantidad ${sz}">
                    <button type="button" class="qty-btn size-plus" data-size="${sz}">+</button>
                  </div>
                </div>
              `).join('')}
            </div>
            <div class="sizes-total-row-preview">
              Total: <span id="sizes-total-lbl" class="highlight-count">0</span> prendas
            </div>
          </div>

          <!-- Inline error warning message placeholder -->
          <div class="sizes-error-message" id="sizes-error-msg" style="display: none; opacity: 0; transition: opacity 0.15s ease;"></div>
          
          <!-- Mode 2: Define generic quantity later -->
          <div class="detail-qty-container" id="detail-qty-box-wrapper" style="display: none; margin-top: 10px;">
            <span class="detail-qty-label">Cantidad</span>
            <div class="product-qty-selector detail-qty-box">
              <button type="button" class="qty-btn detail-minus">-</button>
              <input type="number" class="qty-input detail-input" value="1" min="1" aria-label="Cantidad total">
              <button type="button" class="qty-btn detail-plus">+</button>
            </div>
          </div>
        </div>
      `;
    } else {
      // Non-standard sizes fallbacks
      sizingBlockMarkup = `
        <div class="sizes-selection-block">
          <div class="detail-qty-container" id="detail-qty-box-wrapper">
            <span class="detail-qty-label">Cantidad</span>
            <div class="product-qty-selector detail-qty-box">
              <button type="button" class="qty-btn detail-minus">-</button>
              <input type="number" class="qty-input detail-input" value="1" min="1" aria-label="Cantidad total">
              <button type="button" class="qty-btn detail-plus">+</button>
            </div>
          </div>
          <p class="sizes-notice-text">Talles: A definir / Surtidos</p>
          
          <!-- Inline error warning message placeholder -->
          <div class="sizes-error-message" id="sizes-error-msg" style="display: none; opacity: 0; transition: opacity 0.15s ease;"></div>
        </div>
      `;
    }

    routerView.innerHTML = `
      <section class="product-detail-section animate-fade-in">
        <div class="container">
          <a href="/#catalogo" class="back-link"><i class="fas fa-arrow-left"></i> Volver al catálogo</a>
          
          <div class="product-detail-container">
            <div class="product-detail-media">
              <img src="${product.img}" alt="${product.name}">
            </div>
            
            <div class="product-detail-info">
              <span class="product-detail-tag">${product.tag || 'Remeras Adontex'}</span>
              <h1 class="product-detail-title">${product.name}</h1>
              <div class="product-detail-price">${product.price}</div>
              
              <div class="product-detail-specs">
                <div class="spec-item"><strong>Talles disponibles:</strong> ${product.sizes}</div>
                <div class="spec-item"><strong>Colores disponibles:</strong> ${product.colors}</div>
                <div class="spec-item"><strong>Composición:</strong> ${product.fabric}</div>
                <div class="spec-item"><strong>Cuidado de la prenda:</strong> ${product.care}</div>
              </div>
              
              <h4 class="product-detail-section-title">Descripción:</h4>
              <p class="product-detail-description">${product.desc}</p>
              
              <!-- Injected sizes selection block -->
              ${sizingBlockMarkup}
              
              <!-- Add to Budget button -->
              <div class="product-detail-actions" style="margin-top: 24px;">
                <button class="btn btn-detail-add" data-id="${product.id}">
                  <i class="fas fa-cart-plus"></i> Agregar al presupuesto
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    // Elements & State
    const chkDefineLater = routerView.querySelector('#chk-define-later');
    const distributeBox = routerView.querySelector('#sizes-distribute-box');
    const genericQtyWrapper = routerView.querySelector('#detail-qty-box-wrapper');
    const dMinus = routerView.querySelector('.detail-minus');
    const dPlus = routerView.querySelector('.detail-plus');
    const dInput = routerView.querySelector('.detail-input');
    const dBtnAdd = routerView.querySelector('.btn-detail-add');

    // Inline validation error management helper
    function showInlineError(message) {
      const errorMsg = routerView.querySelector('#sizes-error-msg');
      if (errorMsg) {
        errorMsg.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        errorMsg.style.display = 'flex';
        // Minor timeout to trigger transition
        setTimeout(() => {
          errorMsg.style.opacity = '1';
        }, 10);
      }

      if (distributeBox) {
        distributeBox.classList.add('has-error');
      }
    }

    function clearInlineError() {
      const errorMsg = routerView.querySelector('#sizes-error-msg');
      if (errorMsg) {
        errorMsg.style.opacity = '0';
        setTimeout(() => {
          errorMsg.style.display = 'none';
        }, 150);
      }

      if (distributeBox) {
        distributeBox.classList.remove('has-error');
      }
    }

    // Tab toggling checkboxes logic
    if (chkDefineLater && distributeBox && genericQtyWrapper) {
      chkDefineLater.addEventListener('change', () => {
        clearInlineError(); // Instantly clear error state when switching modes
        if (chkDefineLater.checked) {
          distributeBox.style.display = 'none';
          genericQtyWrapper.style.display = 'block';
        } else {
          distributeBox.style.display = 'block';
          genericQtyWrapper.style.display = 'none';
        }
      });
    }

    // Distribute controls binding
    if (hasSizingOptions && distributeBox) {
      const sizeRows = routerView.querySelectorAll('.size-row-detail');
      const totalLbl = routerView.querySelector('#sizes-total-lbl');

      function calculateTotal() {
        let sum = 0;
        routerView.querySelectorAll('.size-input').forEach(input => {
          sum += parseInt(input.value) || 0;
        });
        if (totalLbl) {
          totalLbl.textContent = sum;
        }
        
        // Reactive feedback: Clear inline error as soon as sum > 0
        if (sum > 0) {
          clearInlineError();
        }
        return sum;
      }

      sizeRows.forEach(row => {
        const minusBtn = row.querySelector('.size-minus');
        const plusBtn = row.querySelector('.size-plus');
        const inputField = row.querySelector('.size-input');

        minusBtn.addEventListener('click', () => {
          let currentVal = parseInt(inputField.value) || 0;
          if (currentVal > 0) {
            inputField.value = currentVal - 1;
            calculateTotal();
          }
        });

        plusBtn.addEventListener('click', () => {
          let currentVal = parseInt(inputField.value) || 0;
          inputField.value = currentVal + 1;
          calculateTotal();
        });

        inputField.addEventListener('change', () => {
          let val = parseInt(inputField.value);
          if (isNaN(val) || val < 0) {
            inputField.value = 0;
          }
          calculateTotal();
        });
      });
    }

    // Generic quantity box bindings
    if (dMinus && dPlus && dInput) {
      dMinus.addEventListener('click', () => {
        let val = parseInt(dInput.value) || 1;
        if (val > 1) {
          dInput.value = val - 1;
          clearInlineError();
        }
      });

      dPlus.addEventListener('click', () => {
        let val = parseInt(dInput.value) || 1;
        dInput.value = val + 1;
        clearInlineError();
      });

      dInput.addEventListener('change', () => {
        let val = parseInt(dInput.value);
        if (isNaN(val) || val < 1) {
          dInput.value = 1;
        }
        clearInlineError();
      });
    }

    // Add to budget click handler
    dBtnAdd.addEventListener('click', () => {
      const sizesMap = {};
      let totalQty = 0;
      let sizesPending = true;

      if (hasSizingOptions && chkDefineLater && !chkDefineLater.checked) {
        // Mode 1: Distribute sizes
        sizesPending = false;
        routerView.querySelectorAll('.size-input').forEach(input => {
          const sz = input.getAttribute('data-size');
          const val = parseInt(input.value) || 0;
          if (val > 0) {
            sizesMap[sz] = val;
            totalQty += val;
          }
        });

        if (totalQty === 0) {
          showInlineError('Seleccioná al menos una prenda en algún talle.');
          return;
        }
      } else {
        // Mode 2: Define later
        sizesPending = true;
        totalQty = dInput ? (parseInt(dInput.value) || 1) : 1;
        if (totalQty < 1) {
          showInlineError('La cantidad total debe ser al menos 1.');
          return;
        }
      }

      // Dispatch decoupled SPA event containing the expanded attributes
      document.dispatchEvent(new CustomEvent('add-to-cart-spa', {
        detail: {
          productId: product.id,
          quantity: totalQty,
          sizes: sizesMap,
          sizesPending: sizesPending
        }
      }));

      // Reset fields
      if (dInput) dInput.value = 1;
      routerView.querySelectorAll('.size-input').forEach(input => {
        input.value = 0;
      });
      const totalLbl = routerView.querySelector('#sizes-total-lbl');
      if (totalLbl) totalLbl.textContent = 0;
      if (chkDefineLater) {
        chkDefineLater.checked = false;
        distributeBox.style.display = 'block';
        genericQtyWrapper.style.display = 'none';
      }
      
      clearInlineError(); // Make sure error is cleared after successful add
    });
  }

  // Render dynamic solicitation form view
  function renderBudgetForm() {
    routerView.innerHTML = `
      <section class="budget-form-section animate-fade-in">
        <div class="container">
          <a href="/" class="back-link"><i class="fas fa-arrow-left"></i> Volver</a>
          
          <div class="budget-form-container">
            <h1>Solicitar Presupuesto de Estampado</h1>
            <p>Completá el formulario con los detalles de tu idea y te responderemos por WhatsApp a la brevedad.</p>
            
            <form id="print-request-form" class="budget-form">
              <div class="form-grid">
                <div class="form-group">
                  <label for="frm-name">Nombre <span class="req">*</span></label>
                  <input type="text" id="frm-name" required placeholder="Tu nombre y apellido">
                </div>
                
                <div class="form-group">
                  <label for="frm-phone">WhatsApp / Teléfono <span class="req">*</span></label>
                  <input type="tel" id="frm-phone" required placeholder="Ej: 11 1234 5678">
                </div>
                
                <div class="form-group">
                  <label for="frm-email">Email (Opcional)</label>
                  <input type="email" id="frm-email" placeholder="ejemplo@email.com">
                </div>
                
                <div class="form-group">
                  <label for="frm-jobtype">Tipo de trabajo <span class="req">*</span></label>
                  <select id="frm-jobtype" required>
                    <option value="Remeras personalizadas" selected>Remeras personalizadas</option>
                    <option value="Estampado para marca">Estampado para marca</option>
                    <option value="Merchandising">Merchandising / Regalos</option>
                    <option value="Evento">Evento corporativo / social</option>
                    <option value="Empresa">Uniformes para empresas</option>
                    <option value="Otro">Otro servicio</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="frm-qty">Cantidad aproximada <span class="req">*</span></label>
                  <input type="number" id="frm-qty" required min="1" value="10">
                </div>
                
                <div class="form-group">
                  <label for="frm-garment">Tipo de prenda <span class="req">*</span></label>
                  <input type="text" id="frm-garment" required placeholder="Ej: Remera Oversize, Hoodie, etc.">
                </div>
                
                <div class="form-group">
                  <label for="frm-colors">Colores de prendas (Opcional)</label>
                  <input type="text" id="frm-colors" placeholder="Ej: Negro, Blanco y Gris">
                </div>
                
                <div class="form-group">
                  <label for="frm-design">¿Ya tenés el diseño listo? <span class="req">*</span></label>
                  <select id="frm-design" required>
                    <option value="Sí" selected>Sí, lo tengo listo</option>
                    <option value="No">No, todavía no</option>
                    <option value="Necesito ayuda con el diseño">Necesito ayuda / asesoramiento</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="frm-print">Tipo de estampado <span class="req">*</span></label>
                  <select id="frm-print" required>
                    <option value="DTF">DTF (Color completo / digital)</option>
                    <option value="Serigrafía">Serigrafía (Alta calidad por cantidad)</option>
                    <option value="No sé / Necesito asesoramiento" selected>No sé / Necesito asesoramiento</option>
                  </select>
                </div>
                
                <div class="form-group full-width">
                  <label for="frm-desc">Descripción del trabajo <span class="req">*</span></label>
                  <textarea id="frm-desc" rows="4" required placeholder="Detallá lo que necesitas. Ej: Necesito 50 remeras negras con logo adelante y diseño grande en la espalda."></textarea>
                </div>
                
                <div class="form-group full-width">
                  <label for="frm-remarks">Aclaraciones adicionales (Opcional)</label>
                  <textarea id="frm-remarks" rows="2" placeholder="Ej: Plazos de entrega, tipos de talle, etc."></textarea>
                </div>
              </div>
              
              <button type="submit" class="btn btn-send-whatsapp-form">
                <i class="fab fa-whatsapp"></i> Enviar solicitud por WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>
    `;

    const form = routerView.querySelector('#print-request-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = routerView.querySelector('#frm-name').value.trim();
      const phone = routerView.querySelector('#frm-phone').value.trim();
      const email = routerView.querySelector('#frm-email').value.trim();
      const jobType = routerView.querySelector('#frm-jobtype').value;
      const qty = routerView.querySelector('#frm-qty').value;
      const garmentType = routerView.querySelector('#frm-garment').value.trim();
      const colors = routerView.querySelector('#frm-colors').value.trim();
      const hasDesign = routerView.querySelector('#frm-design').value;
      const printType = routerView.querySelector('#frm-print').value;
      const desc = routerView.querySelector('#frm-desc').value.trim();
      const remarks = routerView.querySelector('#frm-remarks').value.trim();

      if (!name || !phone || !jobType || !qty || !garmentType || !desc) {
        alert('Por favor, completa todos los campos obligatorios (*).');
        return;
      }

      let msg = "Hola Adontex, quiero solicitar un presupuesto de estampado.\n\n";
      msg += `Nombre: ${name}\n`;
      msg += `WhatsApp: ${phone}\n`;
      if (email) msg += `Email: ${email}\n`;
      msg += `\nTipo de trabajo: ${jobType}\n`;
      msg += `Cantidad aproximada: ${qty}\n`;
      msg += `Tipo de prenda: ${garmentType}\n`;
      if (colors) msg += `Colores: ${colors}\n`;
      msg += `¿Tiene diseño?: ${hasDesign}\n`;
      msg += `Tipo de estampado: ${printType}\n`;
      msg += `\nDescripción:\n${desc}\n`;
      if (remarks) msg += `\nAclaraciones:\n${remarks}\n`;

      const waNumber = "5491154943154";
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
      
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // Render 404 page
  function renderNotFound() {
    routerView.innerHTML = `
      <section class="not-found-section animate-fade-in">
        <div class="container">
          <div class="not-found-content">
            <i class="fas fa-exclamation-triangle"></i>
            <h1>Producto no encontrado</h1>
            <p>Lo sentimos, la prenda que estás buscando no existe o fue dada de baja de nuestro catálogo.</p>
            <a href="/#catalogo" class="btn btn-primary"><i class="fas fa-home"></i> Volver al catálogo</a>
          </div>
        </div>
      </section>
    `;
  }

  // Highlight corresponding link in Navbar
  function updateNavHighlight(page) {
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    
    if (page === 'home') {
      const activeLink = document.querySelector('.nav-menu a[href="#inicio"]');
      if (activeLink) activeLink.classList.add('active');
    } else if (page === 'catalog') {
      const activeLink = document.querySelector('.nav-menu a[href="#catalogo"]');
      if (activeLink) activeLink.classList.add('active');
    }
  }

  // Intercept internal anchor clicks for SPA navigation
  document.body.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || anchor.hasAttribute('target')) {
      return;
    }

    if (href === '#' || href === '') {
      return;
    }

    e.preventDefault();

    if (href.startsWith('#') || href.startsWith('/#')) {
      const cleanHash = href.replace(/^\/#/, '#');
      
      if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
        history.pushState(null, '', '/' + cleanHash);
        handleRoute();
      } else {
        const target = document.querySelector(cleanHash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        history.pushState(null, '', cleanHash);
      }
    } else {
      history.pushState(null, '', href);
      handleRoute();
    }
  });

  window.addEventListener('popstate', () => {
    handleRoute();
  });

  handleRoute();
}
