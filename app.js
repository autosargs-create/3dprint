/* ==========================================================================
   JONYZ 3D PRINT LAB — APPLICATION ENGINE (app.js)
   - Three.js 3D Viewport with OrbitControls & STLLoader
   - Real-time Mesh Volume & Dimension Analysis (Signed Tetrahedra)
   - Instant Slicer & Material Cost Calculator
   - Real STL Model Preset Loader (Benchy, Phone Stand, Hanger, Organizer)
   - Order Checkout & Email Dispatch (autosargs@gmail.com)
   ========================================================================== */

(function() {
  "use strict";

  // --- CONFIGURATION & MATERIAL SPECS ---
  const MATERIAL_SPECS = {
    PETG: { name: "PETG", density: 1.27, pricePerGram: 0.06, color: 0x00f0ff, roughness: 0.35, metalness: 0.1 },
    PLA:  { name: "PLA",  density: 1.24, pricePerGram: 0.05, color: 0xe2e8f0, roughness: 0.5,  metalness: 0.05 },
    TPU:  { name: "TPU",  density: 1.21, pricePerGram: 0.09, color: 0x38bdf8, roughness: 0.7,  metalness: 0.0 },
    ASA:  { name: "ASA",  density: 1.07, pricePerGram: 0.08, color: 0x334155, roughness: 0.6,  metalness: 0.1 }
  };

  const COLOR_HEX_MAP = {
    "Melna":   0x1e212b,
    "Pelēka":  0x64748b,
    "Balta":   0xf1f5f9,
    "Sarkana": 0xe63946,
    "Oranža":  0xff6b00,
    "Zila":    0x0080ff
  };

  const LAYER_TIME_FACTORS = {
    "0.28": 0.75, // Draft, fast
    "0.20": 1.00, // Standard
    "0.12": 1.55  // Detailed, slower
  };

  const BASE_SETUP_FEE = 2.50; // EUR
  const MIN_ORDER_TOTAL = 5.00; // EUR
  const MACHINE_HOUR_RATE = 1.60; // EUR/hr approx

  // --- APPLICATION STATE ---
  const state = {
    file: null,
    fileName: "model.stl",
    isPreset: false,
    dimensions: { x: 0, y: 0, z: 0 },
    rawVolumeCm3: 0,
    material: "PETG",
    colorName: "Melna",
    infillPercent: 25,
    layerHeight: "0.20",
    quantity: 1,
    delivery: "Omniva (+3.50 €)",
    deliveryCost: 3.50,
    priceCalculated: {
      materialCost: 0,
      setupCost: BASE_SETUP_FEE,
      printTimeHours: 0,
      totalPrice: 0,
      estimatedWeightGrams: 0
    },
    isWireframe: false
  };

  // --- DOM CACHE ---
  const DOM = {
    dropzone: document.getElementById("dropzone"),
    fileInput: document.getElementById("fileInput"),
    browseBtn: document.getElementById("browseBtn"),
    sampleModelBtn: document.getElementById("sampleModelBtn"),
    viewerContainer: document.getElementById("viewerContainer"),
    threeCanvas: document.getElementById("threeCanvas"),
    loadedFileName: document.getElementById("loadedFileName"),
    changeFileBtn: document.getElementById("changeFileBtn"),
    resetCameraBtn: document.getElementById("resetCameraBtn"),
    wireframeToggleBtn: document.getElementById("wireframeToggleBtn"),

    metricDimensions: document.getElementById("metricDimensions"),
    metricVolume: document.getElementById("metricVolume"),
    metricWeight: document.getElementById("metricWeight"),

    infillSlider: document.getElementById("infillSlider"),
    infillValueDisplay: document.getElementById("infillValueDisplay"),
    layerQualitySelect: document.getElementById("layerQualitySelect"),
    qtyMinus: document.getElementById("qtyMinus"),
    qtyPlus: document.getElementById("qtyPlus"),
    qtyInput: document.getElementById("qtyInput"),

    costBreakdown: document.getElementById("costBreakdown"),
    setupCost: document.getElementById("setupCost"),
    totalPriceDisplay: document.getElementById("totalPriceDisplay"),
    proceedOrderBtn: document.getElementById("proceedOrderBtn"),

    // Modals
    orderModal: document.getElementById("orderModal"),
    closeModalBtn: document.getElementById("closeModalBtn"),
    cancelModalBtn: document.getElementById("cancelModalBtn"),
    orderSubmitForm: document.getElementById("orderSubmitForm"),
    modalFileName: document.getElementById("modalFileName"),
    modalMaterialInfo: document.getElementById("modalMaterialInfo"),
    modalQualityInfo: document.getElementById("modalQualityInfo"),
    modalTotalPrice: document.getElementById("modalTotalPrice"),
    formStatusMsg: document.getElementById("formStatusMsg"),
    submitOrderBtn: document.getElementById("submitOrderBtn"),

    successModal: document.getElementById("successModal"),
    successOrderId: document.getElementById("successOrderId"),
    successDoneBtn: document.getElementById("successDoneBtn")
  };

  // --- THREE.JS ENGINE VARIABLES ---
  let scene, camera, renderer, controls, currentMesh, printBedGroup;
  let isThreeInitialized = false;

  // =========================================================================
  // 1. THREE.JS 3D INITIALIZATION & VIEWER
  // =========================================================================
  function initThree() {
    if (isThreeInitialized) return;

    const width = DOM.viewerContainer.clientWidth || 600;
    const height = DOM.viewerContainer.clientHeight || 420;

    // 1. Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c12);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(130, 160, 180);

    // 3. WebGL Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: DOM.threeCanvas,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't go under bed
    controls.minDistance = 20;
    controls.maxDistance = 800;

    // 5. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
    keyLight.position.set(120, 220, 120);
    scene.add(keyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x00f0ff, 0.65);
    cyanRimLight.position.set(-140, 90, -130);
    scene.add(cyanRimLight);

    const warmFillLight = new THREE.DirectionalLight(0xffaa44, 0.4);
    warmFillLight.position.set(120, 60, -90);
    scene.add(warmFillLight);

    // 6. Print Bed (250x250mm standard Prusa/Bambu build volume)
    createPrintBed();

    // 7. Render Loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // 8. Resize Listener
    window.addEventListener("resize", onWindowResize);

    isThreeInitialized = true;
  }

  function createPrintBed() {
    printBedGroup = new THREE.Group();

    // Base plate grid (250 x 250 mm)
    const bedSize = 250;
    const gridHelper = new THREE.GridHelper(bedSize, 25, 0x00f0ff, 0x1e2638);
    gridHelper.position.y = 0;
    printBedGroup.add(gridHelper);

    // Bed border line
    const borderGeo = new THREE.BufferGeometry();
    const half = bedSize / 2;
    const borderPoints = new Float32Array([
      -half, 0, -half,   half, 0, -half,
       half, 0, -half,   half, 0,  half,
       half, 0,  half,  -half, 0,  half,
      -half, 0,  half,  -half, 0, -half
    ]);
    borderGeo.setAttribute("position", new THREE.BufferAttribute(borderPoints, 3));
    const borderMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, opacity: 0.4, transparent: true });
    const borderLine = new THREE.LineSegments(borderGeo, borderMat);
    printBedGroup.add(borderLine);

    scene.add(printBedGroup);
  }

  function onWindowResize() {
    if (!renderer || !camera || !DOM.viewerContainer) return;
    const width = DOM.viewerContainer.clientWidth;
    const height = DOM.viewerContainer.clientHeight || 420;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  // =========================================================================
  // 2. MESH VOLUME & GEOMETRY CALCULATIONS
  // =========================================================================
  function calculateMeshVolume(geometry) {
    let position = geometry.attributes.position;
    let faces = position.count / 3;
    let signedVolumeSum = 0;

    const p1 = new THREE.Vector3();
    const p2 = new THREE.Vector3();
    const p3 = new THREE.Vector3();

    for (let i = 0; i < faces; i++) {
      p1.fromBufferAttribute(position, i * 3 + 0);
      p2.fromBufferAttribute(position, i * 3 + 1);
      p3.fromBufferAttribute(position, i * 3 + 2);

      signedVolumeSum += (
        -p3.x * p2.y * p1.z +
         p2.x * p3.y * p1.z +
         p3.x * p1.y * p2.z -
         p1.x * p3.y * p2.z -
         p2.x * p1.y * p3.z +
         p1.x * p2.y * p3.z
      ) / 6.0;
    }

    const volumeCm3 = Math.abs(signedVolumeSum) / 1000.0;
    return volumeCm3 > 0.01 ? volumeCm3 : 1.0;
  }

  // =========================================================================
  // 3. LOAD & DISPLAY STL GEOMETRY
  // =========================================================================
  function displayLoadedGeometry(geometry, modelName) {
    initThree();

    // Remove previous model
    if (currentMesh) {
      scene.remove(currentMesh);
      if (currentMesh.geometry) currentMesh.geometry.dispose();
      if (currentMesh.material) currentMesh.material.dispose();
      currentMesh = null;
    }

    // Geometry normalization & orientation
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();

    const bbox = geometry.boundingBox;
    const sizeX = Math.round(Math.abs(bbox.max.x - bbox.min.x) * 10) / 10;
    const sizeY = Math.round(Math.abs(bbox.max.y - bbox.min.y) * 10) / 10;
    const sizeZ = Math.round(Math.abs(bbox.max.z - bbox.min.z) * 10) / 10;

    // Center geometry horizontally and stand on print bed plane (min.y = 0)
    geometry.center();
    geometry.computeBoundingBox();
    const heightOffset = -geometry.boundingBox.min.y;
    geometry.translate(0, heightOffset, 0);

    // Material setup
    const targetColor = COLOR_HEX_MAP[state.colorName] || 0x1e212b;
    const material = new THREE.MeshStandardMaterial({
      color: targetColor,
      roughness: 0.35,
      metalness: 0.15,
      wireframe: state.isWireframe
    });

    currentMesh = new THREE.Mesh(geometry, material);
    currentMesh.castShadow = true;
    currentMesh.receiveShadow = true;
    scene.add(currentMesh);

    // Volume & specs calculation
    const volumeCm3 = calculateMeshVolume(geometry);

    state.fileName = modelName || "model.stl";
    state.dimensions = { x: sizeX, y: sizeY, z: sizeZ };
    state.rawVolumeCm3 = volumeCm3;

    // UI Updates
    DOM.dropzone.classList.add("hidden");
    DOM.viewerContainer.classList.remove("hidden");
    DOM.loadedFileName.textContent = state.fileName;

    onWindowResize();

    // Camera framing
    const sphere = geometry.boundingSphere;
    const radius = sphere ? sphere.radius : 60;
    controls.target.set(0, sizeY / 2, 0);
    camera.position.set(radius * 1.8, radius * 1.5 + 20, radius * 2.2);
    controls.update();

    // Recalculate price and metrics
    recalculatePrice();
  }

  // Load Real STL from Server / Static Folder
  function loadPresetSTL(modelPath, modelName) {
    initThree();
    DOM.dropzone.classList.add("hidden");
    DOM.viewerContainer.classList.remove("hidden");
    DOM.loadedFileName.textContent = `Ielādē: ${modelName}...`;

    const loader = new THREE.STLLoader();
    loader.load(
      modelPath,
      function(geometry) {
        displayLoadedGeometry(geometry, modelName);
      },
      function(xhr) {
        if (xhr.lengthComputable) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          DOM.loadedFileName.textContent = `Ielādē ${modelName} (${percent}%)...`;
        }
      },
      function(err) {
        console.error("Failed to load preset STL:", err);
        alert(`Neizdevās ielādēt modeli: ${modelPath}`);
      }
    );
  }

  // =========================================================================
  // 4. PRICE & WEIGHT CALCULATOR
  // =========================================================================
  function recalculatePrice() {
    const matInfo = MATERIAL_SPECS[state.material] || MATERIAL_SPECS.PETG;
    const density = matInfo.density;
    const ratePerGram = matInfo.pricePerGram;

    // Effective volume based on perimeter shells + infill
    const infillRatio = state.infillPercent / 100.0;
    const effectiveVolumeFactor = 0.28 + (0.72 * infillRatio);
    const printedVolumeCm3 = state.rawVolumeCm3 * effectiveVolumeFactor;

    // Estimated weight in grams
    const singleWeightGrams = Math.round(printedVolumeCm3 * density * 10) / 10;
    const totalWeightGrams = Math.round(singleWeightGrams * state.quantity * 10) / 10;

    // Layer time multiplier
    const qualityFactor = LAYER_TIME_FACTORS[state.layerHeight] || 1.0;

    // Estimated print time (e.g. approx 16-18g/hr on standard coreXY)
    const hoursPerPiece = Math.max(0.4, (singleWeightGrams / 18.0) * qualityFactor);
    const totalHours = hoursPerPiece * state.quantity;

    // Costs
    const materialCost = totalWeightGrams * ratePerGram;
    const machineCost = totalHours * MACHINE_HOUR_RATE;
    const subtotal = materialCost + machineCost;
    
    // Total price
    let finalPrice = BASE_SETUP_FEE + subtotal;
    if (finalPrice < MIN_ORDER_TOTAL) {
      finalPrice = MIN_ORDER_TOTAL;
    }

    state.priceCalculated = {
      materialCost: Math.round(subtotal * 100) / 100,
      setupCost: BASE_SETUP_FEE,
      printTimeHours: Math.round(totalHours * 10) / 10,
      totalPrice: Math.round(finalPrice * 100) / 100,
      estimatedWeightGrams: totalWeightGrams
    };

    // Update UI Elements
    if (state.dimensions.x > 0) {
      DOM.metricDimensions.textContent = `${state.dimensions.x} × ${state.dimensions.y} × ${state.dimensions.z} mm`;
      DOM.metricVolume.textContent = `${state.rawVolumeCm3.toFixed(1)} cm³`;
      DOM.metricWeight.textContent = `~${singleWeightGrams} g (${state.material})`;
    } else {
      DOM.metricDimensions.textContent = "— mm";
      DOM.metricVolume.textContent = "— cm³";
      DOM.metricWeight.textContent = "— g";
    }

    DOM.costBreakdown.textContent = `${state.priceCalculated.materialCost.toFixed(2)} €`;
    DOM.setupCost.textContent = `${BASE_SETUP_FEE.toFixed(2)} €`;
    DOM.totalPriceDisplay.textContent = `${state.priceCalculated.totalPrice.toFixed(2)} €`;

    // Update 3D model color & material properties
    if (currentMesh && currentMesh.material) {
      const colorHex = COLOR_HEX_MAP[state.colorName] || 0x1e212b;
      currentMesh.material.color.setHex(colorHex);
      currentMesh.material.roughness = matInfo.roughness;
      currentMesh.material.needsUpdate = true;
    }
  }

  // =========================================================================
  // 5. FILE UPLOAD & PARSING HANDLERS
  // =========================================================================
  function handleFileUpload(file) {
    if (!file) return;
    const fileName = file.name;
    const ext = fileName.split(".").pop().toLowerCase();

    if (ext !== "stl") {
      alert("Lūdzu augšupielādējiet .STL 3D modeļa failu.");
      return;
    }

    state.file = file;
    state.isPreset = false;

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const buffer = e.target.result;
        const loader = new THREE.STLLoader();
        const geometry = loader.parse(buffer);
        displayLoadedGeometry(geometry, fileName);
      } catch (err) {
        console.error("Error parsing STL file:", err);
        alert("Kļūda lasot STL failu. Pārliecinieties, ka fails nav bojāts.");
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // =========================================================================
  // 6. EVENT LISTENERS
  // =========================================================================
  function initEvents() {
    // Dropzone Click & Drag
    DOM.dropzone.addEventListener("click", () => DOM.fileInput.click());
    DOM.browseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      DOM.fileInput.click();
    });

    DOM.fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
      }
    });

    DOM.dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      DOM.dropzone.classList.add("dragover");
    });

    DOM.dropzone.addEventListener("dragleave", () => {
      DOM.dropzone.classList.remove("dragover");
    });

    DOM.dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      DOM.dropzone.classList.remove("dragover");
      if (e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files[0]);
      }
    });

    // Sample Model Button (Loads official 3DBenchy!)
    DOM.sampleModelBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      loadPresetSTL("models/benchy.stl", "3D Benchy Kuģītis.stl");
    });

    // Change File
    DOM.changeFileBtn.addEventListener("click", () => {
      DOM.fileInput.value = "";
      DOM.fileInput.click();
    });

    // Reset Camera
    DOM.resetCameraBtn.addEventListener("click", () => {
      if (currentMesh && currentMesh.geometry) {
        const radius = currentMesh.geometry.boundingSphere ? currentMesh.geometry.boundingSphere.radius : 60;
        controls.target.set(0, state.dimensions.y / 2, 0);
        camera.position.set(radius * 1.8, radius * 1.5 + 20, radius * 2.2);
        controls.update();
      }
    });

    // Wireframe Toggle
    DOM.wireframeToggleBtn.addEventListener("click", () => {
      state.isWireframe = !state.isWireframe;
      if (currentMesh && currentMesh.material) {
        currentMesh.material.wireframe = state.isWireframe;
      }
    });

    // --- MATERIAL SELECTION (DIRECT PILL CLICK & INPUT CHANGE) ---
    document.querySelectorAll(".material-pill").forEach(pill => {
      pill.addEventListener("click", function(e) {
        const radio = this.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
          document.querySelectorAll(".material-pill").forEach(p => p.classList.remove("selected"));
          this.classList.add("selected");
          state.material = radio.value;
          recalculatePrice();
        }
      });
    });

    // --- COLOR SELECTION (DIRECT DOT CLICK & INPUT CHANGE) ---
    document.querySelectorAll(".color-dot-wrap").forEach(wrap => {
      wrap.addEventListener("click", function(e) {
        const radio = this.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
          document.querySelectorAll(".color-dot-wrap").forEach(w => w.classList.remove("selected"));
          this.classList.add("selected");
          state.colorName = radio.value;
          recalculatePrice();
        }
      });
    });

    // Infill Slider
    DOM.infillSlider.addEventListener("input", (e) => {
      const val = parseInt(e.target.value);
      state.infillPercent = val;
      let label = "Standarta";
      if (val <= 15) label = "Viegls";
      else if (val <= 30) label = "Optimāls";
      else if (val <= 60) label = "Izturīgs";
      else label = "Monolīts";
      DOM.infillValueDisplay.textContent = `${val}% — ${label}`;
      recalculatePrice();
    });

    // Layer Height Selection
    DOM.layerQualitySelect.addEventListener("change", (e) => {
      state.layerHeight = e.target.value;
      recalculatePrice();
    });

    // Quantity Controls
    DOM.qtyMinus.addEventListener("click", () => {
      if (state.quantity > 1) {
        state.quantity--;
        DOM.qtyInput.value = state.quantity;
        recalculatePrice();
      }
    });

    DOM.qtyPlus.addEventListener("click", () => {
      if (state.quantity < 500) {
        state.quantity++;
        DOM.qtyInput.value = state.quantity;
        recalculatePrice();
      }
    });

    DOM.qtyInput.addEventListener("change", (e) => {
      let val = parseInt(e.target.value) || 1;
      if (val < 1) val = 1;
      if (val > 500) val = 500;
      state.quantity = val;
      DOM.qtyInput.value = val;
      recalculatePrice();
    });

    // --- PRESETS CATALOG SELECTION (REAL STL LOADER) ---
    document.querySelectorAll(".select-preset-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.dataset.name;
        const modelFile = btn.dataset.model;
        const mat = btn.dataset.material || "PETG";
        const infill = parseInt(btn.dataset.infill) || 25;

        // Set material
        state.material = mat;
        const targetPill = document.querySelector(`.material-pill input[value="${mat}"]`);
        if (targetPill) {
          targetPill.checked = true;
          document.querySelectorAll(".material-pill").forEach(p => p.classList.remove("selected"));
          targetPill.closest(".material-pill").classList.add("selected");
        }

        // Set infill
        state.infillPercent = infill;
        DOM.infillSlider.value = infill;
        DOM.infillValueDisplay.textContent = `${infill}% — Ieteicamais`;

        // Load REAL STL MODEL file!
        if (modelFile) {
          loadPresetSTL(modelFile, `${name}.stl`);
        }

        // Smooth scroll to calculator
        document.getElementById("calculator").scrollIntoView({ behavior: "smooth" });
      });
    });

    // Delivery Radio Change in Modal
    document.querySelectorAll(".delivery-radio").forEach(radioWrap => {
      radioWrap.addEventListener("click", function() {
        const radio = this.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
          document.querySelectorAll(".delivery-radio").forEach(r => r.classList.remove("selected"));
          this.classList.add("selected");
          state.delivery = radio.value;
          updateModalTotals();
        }
      });
    });

    // Modal Open & Close
    DOM.proceedOrderBtn.addEventListener("click", openOrderModal);
    DOM.closeModalBtn.addEventListener("click", closeOrderModal);
    DOM.cancelModalBtn.addEventListener("click", closeOrderModal);

    DOM.orderModal.addEventListener("click", (e) => {
      if (e.target === DOM.orderModal) closeOrderModal();
    });

    DOM.successDoneBtn.addEventListener("click", () => {
      DOM.successModal.classList.add("hidden");
    });

    // Form Submission
    DOM.orderSubmitForm.addEventListener("submit", handleOrderSubmit);
  }

  // =========================================================================
  // 7. ORDER MODAL & SUBMISSION (TO autosargs@gmail.com)
  // =========================================================================
  function updateModalTotals() {
    let deliveryExtra = 0;
    if (state.delivery.includes("Omniva") || state.delivery.includes("DPD")) {
      deliveryExtra = 3.50;
    }
    const finalWithDelivery = state.priceCalculated.totalPrice + deliveryExtra;
    DOM.modalTotalPrice.textContent = `${finalWithDelivery.toFixed(2)} €`;
  }

  function openOrderModal() {
    if (!state.fileName || state.priceCalculated.totalPrice <= 0) {
      alert("Lūdzu, vispirms augšupielādējiet 3D modeli vai izvēlieties gatavu dizainu!");
      return;
    }

    DOM.modalFileName.textContent = state.fileName;
    DOM.modalMaterialInfo.textContent = `${state.material} | Krāsa: ${state.colorName}`;
    DOM.modalQualityInfo.textContent = `Pildījums: ${state.infillPercent}% | Slānis: ${state.layerHeight}mm | Skaits: ${state.quantity} gab.`;
    updateModalTotals();

    // Prepare structured summary for submission
    const summaryText = `
=== JAUNS 3D DRUKAS PASŪTĪJUMS ===
Fails/Modelis: ${state.fileName}
Izmēri: ${state.dimensions.x} x ${state.dimensions.y} x ${state.dimensions.z} mm
Tilpums: ${state.rawVolumeCm3.toFixed(1)} cm³
Paredzamais svars: ${state.priceCalculated.estimatedWeightGrams} g
Materiāls: ${state.material} (${state.colorName})
Pildījums (Infill): ${state.infillPercent}%
Slāņa augstums: ${state.layerHeight} mm
Skaits: ${state.quantity} gab.
Drukas laiks: ~${state.priceCalculated.printTimeHours} h
Bāzes cena: ${state.priceCalculated.totalPrice.toFixed(2)} €
Piegādes veids: ${state.delivery}
==================================
`;
    document.getElementById("formOrderDetails").value = summaryText.trim();

    DOM.formStatusMsg.classList.add("hidden");
    DOM.orderModal.classList.remove("hidden");
  }

  function closeOrderModal() {
    DOM.orderModal.classList.add("hidden");
  }

  async function handleOrderSubmit(e) {
    e.preventDefault();

    const form = DOM.orderSubmitForm;
    const clientName = form.elements["name"].value.trim();
    const clientPhone = form.elements["phone"].value.trim();
    const clientEmail = form.elements["email"].value.trim();
    const clientAddress = form.elements["delivery_address"].value.trim();
    const clientNotes = form.elements["notes"].value.trim();

    if (!clientName || !clientPhone || !clientEmail || !clientAddress) {
      showFormError("Lūdzu, aizpildiet visus ar zvaigznīti (*) atzīmētos laukus!");
      return;
    }

    DOM.submitOrderBtn.disabled = true;
    DOM.submitOrderBtn.innerHTML = `<span>Sūta datus...</span>`;

    const orderId = `#3D-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload = {
      order_id: orderId,
      recipient: "autosargs@gmail.com",
      client_name: clientName,
      client_phone: clientPhone,
      client_email: clientEmail,
      delivery_type: state.delivery,
      delivery_address: clientAddress,
      notes: clientNotes,
      model_name: state.fileName,
      dimensions: `${state.dimensions.x} × ${state.dimensions.y} × ${state.dimensions.z} mm`,
      volume: `${state.rawVolumeCm3.toFixed(1)} cm³`,
      weight: `${state.priceCalculated.estimatedWeightGrams} g`,
      material: state.material,
      color: state.colorName,
      infill: `${state.infillPercent}%`,
      layer_height: `${state.layerHeight} mm`,
      quantity: state.quantity,
      total_price: DOM.modalTotalPrice.textContent,
      timestamp: new Date().toLocaleString("lv-LV")
    };

    try {
      // Direct Web3Forms submission (Free, reliable, zero backend needed)
      const formData = new FormData();
      formData.append("access_key", "c06efad5-3dprint-jonyz-lab");
      formData.append("subject", `[3D Pasūtījums ${orderId}] No: ${clientName} (${payload.total_price})`);
      formData.append("from_name", "3dprint.jonyz.org");
      formData.append("to_email", "autosargs@gmail.com");
      formData.append("message", JSON.stringify(payload, null, 2));

      let sentSuccessfully = false;

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        });
        const result = await res.json();
        if (result.success) {
          sentSuccessfully = true;
        }
      } catch (networkErr) {
        console.warn("Direct API fetch fallback to mailto intent:", networkErr);
      }

      // If direct form fails or in offline dev, open mailto intent
      if (!sentSuccessfully) {
        const mailSubject = encodeURIComponent(`Jauns 3D Pasūtījums ${orderId} - ${clientName}`);
        const mailBody = encodeURIComponent(`Sveiki!\n\nNosūtu 3D drukas pasūtījumu:\n\nPasūtījuma ID: ${orderId}\nKlients: ${clientName}\nTālrunis: ${clientPhone}\nE-pasts: ${clientEmail}\nPiegāde: ${state.delivery} (${clientAddress})\n\nModelis: ${state.fileName}\nIzmēri: ${payload.dimensions}\nSvars: ${payload.weight}\nMateriāls: ${state.material} (${state.colorName})\nPildījums: ${state.infill}\nSlānis: ${state.layer_height}\nSkaits: ${state.quantity} gab.\nKopējā summa: ${payload.total_price}\n\nKomentāri:\n${clientNotes || "Nav"}\n\n---\nNosūtīts no 3dprint.jonyz.org`);
        
        window.open(`mailto:autosargs@gmail.com?subject=${mailSubject}&body=${mailBody}`, "_blank");
      }

      // Success modal
      DOM.orderModal.classList.add("hidden");
      DOM.successOrderId.textContent = orderId;
      DOM.successModal.classList.remove("hidden");

      form.reset();

    } catch (err) {
      console.error("Submission failed:", err);
      showFormError("Radās kļūda nosūtot pasūtījumu. Lūdzu rakstiet tieši uz autosargs@gmail.com.");
    } finally {
      DOM.submitOrderBtn.disabled = false;
      DOM.submitOrderBtn.innerHTML = `
        <span>Nosūtīt pasūtījumu</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      `;
    }
  }

  function showFormError(msg) {
    DOM.formStatusMsg.textContent = msg;
    DOM.formStatusMsg.className = "form-status-msg error";
    DOM.formStatusMsg.classList.remove("hidden");
  }

  // --- INITIALIZE ON DOM READY ---
  document.addEventListener("DOMContentLoaded", () => {
    initEvents();
    recalculatePrice();
  });

})();
