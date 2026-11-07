/**
 * 3dlab.lv — Bambu Lab Filamentu Veikals & Grozs
 * Moderns e-veikala modulis ar grozu, Omniva/DPD pakomātu izvēli un Telegram integrāciju.
 */

(function() {
  "use strict";

  // --- BAMBU LAB FILAMENTU KATALOGS (No apstiprinātā pasūtījuma EN795228764706476032) ---
  const BAMBU_FILAMENTS = [
    // === PLA MATTE (1kg, 1.75mm) ===
    {
      id: "pla-matte-charcoal",
      material: "PLA Matte",
      category: "pla",
      colorName: "Charcoal (11101)",
      colorLabel: "Ogļu tumši pelēks",
      hex: "#2d3139",
      type: "Refill",
      typeLabel: "Refill (bez spoles)",
      price: 14.99,
      stock: 2,
      weight: "1 kg",
      desc: "Elegants ogļu antracīta tonis ar dziļu matētu apdari. 100% savietojams ar atkārtoti lietojamām Bambu spolēm un AMS."
    },
    {
      id: "pla-matte-nardo-gray",
      material: "PLA Matte",
      category: "pla",
      colorName: "Nardo Gray (11104)",
      colorLabel: "Nardo sporta pelēks",
      hex: "#6c727d",
      type: "Refill",
      typeLabel: "Refill (bez spoles)",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Sporta auto estētikas iedvesmots matēts pelēks tonis. Ideāls tehniskām korpusu detaļām un moderniem aksesuāriem."
    },
    {
      id: "pla-matte-ash-gray",
      material: "PLA Matte",
      category: "pla",
      colorName: "Ash Gray (11102)",
      colorLabel: "Pelnu gaiši pelēks",
      hex: "#9ca3af",
      type: "Refill",
      typeLabel: "Refill (bez spoles)",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Gaišs un neitrāls pelnu pelēks tonis. Lieliski izceļ modeļa 3D ģeometriju un pilnībā noslēpj slāņu līnijas."
    },
    {
      id: "pla-matte-dark-chocolate",
      material: "PLA Matte",
      category: "pla",
      colorName: "Dark Chocolate (11802)",
      colorLabel: "Tumšā šokolāde",
      hex: "#3d2314",
      type: "Refill",
      typeLabel: "Refill (bez spoles)",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Bagātīgs, dziļš tumšās šokolādes brūns tonis. Izcils dizaina priekšmetiem un koka imitācijas izdrukām."
    },
    {
      id: "pla-matte-dark-brown",
      material: "PLA Matte",
      category: "pla",
      colorName: "Dark Brown (11801)",
      colorLabel: "Tumši brūns",
      hex: "#5c3a21",
      type: "Refill",
      typeLabel: "Refill (bez spoles)",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Silts un piesātināts dabīgā koka un zemes brūnais tonis ar matētu zīdainu virsmu."
    },
    {
      id: "pla-matte-terracotta",
      material: "PLA Matte",
      category: "pla",
      colorName: "Terracotta (11203)",
      colorLabel: "Terakota / Māls",
      hex: "#c85a32",
      type: "Refill",
      typeLabel: "Refill (bez spoles)",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Silts māla un terakotas ķieģeļsarkanais tonis. Īpaši iecienīts vāzēm, podiem un interjera dekoriem."
    },
    {
      id: "pla-matte-dark-blue",
      material: "PLA Matte",
      category: "pla",
      colorName: "Dark Blue (11602)",
      colorLabel: "Tumši zils",
      hex: "#1e3a8a",
      type: "Refill",
      typeLabel: "Refill (bez spoles)",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Karaliski tumši zils, piesātināts tonis ar matētu faktūru."
    },
    {
      id: "pla-matte-marine-blue-spool",
      material: "PLA Matte",
      category: "pla",
      colorName: "Marine Blue (11600)",
      colorLabel: "Jūras zils",
      hex: "#0284c7",
      type: "Spool",
      typeLabel: "Ar oriģinālo spoli",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Komplektā ar oriģinālo Bambu Lab atkārtoti lietojamo spoli un RFID čipu. Svaigs un izteiksmīgs jūras zils."
    },
    {
      id: "pla-matte-ice-blue",
      material: "PLA Matte",
      category: "pla",
      colorName: "Ice Blue (11601)",
      colorLabel: "Ledus zils",
      hex: "#7dd3fc",
      type: "Refill",
      typeLabel: "Refill (bez spoles)",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Gaišs un svaigs leduszils tonis ar maigu matējumu."
    },
    {
      id: "pla-matte-dark-green",
      material: "PLA Matte",
      category: "pla",
      colorName: "Dark Green (11501)",
      colorLabel: "Meža tumši zaļš",
      hex: "#14532d",
      type: "Refill",
      typeLabel: "Refill (bez spoles)",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Dziļš priežu meža tumši zaļais tonis."
    },
    {
      id: "pla-matte-grass-green",
      material: "PLA Matte",
      category: "pla",
      colorName: "Grass Green (11500)",
      colorLabel: "Zāles zaļš",
      hex: "#22c55e",
      type: "Refill",
      typeLabel: "Refill (bez spoles)",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Dabīgs, sulīgs pavasara zāles zaļais tonis."
    },
    {
      id: "pla-matte-apple-green",
      material: "PLA Matte",
      category: "pla",
      colorName: "Apple Green (11502)",
      colorLabel: "Ābolu zaļš",
      hex: "#84cc16",
      type: "Refill",
      typeLabel: "Refill (bez spoles)",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Košs un dzīvīgs zaļā ābola tonis."
    },
    {
      id: "pla-matte-dark-red",
      material: "PLA Matte",
      category: "pla",
      colorName: "Dark Red (11202)",
      colorLabel: "Tumši sarkans / Bordo",
      hex: "#991b1b",
      type: "Refill",
      typeLabel: "Refill (bez spoles)",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Prestižs un elegants bordo sarkanais tonis."
    },
    {
      id: "pla-matte-scarlet-red-spool",
      material: "PLA Matte",
      category: "pla",
      colorName: "Scarlet Red (11200)",
      colorLabel: "Koši sarkans",
      hex: "#ef4444",
      type: "Spool",
      typeLabel: "Ar oriģinālo spoli",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Komplektā ar oriģinālo spoli un RFID čipu. Spilgti sarkans matēts tonis pamanāmām detaļām."
    },
    {
      id: "pla-matte-lilac-purple",
      material: "PLA Matte",
      category: "pla",
      colorName: "Lilac Purple (11700)",
      colorLabel: "Ceriņu violets",
      hex: "#a855f7",
      type: "Refill",
      typeLabel: "Refill (bez spoles)",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Maigs ceriņkrāsas violets tonis figūrām un mākslas darbiem."
    },
    {
      id: "pla-matte-mandarin-orange",
      material: "PLA Matte",
      category: "pla",
      colorName: "Mandarin Orange (11300)",
      colorLabel: "Mandarīnu oranžs",
      hex: "#f97316",
      type: "Refill",
      typeLabel: "Refill (bez spoles)",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Silts un košs mandarīnu oranžais tonis."
    },
    {
      id: "pla-matte-ivory-white-spool",
      material: "PLA Matte",
      category: "pla",
      colorName: "Ivory White (11100)",
      colorLabel: "Ziloņkaula balts",
      hex: "#f8fafc",
      type: "Spool",
      typeLabel: "Ar oriģinālo spoli",
      price: 14.99,
      stock: 2,
      weight: "1 kg",
      desc: "Komplektā ar oriģinālo spoli un RFID čipu. Kristāldzidrs, zīdains matēts baltais bez spīduma."
    },

    // === PETG MATTE (1kg, 1.75mm) ===
    {
      id: "petg-matte-lime-spool",
      material: "PETG Matte",
      category: "petg",
      colorName: "Lime (35500)",
      colorLabel: "Laims",
      hex: "#a3e635",
      type: "Spool",
      typeLabel: "Ar oriģinālo spoli",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Ar spoli un RFID. Apvieno PETG triecienizturību un ūdensizturību ar košu, matētu laima toni."
    },
    {
      id: "petg-matte-avocado-green-spool",
      material: "PETG Matte",
      category: "petg",
      colorName: "Avocado Green (35501)",
      colorLabel: "Avokado zaļš",
      hex: "#65a30d",
      type: "Spool",
      typeLabel: "Ar oriģinālo spoli",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Ar spoli un RFID. Moderns militāri zaļgans tonis izturīgām mehāniskām detaļām."
    },
    {
      id: "petg-matte-baby-blue-spool",
      material: "PETG Matte",
      category: "petg",
      colorName: "Baby Blue (35600)",
      colorLabel: "Debeszils",
      hex: "#93c5fd",
      type: "Spool",
      typeLabel: "Ar oriģinālo spoli",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Ar spoli un RFID. Maigi gaiši zils tonis funkcionāliem korpusiem un detaļām."
    },
    {
      id: "petg-matte-violet-spool",
      material: "PETG Matte",
      category: "petg",
      colorName: "Violet (35702)",
      colorLabel: "Violets",
      hex: "#7c3aed",
      type: "Spool",
      typeLabel: "Ar oriģinālo spoli",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Ar spoli un RFID. Piesātināts matēts violets ar augstu slāņu saķeri."
    },
    {
      id: "petg-matte-pink-spool",
      material: "PETG Matte",
      category: "petg",
      colorName: "Pink (35700)",
      colorLabel: "Rozā",
      hex: "#ec4899",
      type: "Spool",
      typeLabel: "Ar oriģinālo spoli",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Ar spoli un RFID. Izteiksmīgs matēts rozā tonis izturīgiem printiem."
    },
    {
      id: "petg-matte-gray-spool",
      material: "PETG Matte",
      category: "petg",
      colorName: "Gray (35102)",
      colorLabel: "Pelēks",
      hex: "#64748b",
      type: "Spool",
      typeLabel: "Ar oriģinālo spoli",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Ar spoli un RFID. Industriāli pelēks tonis darbnīcas instrumentiem un auto detaļām."
    },
    {
      id: "petg-matte-white-spool",
      material: "PETG Matte",
      category: "petg",
      colorName: "White (35100)",
      colorLabel: "Balts",
      hex: "#ffffff",
      type: "Spool",
      typeLabel: "Ar oriģinālo spoli",
      price: 14.99,
      stock: 3,
      weight: "1 kg",
      desc: "Ar spoli un RFID. Universāls matēts balts PETG ar teicamu UV un laika apstākļu noturību."
    },
    {
      id: "petg-matte-white-refill",
      material: "PETG Matte",
      category: "petg",
      colorName: "White (35100)",
      colorLabel: "Balts",
      hex: "#ffffff",
      type: "Refill",
      typeLabel: "Refill (bez spoles)",
      price: 14.99,
      stock: 3,
      weight: "1 kg",
      desc: "Ekoloģiska uzpilde bez spoles. Der standarta Bambu Lab un citām atkārtotajām spolēm."
    },
    {
      id: "petg-matte-black-spool",
      material: "PETG Matte",
      category: "petg",
      colorName: "Black (35101)",
      colorLabel: "Melns",
      hex: "#18181b",
      type: "Spool",
      typeLabel: "Ar oriģinālo spoli",
      price: 14.99,
      stock: 1,
      weight: "1 kg",
      desc: "Ar spoli un RFID. Mehāniski izturīgs matēti melns PETG funkcionālām detaļām un iekārtām."
    },
    {
      id: "petg-matte-black-refill",
      material: "PETG Matte",
      category: "petg",
      colorName: "Black (35101)",
      colorLabel: "Melns",
      hex: "#18181b",
      type: "Refill",
      typeLabel: "Refill (bez spoles)",
      price: 14.99,
      stock: 3,
      weight: "1 kg",
      desc: "Ekoloģiska uzpilde bez spoles. Dziļi melns matēts tonis, augsta slodzes un triecienu izturība."
    }
  ];

  // --- GROZA STĀVOKLIS (LocalStorage) ---
  const CART_STORAGE_KEY = "3dlab_filament_cart_v1";

  let cart = [];
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) cart = JSON.parse(saved);
  } catch(e) {
    cart = [];
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch(e) {}
    updateCartUI();
  }

  function getCartItemCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getCartSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  function addToCart(productId, qty = 1) {
    const product = BAMBU_FILAMENTS.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      const newQty = cart[existingIndex].quantity + qty;
      if (newQty > product.stock) {
        showToast(`Maksimālais pieejamais daudzums ir ${product.stock} gab.!`, "warning");
        cart[existingIndex].quantity = product.stock;
      } else {
        cart[existingIndex].quantity = newQty;
        showToast(`Pievienots grozam: ${product.material} ${product.colorLabel} (${cart[existingIndex].quantity} gab.)`, "success");
      }
    } else {
      cart.push({
        id: product.id,
        material: product.material,
        colorName: product.colorName,
        colorLabel: product.colorLabel,
        hex: product.hex,
        type: product.type,
        typeLabel: product.typeLabel,
        price: product.price,
        quantity: Math.min(qty, product.stock),
        stock: product.stock
      });
      showToast(`Pievienots grozam: ${product.material} ${product.colorLabel}`, "success");
    }

    saveCart();
  }

  function updateCartQty(productId, qty) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    if (qty <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = Math.min(qty, item.stock);
      saveCart();
    }
  }

  function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
    showToast("Prece izņemta no groza", "info");
  }

  function clearCart() {
    cart = [];
    saveCart();
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(message, type = "success") {
    let container = document.getElementById("shopToastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "shopToastContainer";
      container.className = "shop-toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `shop-toast shop-toast-${type}`;
    toast.innerHTML = `
      <span class="shop-toast-icon">${type === "success" ? "✅" : (type === "warning" ? "⚠️" : "ℹ️")}</span>
      <span class="shop-toast-msg">${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // --- SVG SPOOL GENERATOR ---
  function getSpoolSvg(hex, isRefill = false) {
    // Elegant SVG spool visualizer with custom filament color
    return `
      <svg class="filament-spool-svg" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="grad-coil-${hex.replace('#','')}" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stop-color="${hex}" />
            <stop offset="90%" stop-color="${hex}" stop-opacity="0.8" />
            <stop offset="100%" stop-color="#000" stop-opacity="0.5" />
          </radialGradient>
          <linearGradient id="spool-rim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${isRefill ? '#38bdf8' : '#64748b'}" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0.9" />
          </linearGradient>
        </defs>

        <!-- Outer Rim Flange -->
        <circle cx="80" cy="80" r="72" stroke="url(#spool-rim)" stroke-width="${isRefill ? '3' : '6'}" stroke-dasharray="${isRefill ? '6 4' : 'none'}" fill="rgba(15, 23, 42, 0.5)" />
        
        <!-- Filament Coil -->
        <circle cx="80" cy="80" r="58" fill="url(#grad-coil-${hex.replace('#','')})" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
        
        <!-- Filament Wind Lines -->
        <circle cx="80" cy="80" r="50" stroke="rgba(0,0,0,0.2)" stroke-width="2" fill="none"/>
        <circle cx="80" cy="80" r="42" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" fill="none"/>
        <circle cx="80" cy="80" r="34" stroke="rgba(0,0,0,0.25)" stroke-width="1.5" fill="none"/>
        
        <!-- Spool Core Hub -->
        <circle cx="80" cy="80" r="26" fill="#090d16" stroke="rgba(255,255,255,0.25)" stroke-width="2" />
        <circle cx="80" cy="80" r="14" fill="#030712" stroke="rgba(0,240,255,0.4)" stroke-width="1.5" />

        ${!isRefill ? `
          <!-- Bambu RFID / Spool Windows -->
          <circle cx="80" cy="58" r="4" fill="rgba(255,255,255,0.4)" />
          <circle cx="80" cy="102" r="4" fill="rgba(255,255,255,0.4)" />
          <circle cx="58" cy="80" r="4" fill="rgba(255,255,255,0.4)" />
          <circle cx="102" cy="80" r="4" fill="rgba(255,255,255,0.4)" />
        ` : `
          <!-- Refill Strap Indicator -->
          <rect x="76" y="22" width="8" height="116" fill="rgba(56, 189, 248, 0.25)" rx="4" />
        `}
      </svg>
    `;
  }

  // --- RENDER PRODUCTS GRID ---
  let activeFilter = "all";
  let activeSearch = "";

  function renderProducts() {
    const grid = document.getElementById("shopProductsGrid");
    if (!grid) return;

    let filtered = BAMBU_FILAMENTS;

    if (activeFilter === "pla") {
      filtered = filtered.filter(p => p.category === "pla");
    } else if (activeFilter === "petg") {
      filtered = filtered.filter(p => p.category === "petg");
    } else if (activeFilter === "spool") {
      filtered = filtered.filter(p => p.type === "Spool");
    } else if (activeFilter === "refill") {
      filtered = filtered.filter(p => p.type === "Refill");
    }

    if (activeSearch.trim()) {
      const q = activeSearch.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.material.toLowerCase().includes(q) ||
        p.colorName.toLowerCase().includes(q) ||
        p.colorLabel.toLowerCase().includes(q) ||
        p.typeLabel.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="shop-empty-search">
          <p class="empty-icon">🔍</p>
          <h3>Nav atrasts neviens filaments</h3>
          <p>Mēģini izvēlēties citu filtru vai nodzēst meklēšanas frāzi.</p>
          <button type="button" class="btn btn-secondary btn-sm" id="shopResetFilterBtn">Rādīt visus filamentus</button>
        </div>
      `;
      const resetBtn = document.getElementById("shopResetFilterBtn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          activeFilter = "all";
          activeSearch = "";
          const searchInput = document.getElementById("shopSearchInput");
          if (searchInput) searchInput.value = "";
          updateFilterPills();
          renderProducts();
        });
      }
      return;
    }

    grid.innerHTML = filtered.map(p => {
      const isSpool = p.type === "Spool";
      return `
        <div class="product-card glass-panel" data-id="${p.id}">
          <div class="product-card-top">
            <div class="product-badges">
              <span class="badge-mat ${p.category}">${p.material}</span>
              <span class="badge-type ${isSpool ? 'type-spool' : 'type-refill'}">
                ${isSpool ? '📦 Ar spoli + RFID' : '♻️ Refill'}
              </span>
            </div>
            <div class="product-stock-tag">
              <span class="stock-dot"></span> Noliktavā: ${p.stock} gab.
            </div>
          </div>

          <div class="product-img-wrap">
            ${getSpoolSvg(p.hex, !isSpool)}
            <div class="color-swatch-badge">
              <span class="color-dot" style="background-color: ${p.hex}; border: ${p.hex.toLowerCase() === '#ffffff' ? '1px solid #94a3b8' : 'none'}"></span>
              <span class="color-name">${p.colorLabel}</span>
            </div>
          </div>

          <div class="product-details">
            <div class="product-code-row">
              <span class="product-code">${p.colorName}</span>
              <span class="product-weight">1 kg • 1.75 mm</span>
            </div>
            <h3 class="product-title">${p.material} — ${p.colorLabel}</h3>
            <p class="product-desc">${p.desc}</p>

            <div class="product-footer">
              <div class="price-wrap">
                <span class="price-val">${p.price.toFixed(2)} €</span>
                <span class="price-unit">/ spole</span>
              </div>
              <button type="button" class="btn btn-primary btn-sm btn-add-cart" data-id="${p.id}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <span>Grozā</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    // Attach Add to Cart event listeners
    grid.querySelectorAll(".btn-add-cart").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = btn.getAttribute("data-id");
        addToCart(id, 1);
        
        // Micro animation
        btn.classList.add("added");
        setTimeout(() => btn.classList.remove("added"), 600);
      });
    });
  }

  function updateFilterPills() {
    document.querySelectorAll(".shop-filter-pill").forEach(pill => {
      const filter = pill.getAttribute("data-filter");
      if (filter === activeFilter) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
    });
  }

  // --- CART UI & MODAL ---
  let selectedDelivery = "omniva";
  const DELIVERY_COSTS = {
    omniva: 3.50,
    pickup: 0.00
  };

  function updateCartUI() {
    const count = getCartItemCount();
    const subtotal = getCartSubtotal();

    // 1. Header Cart Badge
    const headerCartCount = document.getElementById("headerCartCount");
    if (headerCartCount) {
      headerCartCount.textContent = count;
      headerCartCount.style.display = count > 0 ? "inline-flex" : "none";
    }

    // 2. Floating Cart Button
    const floatingCart = document.getElementById("floatingCartBtn");
    const floatingCount = document.getElementById("floatingCartCount");
    if (floatingCart) {
      if (count > 0) {
        floatingCart.classList.add("visible");
      } else {
        floatingCart.classList.remove("visible");
      }
    }
    if (floatingCount) {
      floatingCount.textContent = count;
    }

    // 3. Cart Modal Content
    renderCartModalItems();
  }

  function renderCartModalItems() {
    const listEl = document.getElementById("cartItemsList");
    const emptyEl = document.getElementById("cartEmptyView");
    const filledEl = document.getElementById("cartFilledView");
    const subtotalEl = document.getElementById("cartSubtotalVal");
    const deliveryCostEl = document.getElementById("cartDeliveryCostVal");
    const totalEl = document.getElementById("cartTotalVal");
    const checkoutBtn = document.getElementById("cartCheckoutSubmitBtn");

    if (!listEl) return;

    if (cart.length === 0) {
      if (emptyEl) emptyEl.style.display = "block";
      if (filledEl) filledEl.style.display = "none";
      return;
    }

    if (emptyEl) emptyEl.style.display = "none";
    if (filledEl) filledEl.style.display = "block";

    listEl.innerHTML = cart.map(item => {
      const itemTotal = (item.price * item.quantity).toFixed(2);
      return `
        <div class="cart-item-row" data-id="${item.id}">
          <div class="cart-item-color-dot" style="background-color: ${item.hex}; border: ${item.hex.toLowerCase() === '#ffffff' ? '1px solid #94a3b8' : 'none'}"></div>
          <div class="cart-item-info">
            <div class="cart-item-title">${item.material} — ${item.colorLabel}</div>
            <div class="cart-item-meta">
              <span class="cart-meta-badge">${item.typeLabel}</span>
              <span class="cart-meta-code">${item.colorName}</span>
            </div>
          </div>
          <div class="cart-item-stepper">
            <button type="button" class="btn-step btn-step-minus" data-id="${item.id}">-</button>
            <span class="step-qty">${item.quantity}</span>
            <button type="button" class="btn-step btn-step-plus" data-id="${item.id}">+</button>
          </div>
          <div class="cart-item-price">${itemTotal} €</div>
          <button type="button" class="btn-cart-remove" data-id="${item.id}" title="Dzēst preci">✕</button>
        </div>
      `;
    }).join("");

    // Stepper & Remove events
    listEl.querySelectorAll(".btn-step-minus").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const item = cart.find(i => i.id === id);
        if (item) updateCartQty(id, item.quantity - 1);
      });
    });

    listEl.querySelectorAll(".btn-step-plus").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const item = cart.find(i => i.id === id);
        if (item) updateCartQty(id, item.quantity + 1);
      });
    });

    listEl.querySelectorAll(".btn-cart-remove").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        removeFromCart(id);
      });
    });

    // Sums
    const subtotal = getCartSubtotal();
    const deliveryCost = DELIVERY_COSTS[selectedDelivery] || 0;
    const total = subtotal + deliveryCost;

    if (subtotalEl) subtotalEl.textContent = `${subtotal.toFixed(2)} €`;
    if (deliveryCostEl) deliveryCostEl.textContent = deliveryCost > 0 ? `+${deliveryCost.toFixed(2)} €` : `Bezmaksas`;
    if (totalEl) totalEl.textContent = `${total.toFixed(2)} €`;
    if (checkoutBtn) checkoutBtn.innerHTML = `<span>Apstiprināt pasūtījumu (${total.toFixed(2)} €)</span> <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`;
  }

  function openCartModal() {
    const modal = document.getElementById("cartModal");
    if (!modal) return;
    renderCartModalItems();
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeCartModal() {
    const modal = document.getElementById("cartModal");
    if (!modal) return;
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }

  // --- SUBMIT CART ORDER ---
  async function handleCartCheckout(e) {
    e.preventDefault();
    if (cart.length === 0) {
      showToast("Grozs ir tukšs!", "warning");
      return;
    }

    const form = document.getElementById("cartCheckoutForm");
    const submitBtn = document.getElementById("cartCheckoutSubmitBtn");
    const statusMsg = document.getElementById("cartStatusMsg");

    const name = document.getElementById("cartClientName").value.trim();
    const phone = document.getElementById("cartClientPhone").value.trim();
    const email = document.getElementById("cartClientEmail").value.trim();
    const address = document.getElementById("cartDeliveryAddress").value.trim();
    const notes = document.getElementById("cartNotes").value.trim();

    if (!name || !phone || !email) {
      showCartError("Lūdzu aizpildiet visus obligātos laukus (Vārds, Tālrunis, E-pasts)!");
      return;
    }

    if (selectedDelivery === "omniva" && !address) {
      showCartError("Lūdzu norādiet vēlamo Omniva pakomātu!");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-inline"></span> Apstrādā pasūtījumu...`;
    hideCartStatus();

    try {
      const orderId = `#FIL-${Math.floor(1000 + Math.random() * 9000)}`;
      const subtotal = getCartSubtotal();
      const deliveryCost = DELIVERY_COSTS[selectedDelivery];
      const total = subtotal + deliveryCost;

      // Format clean readable bulleted list for Telegram
      const itemsList = cart.map((item, idx) => {
        return `• <b>${escapeHtml(item.material)}</b> — ${escapeHtml(item.colorLabel)} (${escapeHtml(item.colorName)}) [${escapeHtml(item.typeLabel)}] × <b>${item.quantity} gab.</b> = ${(item.price * item.quantity).toFixed(2)} €`;
      }).join("\n");

      const deliveryName = selectedDelivery === "omniva" ? "Omniva Pakomāts (+3.50 €)" : "Saņemšana uz vietas (Jēkabpils, J.Raiņa 87) [Bezmaksas]";

      const formData = new FormData();
      formData.append("order_type", "FILAMENT_SHOP");
      formData.append("order_id", orderId);
      formData.append("client_name", name);
      formData.append("client_phone", phone);
      formData.append("client_email", email);
      formData.append("delivery", deliveryName);
      formData.append("delivery_address", selectedDelivery === "omniva" ? address : "Saņemšana uz vietas Jēkabpilī");
      formData.append("notes", notes || "Nav norādīti");
      formData.append("items_list", itemsList);
      formData.append("items_count", getCartItemCount().toString());
      formData.append("subtotal", `${subtotal.toFixed(2)} €`);
      formData.append("delivery_cost", deliveryCost > 0 ? `${deliveryCost.toFixed(2)} €` : "0.00 €");
      formData.append("total_price", `${total.toFixed(2)} €`);
      formData.append("order_time", new Date().toLocaleString("lv-LV"));

      // Send to serverless Cloudflare Worker endpoint /api/order
      const response = await fetch("/api/order", {
        method: "POST",
        body: formData
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Neizdevās nosūtīt pasūtījumu.");
      }

      // Success! Clear cart & show success modal
      clearCart();
      closeCartModal();
      form.reset();

      const successModal = document.getElementById("successModal");
      const successOrderId = document.getElementById("successOrderId");
      if (successOrderId) successOrderId.textContent = orderId;
      if (successModal) successModal.classList.remove("hidden");

    } catch(err) {
      console.error("Cart checkout error:", err);
      showCartError(`Kļūda: ${err.message || "Neizdevās nosūtīt pasūtījumu"}. Lūdzu rakstiet uz autosargs@gmail.com`);
    } finally {
      submitBtn.disabled = false;
      renderCartModalItems();
    }
  }

  function showCartError(msg) {
    const el = document.getElementById("cartStatusMsg");
    if (!el) return;
    el.textContent = msg;
    el.className = "form-status-msg error";
    el.classList.remove("hidden");
  }

  function hideCartStatus() {
    const el = document.getElementById("cartStatusMsg");
    if (!el) return;
    el.textContent = "";
    el.classList.add("hidden");
  }

  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // --- INITIALIZATION ---
  function initShop() {
    renderProducts();
    updateCartUI();

    // Filter pills
    document.querySelectorAll(".shop-filter-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        activeFilter = pill.getAttribute("data-filter");
        updateFilterPills();
        renderProducts();
      });
    });

    // Search input
    const searchInput = document.getElementById("shopSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        activeSearch = e.target.value;
        renderProducts();
      });
    }

    // Cart modal open buttons
    const headerCartBtn = document.getElementById("headerCartBtn");
    if (headerCartBtn) {
      headerCartBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openCartModal();
      });
    }

    const floatingCartBtn = document.getElementById("floatingCartBtn");
    if (floatingCartBtn) {
      floatingCartBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openCartModal();
      });
    }

    // Cart modal close
    const closeBtn = document.getElementById("closeCartModalBtn");
    if (closeBtn) closeBtn.addEventListener("click", closeCartModal);

    const cancelBtn = document.getElementById("cancelCartBtn");
    if (cancelBtn) cancelBtn.addEventListener("click", closeCartModal);

    const backdrop = document.getElementById("cartModal");
    if (backdrop) {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) closeCartModal();
      });
    }

    // Delivery Radio Toggle in Cart
    document.querySelectorAll("input[name='cart_delivery']").forEach(radio => {
      radio.addEventListener("change", (e) => {
        selectedDelivery = e.target.value;
        
        // Update radio parent class
        document.querySelectorAll(".cart-delivery-radio").forEach(lbl => {
          lbl.classList.toggle("selected", lbl.querySelector("input").checked);
        });

        // Toggle address input
        const addrWrap = document.getElementById("cartDeliveryAddressWrap");
        const addrInput = document.getElementById("cartDeliveryAddress");
        if (selectedDelivery === "omniva") {
          if (addrWrap) addrWrap.style.display = "block";
          if (addrInput) addrInput.required = true;
        } else {
          if (addrWrap) addrWrap.style.display = "none";
          if (addrInput) addrInput.required = false;
        }

        renderCartModalItems();
      });
    });

    // Checkout form submit
    const checkoutForm = document.getElementById("cartCheckoutForm");
    if (checkoutForm) {
      checkoutForm.addEventListener("submit", handleCartCheckout);
    }
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initShop);
  } else {
    initShop();
  }

})();
