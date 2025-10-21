


/* ------------------- DOM references ------------------- */
const productList = document.getElementById('productList');
const searchInput = document.getElementById('searchInput');
const cartToggle = document.getElementById('cartToggle');
const cartDrawer = document.getElementById('cartDrawer');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const placeOrderBtn = document.getElementById('placeOrderBtn');
const historyDrawer = document.getElementById('historyDrawer');
const historyBtn = document.getElementById('historyBtn');
const closeHistory = document.getElementById('closeHistory');
const loadHistoryBtn = document.getElementById('loadHistoryBtn');
const historyList = document.getElementById('historyList');
const historyPhone = document.getElementById('historyPhone');

const bottomCartBar = document.getElementById('bottomCartBar');
const bottomCartTotal = document.getElementById('bottomCartTotal');
const bottomCartCount = document.getElementById('bottomCartCount');
const quickPlaceOrder = document.getElementById('quickPlaceOrder');
const openCartDetailed = document.getElementById('openCartDetailed');

const custName = document.getElementById('custName');
const custPhone = document.getElementById('custPhone');
const custAddress = document.getElementById('custAddress');

let cart = [];
let products = [];
let vendorIdGlobal = null;

/* ------------------- Unit helpers ------------------- */
function isDozenUnit(unit) {
  return /dozen|dz/i.test(unit || '');
}
function isKgUnit(unit) {
  return /\bkg\b/i.test(unit || '');
}
function isGramUnit(unit) {
  return /g|gm|gram/i.test(unit || '');
}
// Convert a preset label (like "500 gms" or "1 kg" or "1 pc") into a numeric quantity and its unit
function parsePresetLabel(label) {
  // examples: "25 gms", "500 gms", "750 gms", "1 kg", "1 pc"
  const txt = label.trim().toLowerCase();
  const numMatch = txt.match(/[\d.]+/);
  const num = numMatch ? parseFloat(numMatch[0]) : 1;
  if (txt.includes('kg')) return { value: num, unit: 'kg' };
  if (txt.includes('g')) return { value: num, unit: 'g' };
  if (txt.includes('pc') || txt.includes('piece') || txt.includes('pcs')) return { value: num, unit: 'pc' };
  if (txt.includes('dozen')) return { value: num, unit: 'dozen' };
  return { value: num, unit: 'unknown' };
}

// Normalize user-entered qty (or preset) to the quantity used for price multiplication
// Return: { qtyForPrice, displayQty, displayUnit } 
function normalizeQuantity(qtyEntered, inputUnit, baseUnit) {
let qtyForPrice = qtyEntered;
let displayQty = qtyEntered;
let displayUnit = inputUnit || baseUnit;

const uIn = (inputUnit || "").toLowerCase();
const uBase = (baseUnit || "").toLowerCase();

// === Handle grams and kilograms ===
// if product stored in kg, but user selected gm
if (uIn.includes("g") && uBase.includes("kg")) {
qtyForPrice = qtyEntered / 1000; // convert gm → kg
displayUnit = "gm";
}
// if product stored in gm, but user entered kg
else if (uIn.includes("kg") && uBase.includes("g")) {
qtyForPrice = qtyEntered * 1000; // convert kg → gm
displayUnit = "kg";
}

// === Handle dozen and pieces ===
if (uBase.includes("dozen")) {
if (uIn.includes("piece") || uIn.includes("pc") || !uIn.includes("dozen")) {
  qtyForPrice = qtyEntered / 12; // 12 pieces = 1 dozen
  displayUnit = "pcs";
} else {
  qtyForPrice = qtyEntered; // entered in dozen
  displayUnit = "dozen";
}
}

// === Default normalization (no conversion) ===
if (uBase === uIn || (!uBase && !uIn)) {
qtyForPrice = qtyEntered;
displayUnit = baseUnit;
}

return {
qtyForPrice: qtyForPrice,
displayQty: displayQty,
displayUnit: displayUnit
};
}


