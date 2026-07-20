// Catalog and Budget Cart Component functionality
import { products, getSlug, getProductSizesList } from '../data/products.js';

export function initCatalog(whatsappNumber) {
  // Initialize and Sanitize Cart State from LocalStorage (Backward Compatibility)
  let cart = JSON.parse(localStorage.getItem('adontex_cart')) || [];
  cart = cart.map(item => {
    if (!item.sizes) item.sizes = {};
    if (item.sizesPending === undefined) item.sizesPending = true;
    if (!item.cartItemId) {
      item.cartItemId = item.id + '_' + (item.sizesPending ? 'pending' : 'defined');
    }
    return item;
  });

  let cartNotes = localStorage.getItem('adontex_remarks') || '';

  // DOM Elements
  const grid = document.querySelector('.catalog-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cartToggle = document.querySelector('.cart-toggle-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartBackdrop = document.getElementById('cart-backdrop');
  const cartClose = document.getElementById('cart-close');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartEmptyMsg = document.getElementById('cart-empty-msg');
  const cartNotesWrapper = document.getElementById('cart-notes-wrapper');
  const cartNotesTextarea = document.getElementById('cart-notes');
  const btnSendBudget = document.getElementById('btn-send-budget');
  const cartBadge = document.querySelector('.cart-badge');
  const cartBackToShop = document.getElementById('cart-back-to-shop');

  // Redesigned UI DOM elements
  const cartHeaderCount = document.getElementById('cart-header-count');
  const cartSummaryUnique = document.getElementById('cart-summary-unique');
  const cartSummaryTotal = document.getElementById('cart-summary-total');
  const cartSummaryCard = document.getElementById('cart-summary-card');
  const btnClearCart = document.getElementById('btn-clear-cart');

  if (!grid) return;

  // Render Product Grid Card Items (Simplified for clean visual layout)
  function renderProducts(filterCategory = 'all') {
    grid.innerHTML = '';
    
    const filteredProducts = filterCategory === 'all' 
      ? products 
      : products.filter(p => p.category === filterCategory);

    filteredProducts.forEach((product, index) => {
      const card = document.createElement('div');
      card.className = `product-card reveal reveal-delay-${(index % 4) + 1}`;
      card.setAttribute('data-category', product.category);
      
      const badgeHtml = product.tag ? `<div class="product-badge">${product.tag}</div>` : '';
      const slug = getSlug(product.name);

      card.innerHTML = `
        <a href="/${slug}" class="product-img-wrapper" aria-label="Ver detalles de ${product.name}">
          ${badgeHtml}
          <img src="${product.img}" alt="${product.name}" loading="lazy">
        </a>
        <div class="product-info">
          <h3 class="product-title">
            <a href="/${slug}" style="text-decoration:none; color:inherit;">${product.name}</a>
          </h3>
          <p class="product-desc">${product.desc}</p>
          <div class="product-bottom-home">
            <div class="product-price">
              ${product.price}
              <span>${product.price.startsWith('$') ? 'c/u' : 'consultar'}</span>
            </div>
            <a href="/${slug}" class="product-btn-detail">Ver detalle</a>
          </div>
        </div>
      `;
      grid.appendChild(card);

      setTimeout(() => {
        card.classList.add('active');
      }, 50);
    });
  }

  // Handle Category Tab Filters
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const category = btn.getAttribute('data-filter');
      
      grid.style.opacity = '0';
      grid.style.transform = 'translateY(10px)';
      grid.style.transition = 'all 0.25s ease-out';
      
      setTimeout(() => {
        renderProducts(category);
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
      }, 250);
    });
  });

  // CART LOGIC ENGINE
  
  // Add item to cart (supporting simple size structures)
  function addToCart(newItem) {
    const sizesPending = newItem.sizesPending !== undefined ? newItem.sizesPending : true;
    const sizes = newItem.sizes || {};
    const quantity = newItem.quantity || 1;

    const cartItemId = newItem.id + '_' + (sizesPending ? 'pending' : 'defined');
    const existingIndex = cart.findIndex(item => item.cartItemId === cartItemId);
    
    if (existingIndex > -1) {
      if (sizesPending) {
        // Sum total quantity
        cart[existingIndex].quantity += quantity;
      } else {
        // Merge individual sizes
        const existingSizes = cart[existingIndex].sizes || {};
        Object.keys(sizes).forEach(sz => {
          existingSizes[sz] = (existingSizes[sz] || 0) + sizes[sz];
        });
        cart[existingIndex].sizes = existingSizes;
        cart[existingIndex].quantity = Object.values(existingSizes).reduce((a, b) => a + b, 0);
      }
    } else {
      cart.push({
        cartItemId,
        id: newItem.id,
        name: newItem.name,
        price: newItem.price,
        img: newItem.img,
        quantity: quantity,
        sizes: sizes,
        sizesPending: sizesPending
      });
    }
    
    saveCart();
    updateCartUI();
    openCartDrawer();
  }

  // Save state to LocalStorage
  function saveCart() {
    localStorage.setItem('adontex_cart', JSON.stringify(cart));
    localStorage.setItem('adontex_remarks', cartNotes);
  }

  // Update count badge and summaries only (preventing input redraw glitches)
  function updateCartTotals() {
    const uniqueTypes = cart.length;
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    
    // Header cart badge (outside drawer)
    if (cartBadge) {
      cartBadge.textContent = uniqueTypes;
      cartBadge.style.display = uniqueTypes > 0 ? 'flex' : 'none';
    }

    // Header badge inside drawer
    if (cartHeaderCount) {
      cartHeaderCount.textContent = uniqueTypes;
      cartHeaderCount.style.display = uniqueTypes > 0 ? 'inline-flex' : 'none';
    }

    // Summary Card variables
    if (cartSummaryUnique) {
      cartSummaryUnique.textContent = uniqueTypes;
    }
    if (cartSummaryTotal) {
      cartSummaryTotal.textContent = totalItems;
    }
    if (cartSummaryCard) {
      cartSummaryCard.style.display = uniqueTypes > 0 ? 'block' : 'none';
    }
  }

  // Render Drawer UI items
  function updateCartUI() {
    const uniqueTypes = cart.length;
    
    updateCartTotals();

    // Render items list inside drawer
    cartItemsList.innerHTML = '';
    
    if (uniqueTypes === 0) {
      // Empty State
      cartEmptyMsg.style.display = 'flex';
      cartNotesWrapper.style.display = 'none';
      if (btnClearCart) btnClearCart.style.display = 'none';
      btnSendBudget.style.opacity = '0.5';
      btnSendBudget.setAttribute('disabled', 'true');
      if (cartNotesTextarea) cartNotesTextarea.value = '';
    } else {
      // Items exist
      cartEmptyMsg.style.display = 'none';
      cartNotesWrapper.style.display = 'flex';
      if (btnClearCart) btnClearCart.style.display = 'block';
      btnSendBudget.style.opacity = '1';
      btnSendBudget.removeAttribute('disabled');
      
      // Load stored remarks
      cartNotesTextarea.value = cartNotes;

      cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item-card';

        let sizesHtml = '';
        let quantitySelectorHtml = '';

        if (item.sizesPending) {
          sizesHtml = `
            <div class="cart-item-sizes-title">Talles seleccionados</div>
            <div class="cart-item-sizes-badges">
              <span class="cart-size-badge pending-badge"><i class="far fa-clock"></i> A definir</span>
            </div>
          `;
          
          // Show standard quantity spinner
          quantitySelectorHtml = `
            <div class="cart-item-qty-capsule">
              <button class="cart-capsule-btn qty-minus" aria-label="Restar">-</button>
              <input type="number" class="cart-capsule-input" value="${item.quantity}" min="1" aria-label="Cantidad">
              <button class="cart-capsule-btn qty-plus" aria-label="Sumar">+</button>
            </div>
          `;
        } else {
          // Format active sizes as capsules
          const badgesMarkup = Object.entries(item.sizes)
            .filter(([_, qty]) => qty > 0)
            .map(([sz, qty]) => `<span class="cart-size-badge"><strong>${sz}</strong> ×${qty}</span>`)
            .join('');

          sizesHtml = `
            <div class="cart-item-sizes-title">Talles seleccionados</div>
            <div class="cart-item-sizes-badges">
              ${badgesMarkup || '<span class="cart-size-badge pending-badge">A definir</span>'}
            </div>
          `;

          // Replace quantity selectors with "Editar talles" button
          quantitySelectorHtml = `
            <button class="btn btn-edit-cart-sizes" data-cart-item-id="${item.cartItemId}">
              <i class="fas fa-edit"></i> Editar talles
            </button>
          `;
        }

        itemEl.innerHTML = `
          <div class="cart-item-thumb">
            <img src="${item.img}" alt="${item.name}">
          </div>
          <div class="cart-item-middle">
            <div class="cart-item-title-row">
              <h4 class="cart-item-title-name">${item.name}</h4>
              <button class="cart-item-delete-btn" data-cart-item-id="${item.cartItemId}" title="Eliminar del presupuesto" aria-label="Eliminar prenda">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
            <div class="cart-item-subtitle">${item.price.startsWith('$') ? 'Precio unitario: ' + item.price : 'Cotización pendiente'}</div>
            
            ${sizesHtml}

            <div class="cart-item-capsule-row">
              <span class="cart-item-qty-lbl">Cantidad total: <strong class="qty-total-value">${item.quantity}</strong></span>
              ${quantitySelectorHtml}
            </div>
          </div>
        `;
        cartItemsList.appendChild(itemEl);

        // Bind delete action
        const btnRemove = itemEl.querySelector('.cart-item-delete-btn');
        btnRemove.addEventListener('click', () => {
          removeItemFromCart(item.cartItemId);
        });

        if (item.sizesPending) {
          // Bind +/- buttons for generic lines
          const qtyInput = itemEl.querySelector('.cart-capsule-input');
          const qtyMinus = itemEl.querySelector('.qty-minus');
          const qtyPlus = itemEl.querySelector('.qty-plus');

          qtyMinus.addEventListener('click', () => {
            let currentVal = parseInt(qtyInput.value) || 1;
            if (currentVal > 1) {
              qtyInput.value = currentVal - 1;
              updateItemQuantity(item.cartItemId, currentVal - 1);
            }
          });

          qtyPlus.addEventListener('click', () => {
            let currentVal = parseInt(qtyInput.value) || 1;
            qtyInput.value = currentVal + 1;
            updateItemQuantity(item.cartItemId, currentVal + 1);
          });

          qtyInput.addEventListener('change', () => {
            let val = parseInt(qtyInput.value);
            if (isNaN(val) || val < 1) {
              val = 1;
              qtyInput.value = 1;
            }
            updateItemQuantity(item.cartItemId, val);
          });
        } else {
          // Bind "Editar talles" trigger
          const btnEditSizes = itemEl.querySelector('.btn-edit-cart-sizes');
          btnEditSizes.addEventListener('click', () => {
            openSizesEditorModal(item);
          });
        }
      });
    }
  }

  // Sizes Editor Modal popup (Dynamically generated)
  function openSizesEditorModal(item) {
    const parentProduct = products.find(p => p.id === item.id);
    if (!parentProduct) return;

    const sizesList = getProductSizesList(parentProduct);
    if (sizesList.length === 0) return;

    const modal = document.createElement('div');
    modal.className = 'sizes-edit-modal-wrapper animate-fade-in';
    modal.id = 'sizes-edit-modal';

    let rowsHtml = '';
    sizesList.forEach(sz => {
      const currentQty = item.sizes[sz] || 0;
      rowsHtml += `
        <div class="modal-size-row">
          <span class="modal-size-name">${sz}</span>
          <div class="product-qty-selector size-qty-box">
            <button type="button" class="qty-btn edit-minus" data-size="${sz}">-</button>
            <input type="number" class="qty-input edit-size-input" data-size="${sz}" value="${currentQty}" min="0">
            <button type="button" class="qty-btn edit-plus" data-size="${sz}">+</button>
          </div>
        </div>
      `;
    });

    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="sizes-edit-modal-content">
        <div class="sizes-edit-modal-header">
          <h3>Editar talles</h3>
          <button class="sizes-edit-modal-close">&times;</button>
        </div>
        <div class="sizes-edit-modal-body">
          <p class="modal-product-name">${item.name}</p>
          <div class="modal-sizes-rows-list">
            ${rowsHtml}
          </div>
          <div class="modal-total-preview-row">
            Total recalculado: <span id="modal-total-preview-count">${item.quantity}</span> prendas
          </div>
        </div>
        <div class="sizes-edit-modal-footer">
          <button class="btn btn-modal-cancel">Cancelar</button>
          <button class="btn btn-modal-save">Guardar cambios</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const mBackdrop = modal.querySelector('.modal-backdrop');
    const mClose = modal.querySelector('.sizes-edit-modal-close');
    const mCancel = modal.querySelector('.btn-modal-cancel');
    const mSave = modal.querySelector('.btn-modal-save');
    const mPreviewSpan = modal.querySelector('#modal-total-preview-count');

    function calculatePreview() {
      let sum = 0;
      modal.querySelectorAll('.edit-size-input').forEach(input => {
        sum += parseInt(input.value) || 0;
      });
      mPreviewSpan.textContent = sum;
      return sum;
    }

    // Modal bindings
    modal.querySelectorAll('.modal-size-row').forEach(row => {
      const btnMinus = row.querySelector('.edit-minus');
      const btnPlus = row.querySelector('.edit-plus');
      const inputField = row.querySelector('.edit-size-input');

      btnMinus.addEventListener('click', () => {
        let val = parseInt(inputField.value) || 0;
        if (val > 0) {
          inputField.value = val - 1;
          calculatePreview();
        }
      });

      btnPlus.addEventListener('click', () => {
        let val = parseInt(inputField.value) || 0;
        inputField.value = val + 1;
        calculatePreview();
      });

      inputField.addEventListener('change', () => {
        let val = parseInt(inputField.value);
        if (isNaN(val) || val < 0) {
          inputField.value = 0;
        }
        calculatePreview();
      });
    });

    function closeModal() {
      modal.remove();
    }

    mClose.addEventListener('click', closeModal);
    mCancel.addEventListener('click', closeModal);
    mBackdrop.addEventListener('click', closeModal);

    mSave.addEventListener('click', () => {
      const updatedSizes = {};
      let sum = 0;

      modal.querySelectorAll('.edit-size-input').forEach(input => {
        const sz = input.getAttribute('data-size');
        const val = parseInt(input.value) || 0;
        if (val > 0) {
          updatedSizes[sz] = val;
          sum += val;
        }
      });

      if (sum === 0) {
        alert('Debes asignar al menos una prenda a algún talle.');
        return;
      }

      // Update in cart array
      const idx = cart.findIndex(c => c.cartItemId === item.cartItemId);
      if (idx > -1) {
        cart[idx].sizes = updatedSizes;
        cart[idx].quantity = sum;
        saveCart();
        updateCartUI();
      }
      closeModal();
    });
  }

  // Update item quantity helper (for undefined lines)
  function updateItemQuantity(cartItemId, newQty) {
    const itemIndex = cart.findIndex(item => item.cartItemId === cartItemId);
    if (itemIndex > -1) {
      cart[itemIndex].quantity = newQty;
      saveCart();
      updateCartTotals();
    }
  }

  // Remove single item helper
  function removeItemFromCart(cartItemId) {
    cart = cart.filter(item => item.cartItemId !== cartItemId);
    saveCart();
    updateCartUI();
  }

  // Save notes textarea content reactively on input
  if (cartNotesTextarea) {
    cartNotesTextarea.addEventListener('input', (e) => {
      cartNotes = e.target.value;
      saveCart();
    });
  }

  // Clear cart and localStorage (instantly without prompts)
  function emptyCart() {
    cart = [];
    cartNotes = '';
    localStorage.removeItem('adontex_cart');
    localStorage.removeItem('adontex_remarks');
    updateCartUI();
  }

  // Bind clear cart (NO confirm windows)
  if (btnClearCart) {
    btnClearCart.addEventListener('click', () => {
      emptyCart();
    });
  }

  // Drawer Toggle Handlers
  function openCartDrawer() {
    cartDrawer.classList.add('open');
    cartBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    cartDrawer.classList.remove('open');
    cartBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (cartToggle) {
    cartToggle.addEventListener('click', openCartDrawer);
  }
  if (cartClose) {
    cartClose.addEventListener('click', closeCartDrawer);
  }
  if (cartBackdrop) {
    cartBackdrop.addEventListener('click', closeCartDrawer);
  }
  if (cartBackToShop) {
    cartBackToShop.addEventListener('click', closeCartDrawer);
  }

  // Close with Escape key (PC)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer.classList.contains('open')) {
      closeCartDrawer();
    }
  });

  // WHATSAPP BUDGET COMPILER (formatting comma-separated lists)
  if (btnSendBudget) {
    btnSendBudget.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Tu lista de presupuesto está vacía. Agrega productos antes de consultar.');
        return;
      }

      let message = "Hola Adontex, quiero solicitar un presupuesto:\n\n";
      message += "PRODUCTOS:\n";
      
      cart.forEach(item => {
        message += `• ${item.name}\n  Cantidad: ${item.quantity}\n`;
        
        if (item.sizesPending) {
          message += "  Talles: A definir\n";
        } else {
          // Format as: S x5, M x10, L x15...
          const listText = Object.entries(item.sizes)
            .filter(([_, qty]) => qty > 0)
            .map(([sz, qty]) => `${sz} x${qty}`)
            .join(', ');
          
          message += `  Talles: ${listText || 'A definir'}\n`;
        }
      });

      if (cartNotes.trim()) {
        message += `\nACLARACIONES:\n${cartNotes.trim()}\n`;
      }

      message += "\nQuedo atento al presupuesto. Gracias.";

      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      
      emptyCart();
      closeCartDrawer();
    });
  }

  // DECOUPLED SPA LISTENER: Listen to requests from detail pages (router.js)
  document.addEventListener('add-to-cart-spa', (e) => {
    const { productId, quantity, sizes, sizesPending } = e.detail;
    const targetProduct = products.find(p => p.id === productId);
    if (targetProduct) {
      addToCart({
        id: targetProduct.id,
        name: targetProduct.name,
        price: targetProduct.price,
        img: targetProduct.img,
        quantity,
        sizes,
        sizesPending
      });
    }
  });

  // Initial Load render
  renderProducts();
  updateCartUI();
}