/* ------------------- UI rendering + event wiring ------------------- */
(async function initializePage() {
  try {
    const params = new URLSearchParams(window.location.search);
    const vendorSlug = params.get("vendor");
    if (!vendorSlug) {
      alert("Vendor slug missing in URL (expected ?vendor=<slug>)");
      return;
    }

    const vendorSnap = await db.collection("vendors").where("slug", "==", vendorSlug).limit(1).get();
    if (vendorSnap.empty) {
      alert("Vendor not found");
      return;
    }
    const vendorDoc = vendorSnap.docs[0];
    const vendorData = vendorDoc.data();
    const vendorId = vendorDoc.id;
    vendorIdGlobal = vendorId;

    // Theme color system
    const themeColor = (vendorData.customization && vendorData.customization.themeColor) || '#059669';
    document.documentElement.style.setProperty('--theme', themeColor);

    // Header info
    document.getElementById('vendorShop').textContent = vendorData.shopName || "Vendor Store";
    document.getElementById('shopNameSub').textContent = vendorData.shopName || "Vendor Store";
    if (vendorData.customization?.logoUrl) document.getElementById('vendorLogo').src = vendorData.customization.logoUrl;
    if (vendorData.customization?.welcomeMessage) document.getElementById('vendorWelcomeMessage').textContent = vendorData.customization.welcomeMessage;
    if (vendorData.customization?.bannerUrl) {
      const vendorHeader = document.getElementById('vendorHeader');
      vendorHeader.style.backgroundImage = `url(${vendorData.customization.bannerUrl})`;
      vendorHeader.style.backgroundSize = 'cover';
      vendorHeader.style.backgroundPosition = 'center';
      document.getElementById('vendorShop').style.textShadow = '0 2px 8px rgba(0,0,0,0.4)';
    }

    // Load products
    const productsSnap = await db.collection('vendors').doc(vendorId).collection('products').get();
    products = [];
    productsSnap.forEach(d => {
      const p = d.data();
      p._docId = d.id; // keep firebase ID if needed
      if (!p.deleted) products.push(p);
    });

    // Prefill customer details from localStorage
    const savedName = localStorage.getItem('custName');
    const savedPhone = localStorage.getItem('custPhone');
    const savedAddress = localStorage.getItem('custAddress');
    if (savedName) custName.value = savedName;
    if (savedPhone) custPhone.value = savedPhone;
    if (savedAddress) custAddress.value = savedAddress;

    function renderProducts(filter = "") {
      productList.innerHTML = "";
      const filtered = products.filter(p => p.name && p.name.toLowerCase().includes(filter.toLowerCase()));
      if (filtered.length === 0) {
        productList.innerHTML = '<div class="col-span-full text-center text-gray-500">No products found.</div>';
        return;
      }
      filtered.forEach(p => {
        // Preset options: adjust depending on likely product unit
        const presets = (isKgUnit(p.unit) || isGramUnit(p.unit)) ? ['250 gms','500 gms','750 gms'] :
                        isDozenUnit(p.unit) ? ['1 pc','6 pcs','1 dozen'] :
                        ['1 pc','2 pc','5 pc'];
        const card = document.createElement('div');
        card.className = "bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition";
        card.innerHTML = `
          <img src="${p.imageURL || 'https://via.placeholder.com/400x240'}" class="w-full h-44 object-cover">
          <div class="p-4">
            <h4 class="font-semibold text-lg text-gray-800">${p.name}</h4>
            <p class="text-[var(--theme)] font-bold text-xl mb-2">₹${(Number(p.price)||0).toFixed(2)}<span class="text-sm text-gray-500"> / ${p.unit}</span></p>
            <div class="flex gap-2 mb-2 preset-row"></div>
            <div class="flex items-center gap-2">
              <input type="number" min="1" step="0.1" value="1" class="qtyInput border rounded-lg p-2 w-20 text-center" />
              <select class="unitSelect border rounded-lg p-2 text-sm">
                <option selected>${p.unit}</option>
              </select>
              <button class="addBtn flex-grow text-white rounded-lg px-4 py-2 font-semibold btn-theme">Add</button>
            </div>
            <div class="text-xs text-gray-500 mt-2">Tap preset buttons to quickly choose common quantities.</div>
          </div>`;
        productList.appendChild(card);

        const presetRow = card.querySelector('.preset-row');
        presets.forEach(lbl => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'preset-btn px-3 py-1 border rounded-lg text-sm hover:bg-gray-50';
          btn.textContent = lbl;
          presetRow.appendChild(btn);

          btn.addEventListener('click', () => {
            // set input value and record unit label based on preset
            const parsed = parsePresetLabel(lbl);
            const input = card.querySelector('.qtyInput');
            input.value = parsed.value;
            input.dataset.inputUnit = parsed.unit; // store unit to use for normalization
            // visual active state
            presetRow.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
          });
        });

        const input = card.querySelector('.qtyInput');
        const addBtn = card.querySelector('.addBtn');

        // default input unit: if product stored in dozen we assume user types pieces (per your request)
        input.dataset.inputUnit = isDozenUnit(p.unit) ? 'pc' : (isKgUnit(p.unit) ? 'kg' : (isGramUnit(p.unit) ? 'g' : p.unit));

        // Allow manual unit switch (helps if product unit is ambiguous)
        const unitSelect = card.querySelector('.unitSelect');
        unitSelect.innerHTML = ''; // clear and add helpful options
        // if product is kg-based, allow g/kg
        if (isKgUnit(p.unit)) {
          unitSelect.innerHTML = '<option value="kg">kg</option><option value="g">g</option>';
        } else if (isGramUnit(p.unit)) {
          unitSelect.innerHTML = '<option value="g">g</option><option value="kg">kg</option>';
        } else if (isDozenUnit(p.unit)) {
          unitSelect.innerHTML = '<option value="pc">pc</option><option value="dozen">dozen</option>';
        } else {
          unitSelect.innerHTML = `<option value="${p.unit}">${p.unit}</option><option value="pc">pc</option>`;
        }
        unitSelect.value = input.dataset.inputUnit || p.unit;

        // update dataset when user selects a different unit
        unitSelect.addEventListener('change', () => {
          input.dataset.inputUnit = unitSelect.value;
        });

        addBtn.onclick = () => {
          let rawVal = parseFloat(input.value);
          if (isNaN(rawVal) || rawVal <= 0) return alert("Enter a valid quantity.");

          const parsedUnit = input.dataset.inputUnit || unitSelect.value || p.unit; // 'g', 'kg', 'pc', 'dozen'
          // Normalize into qty used for price multiplication
          const norm = normalizeQuantity(rawVal, parsedUnit, p.unit);
          const qtyForPrice = Number(norm.qtyForPrice); // numeric multiplier for price
          const displayQty = norm.displayQty;
          const displayUnit = norm.displayUnit;

          // Add to cart item: store display-friendly info and qtyForPrice for price calc
          cart.push({
            id: p._docId || p.id || p.name,
            name: p.name,
            unitStored: p.unit,
            unitDisplay: displayUnit,
            qtyEntered: displayQty,
            qtyForPrice: qtyForPrice,
            price: Number(p.price) || 0
          });
          refreshCart();
          addBtn.textContent = "Added!";
          setTimeout(() => addBtn.textContent = "Add", 900);
        };
      });
    }

    // Wire search
    searchInput.addEventListener('input', e => renderProducts(e.target.value));
    renderProducts();

    // Drawer + bottom bar behaviors
    function refreshCart() {
      cartItems.innerHTML = '';
      let total = 0;
      cart.forEach((it, idx) => {
        const lineTotal = it.qtyForPrice * it.price;
        total += lineTotal;
        const el = document.createElement('div');
        el.className = 'border rounded p-3 bg-white shadow-sm flex justify-between items-center';
        el.innerHTML = `
          <div>
            <div class="font-semibold">${it.name}</div>
            <div class="text-sm text-gray-600">${it.qtyEntered} ${it.unitDisplay}</div>
            <div class="text-xs text-gray-400">Unit stored: ${it.unitStored}</div>
          </div>
          <div class="text-right">
            <div class="font-semibold">₹${lineTotal.toFixed(2)}</div>
            <div class="flex gap-1 mt-2">
              <button data-idx="${idx}" class="decrease text-xs px-2 py-1 border rounded">-</button>
              <button data-idx="${idx}" class="increase text-xs px-2 py-1 border rounded">+</button>
              <button data-idx="${idx}" class="remove text-xs px-2 py-1 border rounded text-red-600">Remove</button>
            </div>
          </div>`;
        cartItems.appendChild(el);
      });
      cartCount.textContent = cart.length;
      cartTotal.textContent = `₹${total.toFixed(2)}`;
      bottomCartTotal.textContent = `₹${total.toFixed(2)}`;
      bottomCartCount.textContent = `${cart.length} item${cart.length !== 1 ? 's' : ''}`;

      // Toggle floating cart button and bottom bar
      cartToggle.classList.toggle('hidden', cart.length === 0);
      if (cart.length === 0) {
        bottomCartBar.classList.add('hidden');
      } else {
        bottomCartBar.classList.remove('hidden');
      }

      // attach listeners to increase/decrease/remove
      cartItems.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = Number(btn.dataset.idx);
          // increase qtyEntered by 1 piece/kg depending on displayUnit
          if (!cart[i]) return;
          // If product was dozen-based and display unit is 'pc' then increment display qty (pieces) and recalc qtyForPrice
          const displayUnit = cart[i].unitDisplay;
          let newDisplay = Number(cart[i].qtyEntered) + 1;
          const norm = normalizeQuantity(newDisplay, displayUnit, cart[i].unitStored);
          cart[i].qtyEntered = norm.displayQty;
          cart[i].qtyForPrice = Number(norm.qtyForPrice);
          refreshCart();
        });
      });
      cartItems.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = Number(btn.dataset.idx);
          if (!cart[i]) return;
          let newDisplay = Number(cart[i].qtyEntered) - 1;
          if (newDisplay <= 0) { cart.splice(i,1); refreshCart(); return; }
          const norm = normalizeQuantity(newDisplay, cart[i].unitDisplay, cart[i].unitStored);
          cart[i].qtyEntered = norm.displayQty;
          cart[i].qtyForPrice = Number(norm.qtyForPrice);
          refreshCart();
        });
      });
      cartItems.querySelectorAll('.remove').forEach(btn => {
        btn.addEventListener('click', () => {
          const i = Number(btn.dataset.idx);
          cart.splice(i,1);
          refreshCart();
        });
      });
    }

    // Quick open/close
    cartToggle.onclick = () => cartDrawer.classList.toggle('hidden');
    closeCart.onclick = () => cartDrawer.classList.add('hidden');
    historyBtn.onclick = () => historyDrawer.classList.toggle('hidden');
    closeHistory.onclick = () => historyDrawer.classList.add('hidden');
    openCartDetailed.onclick = () => cartDrawer.classList.remove('hidden');

    // Place order actions
    async function placeOrderFlow() {
      const name = custName.value.trim();
      const phone = custPhone.value.trim();
      const address = custAddress.value.trim();
      if (!name || !phone || !address) return alert("Please fill name, phone, and address.");

      if (cart.length === 0) return alert("Cart is empty!");

      // Save customer details to localStorage for future auto-fill
      localStorage.setItem('custName', name);
      localStorage.setItem('custPhone', phone);
      localStorage.setItem('custAddress', address);

      // compute total and prepare items for DB
      const itemsForDb = cart.map(it => ({
        id: it.id,
        name: it.name,
        unitStored: it.unitStored,
        qtyDisplay: it.qtyEntered,
        qtyForPrice: it.qtyForPrice,
        price: it.price,
        lineTotal: Number((it.qtyForPrice * it.price).toFixed(2))
      }));
      const total = itemsForDb.reduce((s,x) => s + x.lineTotal, 0);

      try {
        await db.collection('vendors').doc(vendorId).collection('orders').add({
          customerName: name,
          phone,
          address,
          items: itemsForDb,
          total,
          status: "Pending",
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("✅ Order placed successfully!");
        cart = [];
        refreshCart();
        cartDrawer.classList.add('hidden');
      } catch (e) {
        console.error("Order placement error:", e);
        alert("❌ Failed to place order. Try again.");
      }
    }

    placeOrderBtn.onclick = placeOrderFlow;
    quickPlaceOrder.onclick = () => {
      // open checkout drawer to confirm/save details
      cartDrawer.classList.remove('hidden');
      // scroll to bottom in case pans
      cartDrawer.querySelector('textarea')?.scrollIntoView({behavior:'smooth', block:'end'});
    };

    // Load history
    loadHistoryBtn.onclick = async () => {
      const phone = historyPhone.value.trim();
      if (!phone) return alert("Enter phone number");
      try {
        const snap = await db.collection('vendors').doc(vendorId).collection('orders')
          .where('phone', '==', phone).orderBy('createdAt','desc').get();
        historyList.innerHTML = '';
        if (snap.empty) {
          historyList.innerHTML = '<p class="text-gray-500 text-center">No past orders found.</p>';
          return;
        }
        snap.forEach(doc => {
          const d = doc.data();
          const div = document.createElement('div');
          div.className = 'border rounded-lg p-3 shadow-sm';
          div.innerHTML = `
            <div class="font-semibold">${d.customerName}</div>
            <div class="text-sm text-gray-600">${(d.items || []).map(i => i.name+" ("+i.qtyDisplay+" "+(i.unitStored||'')+")").join(', ')}</div>
            <div class="text-right font-semibold text-[var(--theme)] mt-1">₹${(d.total||0).toFixed(2)}</div>
            <div class="text-xs text-gray-500">${d.address || ''}</div>`;
          historyList.appendChild(div);
        });
      } catch (e) {
        console.error(e);
        alert("Failed to load history.");
      }
    };

  } catch (err) {
    console.error("Init error:", err);
    alert("Failed to initialize page.");
  }
})();