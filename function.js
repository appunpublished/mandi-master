(async function(){

  // ---------- FIREBASE CONFIG ----------
  const firebaseConfig = {
  apiKey: "AIzaSyBcb4VreNGceQNxyCWh2tDl8ARGkCiptSQ",
  authDomain: "vendor-pos.firebaseapp.com",
  projectId: "vendor-pos",
  storageBucket: "vendor-pos.firebasestorage.app",
  messagingSenderId: "729715567147",
  appId: "1:729715567147:web:2b04c4ff14fd09daa7186e",
  measurementId: "G-CG95QJFKGW"
};

  // ---------- INIT ----------
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();

  // ---------- I18N DICTIONARY (EN / HI) ----------
  const translations = {
    en: { /* will be assigned below */ },
    hi: { /* will be assigned below */ }
  };

  Object.assign(translations, {
    en: {
      title_auth: "Vendor — Register / Login",
      ph_shop: "Shop name (for registration)",
      ph_email: "Email",
      ph_password: "Password",
      btn_register: "Register",
      btn_login: "Login",
      auth_note: "Register saves Shop name. Login downloads your vendor data (if present).",
      app_title: "Vendor POS",
      sync_manual: "Manual sync",
      btn_push: "⬆️ Push",
      btn_pull: "⬇️ Pull",
      btn_logout: "Logout",
      tab_products: "Products",
      tab_sales: "Sales",
      tab_history: "History",
      heading_add_edit: "Add / Edit Product",
      ph_product_name: "Name (e.g., Tomato)",
      ph_price: "Price (₹)",
      ph_qty: "Qty (opt)",
      unit_kg: "kg",
      unit_g: "g",
      unit_piece: "piece",
      unit_dozen: "dozen",
      btn_save: "Save",
      btn_clear: "Clear",
      heading_products: "Products",
      heading_record_sale: "Record Sale",
      ph_search: "Search product",
      btn_add_cart: "Add to Cart",
      btn_open_cart: "Open Cart",
      heading_cart: "Cart",
      btn_checkout: "Checkout",
      heading_history: "Sales History",
      lbl_filter: "Filter",
      filter_all: "All",
      filter_today: "Today",
      filter_yesterday: "Yesterday",
      filter_week: "This Week",
      filter_month: "This Month",
      registered: "Registered. Now login.",
      enter_shop_email_pass: "Enter shop, email & password to register.",
      enter_email_pass: "Enter email & password",
      not_signed_in: "Not signed in",
      no_internet: "No internet connection",
      product_required: "Name required",
      confirm_delete_product: "Delete this product?",
      product_deleted_local: "Product deleted locally",
      sale_recorded_local: "Sale recorded locally",
      push_confirm: "Push local data to cloud? This will upload new/updated products & sales and propagate deletions.",
      pull_confirm: "Pull from cloud? This will download new/updated products & sales from cloud and merge with local data.",
      push_complete: "Push complete.",
      pull_complete: "Pull complete.",
      sync_failed: "Sync failed",
      bill_ready: "Bill ready to send",
      bill_copied: "Bill copied to clipboard",
      img_modal_title: "Select or Upload Image",
      img_upload_button: "Upload New",
      img_suggested: "Suggested images",
      img_preview_local: "Selected preview (local)",
      select_image: "Select",
      remove_image: "Remove",
      btn_image: "Image",
      img_upload_success: "Image uploaded",
      img_selected: "Image selected",
      gallery_no_images: "No shared images available",
      discount: "Discount",
      discount_type_rupee: "₹",
      discount_type_percent: "%",
      total_label: "Total",
      grand_total_label: "Grand Total",
      history_discount_label: "Discount",
      history_final_label: "Final"
    },
    hi: {
      title_auth: "विक्रेता — पंजीकरण / लॉगिन",
      ph_shop: "दुकान का नाम (पंजीकरण के लिए)",
      ph_email: "ईमेल",
      ph_password: "पासवर्ड",
      btn_register: "रजिस्टर करें",
      btn_login: "लॉगिन",
      auth_note: "रजिस्टर करने पर दुकान का नाम सेव होगा। लॉगिन करने पर आपका डाटा डाउनलोड होगा (यदि उपलब्ध)।",
      app_title: "विक्रेता POS",
      sync_manual: "मैनुअल सिंक",
      btn_push: "⬆️ भेजें",
      btn_pull: "⬇️ प्राप्त करें",
      btn_logout: "लॉगआउट",
      tab_products: "उत्पाद",
      tab_sales: "बिक्री",
      tab_history: "इतिहास",
      heading_add_edit: "उत्पाद जोड़ें / संपादित करें",
      ph_product_name: "नाम (उदा., टमाटर)",
      ph_price: "कीमत (₹)",
      ph_qty: "मात्रा (वैकल्पिक)",
      unit_kg: "किलो",
      unit_g: "ग्राम",
      unit_piece: "पीस",
      unit_dozen: "डज़न",
      btn_save: "सहेजें",
      btn_clear: "साफ़ करें",
      heading_products: "उत्पाद",
      heading_record_sale: "बिक्री दर्ज करें",
      ph_search: "उत्पाद खोजें",
      btn_add_cart: "कार्ट में जोड़ें",
      btn_open_cart: "कार्ट खोलें",
      heading_cart: "कार्ट",
      btn_checkout: "चेकआउट",
      heading_history: "बिक्री इतिहास",
      lbl_filter: "फ़िल्टर",
      filter_all: "सब",
      filter_today: "आज",
      filter_yesterday: "कल",
      filter_week: "यह सप्ताह",
      filter_month: "यह महीना",
      registered: "रजिस्टर हो गया। अब लॉगिन करें।",
      enter_shop_email_pass: "पंजीकरण के लिए दुकान, ईमेल और पासवर्ड दर्ज करें।",
      enter_email_pass: "ईमेल और पासवर्ड दर्ज करें",
      not_signed_in: "लॉगिन नहीं किया गया है",
      no_internet: "इंटरनेट कनेक्शन नहीं है",
      product_required: "नाम आवश्यक है",
      confirm_delete_product: "क्या आप इस उत्पाद को हटाना चाहते हैं?",
      product_deleted_local: "उत्पाद स्थानीय रूप से हटाया गया",
      sale_recorded_local: "बिक्री स्थानीय रूप से दर्ज की गई",
      push_confirm: "लोकल डेटा क्लाउड पर भेजें? इससे नए/अपडेट किए गए उत्पाद और बिक्री भेजे जाएंगे और हटाने का प्रभाव भी होगा।",
      pull_confirm: "क्लाउड से प्राप्त करें? इससे क्लाउड से नए/अपडेट किए गए उत्पाद और बिक्री डाउनलोड होंगे और लोकल के साथ मर्ज होंगे।",
      push_complete: "पुश पूरा हुआ।",
      pull_complete: "पुल पूरा हुआ।",
      sync_failed: "सिंक विफल",
      bill_ready: "बिल भेजने के लिए तैयार है",
      bill_copied: "बिल क्लिपबोर्ड पर कॉपी किया गया",
      img_modal_title: "छवि चुनें या अपलोड करें",
      img_upload_button: "नई अपलोड करें",
      img_suggested: "सुझाई गई छवियाँ",
      img_preview_local: "चयनित प्रीव्यू (लोकल)",
      select_image: "चुनें",
      remove_image: "हटाएं",
      btn_image: "छवि",
      img_upload_success: "छवि अपलोड हुई",
      img_selected: "छवि चुनी गई",
      gallery_no_images: "कोई साझा छवि नहीं",
      discount: "छूट",
      discount_type_rupee: "रु.",
      discount_type_percent: "%",
      total_label: "कुल",
      grand_total_label: "कुल योग",
      history_discount_label: "छूट",
      history_final_label: "कुल"
    }
  });

  // ---------- I18N HELPERS ----------
  function getSavedLang(){
    const s = localStorage.getItem('language');
    if(s) return s;
    const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    return nav.startsWith('hi') ? 'hi' : 'en';
  }
  let currentLang = getSavedLang();

  function applyTranslations(lang){
    currentLang = lang;
    // apply text nodes with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(translations[lang] && translations[lang][key]) el.textContent = translations[lang][key];
    });
    // apply placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      const key = el.getAttribute('data-i18n-placeholder');
      if(translations[lang] && translations[lang][key]) el.placeholder = translations[lang][key];
    });
    // apply select option texts (some are marked with data-i18n)
    document.querySelectorAll('option[data-i18n]').forEach(opt=>{
      const key = opt.getAttribute('data-i18n');
      if(translations[lang] && translations[lang][key]) opt.textContent = translations[lang][key];
    });

    // update toggle button text: show the other language label
    const toggle = document.getElementById('langToggle');
    if(toggle){
      toggle.textContent = (lang === 'en') ? '🌐 हिंदी' : '🌐 English';
    }

    localStorage.setItem('language', lang);
  }

  function showBilingualAlert(keyOrText){
    // general alerts show both languages (short)
    let enText = '', hiText = '';
    if(typeof keyOrText === 'string' && translations.en[keyOrText] && translations.hi[keyOrText]){
      enText = translations.en[keyOrText];
      hiText = translations.hi[keyOrText];
    } else if (typeof keyOrText === 'string'){
      enText = keyOrText;
      hiText = translations.hi['sync_failed'] || 'त्रुटि';
    } else {
      enText = String(keyOrText);
      hiText = translations.hi['sync_failed'] || 'त्रुटि';
    }
    alert(enText + " / " + hiText);
  }
  function showBilingualConfirm(key){
    let enText = translations.en[key] || key;
    let hiText = translations.hi[key] || key;
    return confirm(enText + " / " + hiText);
  }

  // toast helper
  function showToast(textKeyOrText){
    let text = '';
    if(typeof textKeyOrText === 'string' && translations[currentLang] && translations[currentLang][textKeyOrText]){
      // show in current language only for toast (short)
      text = translations[currentLang][textKeyOrText];
    } else {
      text = textKeyOrText;
    }
    const t = document.getElementById('toast');
    t.textContent = text;
    t.style.display = 'block';
    setTimeout(()=>{ t.style.opacity = '1'; }, 10);
    setTimeout(()=>{ t.style.display = 'none'; t.style.opacity = '0'; }, 3000);
  }

  // ---------- HELPERS & LS ----------
  const $ = id => document.getElementById(id);
  const LS_PRODUCTS = (uid) => `vendor_products_${uid}`;
  const LS_SALES = (uid) => `vendor_sales_${uid}`;
  const LS_IMAGES = (uid) => `vendor_images_cache_${uid}`; // map: productId -> base64
  function loadLS(key){ try{ return JSON.parse(localStorage.getItem(key) || '[]'); } catch(e){ return []; } }
  function saveLS(key,val){ localStorage.setItem(key, JSON.stringify(val)); }






  // App state
  let currentUser = null;
  let currentUID = null;
  let currentShop = null;
  let products = []; // array of {id,name,price,qty,unit,lastUpdated,deleted?, imageURL?, localImageBase64?}
  let sales = [];    // array of {id,time,timeStr,items:[{id,name,price,qty,unit}], lastUpdated, discountType?, discountValue?, finalTotal?}
  let cart = [];
  let dirty = false;

  // DOM refs
  const authWrap = $('authWrap'), appWrap = $('appWrap');
  const shopNameEl = $('shopName'), vendorInfoEl = $('vendorInfo'), syncStatusEl = $('syncStatus');
  const pushBtn = $('pushBtn'), pullBtn = $('pullBtn'), logoutBtn = $('logoutBtn');
  const tabProducts = $('tabProducts'), tabSales = $('tabSales'), tabHistory = $('tabHistory');
  const viewProducts = $('view-products'), viewSales = $('view-sales'), viewHistory = $('view-history');

  const p_name = $('p_name'), p_price = $('p_price'), p_qty = $('p_qty'), p_unit = $('p_unit');
  const saveProductBtn = $('saveProduct'), clearProductBtn = $('clearProduct'), productList = $('productList');

  const saleSearch = $('saleSearch'), sale_product = $('sale_product'), sale_qty = $('sale_qty'), sale_unit_box = $('sale_unit_box');
  const addToCartBtn = $('addToCart'), openCartBtn = $('openCart'), quickCart = $('quickCart'), checkoutBtn = $('checkoutBtn');

  const historyList = $('historyList'), historyFilter = $('historyFilter');

  const registerBtn = $('registerBtn'), loginBtn = $('loginBtn'), regShop = $('regShop'), emailInp = $('email'), passInp = $('password');
  const shopNameStatus = $('shopNameStatus');
  const sendBillArea = $('sendBillArea'), sendBillBtn = $('sendBillBtn'), custNumberEl = $('custNumber');
  const billModal = $('billModal'), billPreview = $('billPreview'), copyBillBtn = $('copyBillBtn'), closeBillBtn = $('closeBillBtn');

  const imageSelectModal = $('imageSelectModal'), sharedImagesGrid = $('sharedImagesGrid'), imgUploadInput = $('imgUploadInput'), closeImageModal = $('closeImageModal');
  const selectThisImageBtn = $('selectThisImageBtn'), removeSelectedImageBtn = $('removeSelectedImageBtn'), localImagePreviewArea = $('localImagePreviewArea'), selectedThumbArea = $('selectedThumbArea');
  const refreshGalleryBtn = $('refreshGalleryBtn');

  const fullImageModal = $('fullImageModal'), fullImageView = $('fullImageView'), closeFullImage = $('closeFullImage');

  const discountValueEl = $('discountValue'), discountTypeEl = $('discountType'), grandTotalBox = $('grandTotalBox');

  const tabOrders = $('tabOrders');
  const viewOrders = $('view-orders');
  const ordersList = $('ordersList');
  const shareLinkBtn = $('shareLinkBtn');

  const tabStorefront = $('tabStorefront');
  const viewStorefront = $('view-storefront');
  const storeWelcome = $('storeWelcome');
  const storeThemeColor = $('storeThemeColor');
  const storeLogoUpload = $('storeLogoUpload');
  const storeBannerUpload = $('storeBannerUpload');
  const logoPreview = $('logoPreview').querySelector('img');
  const bannerPreview = $('bannerPreview').querySelector('img');
  const saveStorefrontBtn = $('saveStorefrontBtn');
  
// 🧠 Cloudinary Config
const CLOUDINARY_CLOUD_NAME = "dab2fpstj";
const CLOUDINARY_UPLOAD_PRESET = "unsigned_vendor_upload";




  let vendorCustomization = {};


  
  tabOrders.onclick = () => show('orders');
  



  // UTIL
  const now = () => Date.now();
  const uidGen = () => Date.now().toString(36) + Math.random().toString(36).slice(2,8);
  function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function markDirty(v=true){ dirty = v; syncStatusEl.textContent = (!navigator.onLine) ? translations.en['no_internet'] + ' / ' + translations.hi['no_internet'] : (dirty ? translations.en['sync_manual'] + ' / ' + translations.hi['sync_manual'] : translations.en['sync_manual'] + ' / ' + translations.hi['sync_manual']); }

  // ---------- HELPERS: currency based on language ----------
  function getCurrencySymbol(){
    return currentLang === 'hi' ? translations.hi['discount_type_rupee'] || 'रु.' : translations.en['discount_type_rupee'] || '₹';
  }
  function formatCurrency(val){
    const sym = getCurrencySymbol();
    return sym + ' ' + Number(val).toFixed(2);
  }

  // ---------- AUTH ----------
  // Replace the entire existing registerBtn.onclick function with this corrected version.
registerBtn.onclick = async () => {
  const shop = regShop.value.trim();
  const email = emailInp.value.trim();
  const pass = passInp.value;
  if (!shop || !email || !pass) return showBilingualAlert('enter_shop_email_pass');

  // 1. Generate the slug from the shop name. This will be the unique identifier.
  const slug = shop.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  // 2. Perform a definitive check against the database BEFORE creating the user.
  try {
      const existing = await db.collection('vendors').where('slug', '==', slug).get();
      if (!existing.empty) {
          // If the query returns any documents, the name is taken.
          alert("This shop name is already taken. Please choose another name.");
          return; // Halt the registration process immediately.
      }
  } catch (dbError) {
      console.error("Database error during shop name check:", dbError);
      alert("Could not verify shop name. Please check your connection and try again.");
      return;
  }

  // 3. If the slug is unique, proceed with creating the Firebase user.
  try {
      const cred = await auth.createUserWithEmailAndPassword(email, pass);
      const user = cred.user;

      // 4. Save the new vendor's data, including the verified unique slug.
      await db.collection('vendors').doc(user.uid).set({
          shopName: shop,
          slug: slug, // Save the generated slug
          email: email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      // Provide success feedback to the user.
      showBilingualAlert('registered');

  } catch (authError) {
      // Catch errors from the authentication process (e.g., email already in use).
      alert(authError.message || 'An error occurred during registration.');
  }
};

  loginBtn.onclick = async () => {
    const email = emailInp.value.trim(); const pass = passInp.value;
    if(!email || !pass) return showBilingualAlert('enter_email_pass');
    try{ await auth.signInWithEmailAndPassword(email, pass); } catch(e){ showBilingualAlert(e.message || 'Error'); }
  };

  logoutBtn.onclick = async () => { await auth.signOut(); };

  auth.onAuthStateChanged(async user => {
    if(user){
      currentUser = user; currentUID = user.uid;
      // fetch profile
      try{
        const prof = await db.collection('vendors').doc(currentUID).get();
        currentShop = (prof.exists && prof.data().shopName) ? prof.data().shopName : 'Shop';
      }catch(e){ currentShop = 'Shop'; }
      // load namespaced local data
      products = loadLS(LS_PRODUCTS(currentUID)); sales = loadLS(LS_SALES(currentUID));
      // ensure backward compatibility for old products without baseUnitCount
      products.forEach(p => { if (!p.baseUnitCount) p.baseUnitCount = (p.unit === 'dozen') ? 12 : 1; });

      // ensure local image cache map exists
      const imgCache = JSON.parse(localStorage.getItem(LS_IMAGES(currentUID)) || "{}");
      appWrap.classList.remove('hidden'); authWrap.classList.add('hidden');
      shopNameEl.textContent = currentShop;
      vendorInfoEl.textContent = `${currentUser.email} • UID: ${currentUID}`;
      markDirty(true); // assume local changes until user Push/Pull
      refreshProductsUI(); refreshCartUI(); refreshHistoryUI();
      // preload shared images list for selector
      await loadSharedImagesList();
    } else {
      currentUser = null; currentUID = null; currentShop = null;
      authWrap.classList.remove('hidden'); appWrap.classList.add('hidden');
    }
  });



// ---------- REAL-TIME SHOP NAME VALIDATION ----------
regShop.addEventListener('blur', async () => {
  const shopName = regShop.value.trim();
  shopNameStatus.textContent = ''; // Clear previous message
  if (!shopName) return;

  // Generate slug exactly like in the registration function
  const slug = shopName.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug) return;

  shopNameStatus.textContent = 'Checking...';
  shopNameStatus.className = 'text-xs mt-1 h-4 text-slate-500';

  try {
    const existing = await db.collection('vendors').where('slug', '==', slug).limit(1).get();
    if (existing.empty) {
      shopNameStatus.textContent = 'Available ✅';
      shopNameStatus.className = 'text-xs mt-1 h-4 text-emerald-600';
    } else {
      shopNameStatus.textContent = 'Already taken ❌';
      shopNameStatus.className = 'text-xs mt-1 h-4 text-red-600';
    }
  } catch (error) {
    console.error("Error checking shop name:", error);
    shopNameStatus.textContent = 'Could not verify name.';
    shopNameStatus.className = 'text-xs mt-1 h-4 text-amber-600';
  }
});


  // ---------- TABS ----------
  function show(tab){
    [viewProducts, viewSales, viewHistory, viewOrders, viewStorefront].forEach(v => v.classList.add('hidden'));
    [tabProducts, tabSales, tabHistory, tabOrders, tabStorefront].forEach(b => b.classList.remove('bg-emerald-200'));
    if(tab==='products'){ viewProducts.classList.remove('hidden'); tabProducts.classList.add('bg-emerald-200'); }
    if(tab==='sales'){ viewSales.classList.remove('hidden'); tabSales.classList.add('bg-emerald-200'); }
    if(tab==='history'){ viewHistory.classList.remove('hidden'); tabHistory.classList.add('bg-emerald-200'); }
    if(tab==='orders'){ viewOrders.classList.remove('hidden'); tabOrders.classList.add('bg-emerald-200'); listenToOrders(); }
    if (tab === 'storefront') {
      viewStorefront.classList.remove('hidden');
      tabStorefront.classList.add('bg-emerald-200');
      loadCustomizationUI(); // Load existing settings into the form
  }
  }
  tabProducts.onclick=()=>show('products'); tabSales.onclick=()=>show('sales'); tabHistory.onclick=()=>show('history');
  show('products');

  tabStorefront.onclick = () => show('storefront');



//Store Front View

async function loadCustomizationUI() {
  const vendorDoc = await db.collection('vendors').doc(currentUID).get();
  if (vendorDoc.exists && vendorDoc.data().customization) {
      vendorCustomization = vendorDoc.data().customization;
      if(storeWelcome)storeWelcome.value = vendorCustomization.welcomeMessage || '';
      if(storeThemeColor)storeThemeColor.value = vendorCustomization.themeColor || '#059669';
      if (vendorCustomization.logoUrl) {
          logoPreview.src = vendorCustomization.logoUrl;
          logoPreview.classList.remove('hidden');
      }
      if (vendorCustomization.bannerUrl) {
          bannerPreview.src = vendorCustomization.bannerUrl;
          bannerPreview.classList.remove('hidden');
      }
  }
}

// // Helper to upload a file and get the URL
// async function uploadFileAndGetURL(file, path) {
//   const storageRef = storage.ref().child(path);
//   await storageRef.put(file);
//   return await storageRef.getDownloadURL();
// }

// // Save button logic
// saveStorefrontBtn.onclick = async () => {
//   if (!currentUID) return alert("Not logged in");
//   saveStorefrontBtn.textContent = "Saving...";
//   saveStorefrontBtn.disabled = true;

//   try {
//       const updates = {
//           welcomeMessage: storeWelcome.value.trim(),
//           themeColor: storeThemeColor.value,
//       };

//       // If a new logo is selected, upload it
//       if (storeLogoUpload.files[0]) {
//           const logoFile = storeLogoUpload.files[0];
//           const logoPath = `vendors/${currentUID}/customization/logo_${Date.now()}`;
//           updates.logoUrl = await uploadFileAndGetURL(logoFile, logoPath);
//       }

//       // If a new banner is selected, upload it
//       if (storeBannerUpload.files[0]) {
//           const bannerFile = storeBannerUpload.files[0];
//           const bannerPath = `vendors/${currentUID}/customization/banner_${Date.now()}`;
//           updates.bannerUrl = await uploadFileAndGetURL(bannerFile, bannerPath);
//       }

//       // Save the data to Firestore
//       await db.collection('vendors').doc(currentUID).set({
//           customization: { ...vendorCustomization, ...updates }
//       }, { merge: true });

//       showToast("Storefront updated successfully!");
//       await loadCustomizationUI(); // Refresh UI with new data

//   } catch (error) {
//       console.error("Error saving customization: ", error);
//       alert("Failed to save. Please try again.");
//   } finally {
//       saveStorefrontBtn.textContent = "Save Customizations";
//       saveStorefrontBtn.disabled = false;
//   }
// };




//Cloudinary
// 📸 Cloudinary upload helper
async function uploadToCloudinary(file, folder) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!data.secure_url) throw new Error("Upload failed");
  return data.secure_url;
}

// 🎨 Store customization logic
const logoInput = document.getElementById("logoUpload");
const bannerInput = document.getElementById("bannerUpload");
// const logoPreview = document.getElementById("logoPreview");
// const bannerPreview = document.getElementById("bannerPreview");
const descInput = document.getElementById("storeDesc");
const colorPicker = document.getElementById("themeColor");
const saveBrandingBtn = document.getElementById("saveBranding");

// 🔹 Preview images on file select
function previewImage(input, previewEl) {
  const file = input.files[0];
  if (!file || !previewEl) return; 
  if (file) {
    previewEl.src = URL.createObjectURL(file);
    previewEl.classList.remove("hidden");
  }
}
if (logoInput) logoInput.addEventListener("change", () => previewImage(logoInput, logoPreview));
if (bannerInput) bannerInput.addEventListener("change", () => previewImage(bannerInput, bannerPreview));

// 🧩 Save customization
if (saveBrandingBtn) {
  saveBrandingBtn.addEventListener("click", async () => {
    if (!currentUID) return alert("Please log in first");

    saveBrandingBtn.textContent = "Saving...";
    saveBrandingBtn.disabled = true;

    try {
      let logoUrl = null;
      let bannerUrl = null;

      if (logoInput.files.length > 0)
        logoUrl = await uploadToCloudinary(logoInput.files[0], "vendor-logos");
      if (bannerInput.files.length > 0)
        bannerUrl = await uploadToCloudinary(bannerInput.files[0], "vendor-banners");

      const description = descInput.value.trim();
      const themeColor = colorPicker.value || "#f5f5f5";

      await db.collection("vendors").doc(currentUID).set(
        {
          customization: {
            ...(logoUrl && { logoUrl }),
            ...(bannerUrl && { bannerUrl }),
            ...(description && { description }),
            ...(themeColor && { themeColor }),
          },
        },
        { merge: true }
      );

      alert("✅ Store customization saved successfully!");
      saveBrandingBtn.textContent = "Saved ✓";
      setTimeout(() => {
        saveBrandingBtn.textContent = "Save Customization";
        saveBrandingBtn.disabled = false;
      }, 1500);
    } catch (err) {
      console.error("Error saving customization:", err);
      alert("Error saving customization. Check console for details.");
      saveBrandingBtn.textContent = "Save Customization";
      saveBrandingBtn.disabled = false;
    }
  });
}



async function loadVendorCustomization() {
  if (!currentUID) return;
  const doc = await db.collection("vendors").doc(currentUID).get();
  if (!doc.exists) return;

  const data = doc.data().customization || {};
  if (data.logoUrl) {
    logoPreview.src = data.logoUrl;
    logoPreview.classList.remove("hidden");
  }
  if (data.bannerUrl) {
    bannerPreview.src = data.bannerUrl;
    bannerPreview.classList.remove("hidden");
  }
  if (data.description) descInput.value = data.description;
  if (data.themeColor) colorPicker.value = data.themeColor;
}
loadVendorCustomization();




  // ---------- IMAGE / SHARED IMAGES LOGIC ----------
  let sharedImages = [];
  let imageSelectorState = { selectedBase64: null, selectedSharedId: null, selectedSharedUrl: null };

  function normalizeNameForFile(name){
    return (name||'').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g,'').slice(0,80) || uidGen();
  }

  async function loadSharedImagesList(){
    try{
      const snap = await db.collection('shared_images').orderBy('timestamp','desc').limit(100).get();
      sharedImages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderSharedImagesGrid();
    }catch(e){
      console.warn('Could not load shared images', e);
    }
  }

  function renderSharedImagesGrid(){
    sharedImagesGrid.innerHTML = '';
    if(!sharedImages.length) {
      sharedImagesGrid.innerHTML = '<div class="muted">'+(translations[currentLang]['gallery_no_images']||'No shared images available')+'</div>';
      return;
    }
    for(const img of sharedImages){
      const div = document.createElement('div');
      div.className = 'border rounded p-2 text-center';
      div.innerHTML = `<img src="${img.url}" class="thumb mb-2" /><div class="small muted">${escapeHtml(img.name)}</div><div class="small muted">by ${escapeHtml(img.uploaded_by || '—')}</div><div class="mt-2"><button class="selectShared big-btn bg-emerald-500 text-white">Select</button></div>`;
      const btn = div.querySelector('.selectShared');
      btn.onclick = ()=> {
        imageSelectorState.selectedSharedId = img.id;
        imageSelectorState.selectedSharedUrl = img.url;
        imageSelectorState.selectedBase64 = null; // will fetch base64 on attach
        renderLocalPreviewFromShared(img.url);
      };
      sharedImagesGrid.appendChild(div);
    }
  }

  // open image selector modal
  $('openImageSelector').addEventListener('click', async ()=>{
    imageSelectorState = { selectedBase64: null, selectedSharedId: null, selectedSharedUrl: null };
    localImagePreviewArea.innerHTML = '<div class="muted">No image selected</div>';
    await loadSharedImagesList();
    imageSelectModal.style.display = 'flex';
  });

  closeImageModal.onclick = ()=> { imageSelectModal.style.display = 'none'; };

  refreshGalleryBtn.addEventListener('click', async () => {
    if(!navigator.onLine){
      showToast('no_internet');
      return;
    }
    await loadSharedImagesList();
    showToast('pull_complete');
  });

  imgUploadInput.addEventListener('change', async (ev)=>{
    const f = ev.target.files && ev.target.files[0];
    if(!f) return;
    const base64 = await fileToCompressedBase64(f, 900 /* maxWidth */, 0.7 /* quality */);
    imageSelectorState.selectedBase64 = base64;
    imageSelectorState.selectedSharedId = null;
    imageSelectorState.selectedSharedUrl = null;
    renderLocalPreview();
  });

  function renderLocalPreview(){
    localImagePreviewArea.innerHTML = '';
    if(imageSelectorState.selectedBase64){
      const img = document.createElement('img');
      img.src = imageSelectorState.selectedBase64;
      img.className = 'thumb';
      img.onclick = ()=> openFullImage(imageSelectorState.selectedBase64);
      localImagePreviewArea.appendChild(img);
    } else {
      localImagePreviewArea.innerHTML = '<div class="muted">No image selected</div>';
    }
  }

  async function renderLocalPreviewFromShared(url){
    localImagePreviewArea.innerHTML = '<div class="muted">Loading preview...</div>';
    try{
      const base64 = await fetchUrlToBase64(url);
      imageSelectorState.selectedBase64 = base64;
      imageSelectorState.selectedSharedUrl = url;
      renderLocalPreview();
    }catch(e){
      localImagePreviewArea.innerHTML = '<div class="muted">Preview failed</div>';
    }
  }

  selectThisImageBtn.onclick = ()=>{
    if(!imageSelectorState.selectedBase64){
      alert( (translations.en['img_selected'] || 'Image selected') + ' / ' + (translations.hi['img_selected'] || 'चित्र चुना गया') );
      return;
    }
    selectedThumbArea.innerHTML = '';
    const img = document.createElement('img');
    img.src = imageSelectorState.selectedBase64;
    img.className = 'thumb';
    img.onclick = ()=> openFullImage(imageSelectorState.selectedBase64);
    selectedThumbArea.appendChild(img);
    selectedThumbArea.dataset.base64 = imageSelectorState.selectedBase64;
    selectedThumbArea.dataset.sharedUrl = imageSelectorState.selectedSharedUrl || '';
    imageSelectModal.style.display = 'none';
    showToast('img_selected');
  };

  removeSelectedImageBtn.onclick = ()=>{
    selectedThumbArea.innerHTML = '';
    delete selectedThumbArea.dataset.base64;
    delete selectedThumbArea.dataset.sharedUrl;
  };

  function openFullImage(src){
    fullImageView.src = src;
    fullImageModal.style.display = 'flex';
  }
  closeFullImage.onclick = ()=> { fullImageModal.style.display = 'none'; fullImageView.src=''; };

  async function fileToCompressedBase64(file, maxWidth = 900, quality = 0.7){
    return new Promise((resolve, reject)=>{
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e)=>{
        img.onload = ()=>{
          const scale = Math.min(1, maxWidth / img.width);
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function fetchUrlToBase64(url){
    const res = await fetch(url);
    const blob = await res.blob();
    return await blobToBase64(blob);
  }
  function blobToBase64(blob){
    return new Promise((resolve, reject)=>{
      const fr = new FileReader();
      fr.onload = ()=> resolve(fr.result);
      fr.onerror = reject;
      fr.readAsDataURL(blob);
    });
  }

  // ---------- PRODUCTS CRUD (local) ----------
  let editProductId = null;
  saveProductBtn.onclick = () => {
    const name = p_name.value.trim(); if(!name) return showBilingualAlert('product_required');
    const price = Number(p_price.value) || 0; const qty = p_qty.value === '' ? '' : Number(p_qty.value); const unit = p_unit.value;
    const selectedBase64 = selectedThumbArea.dataset.base64;
    const selectedSharedUrl = selectedThumbArea.dataset.sharedUrl;

    if(editProductId){
      const i = products.findIndex(x => x.id === editProductId);
      if(i>=0){
        products[i] = { ...products[i], name, price, qty, unit, lastUpdated: now(), deleted: false };
        if(selectedBase64) products[i].localImageBase64 = selectedBase64;
        if(selectedSharedUrl && !products[i].imageURL) products[i].imageURL = selectedSharedUrl;
      }
      editProductId = null;
    } else {
      const baseUnitCount = (unit === 'dozen') ? 12 : 1;  // handle dozen-based items
      const newP = { id: uidGen(), name, price, qty, unit, baseUnitCount, lastUpdated: now() };

      if(selectedBase64) newP.localImageBase64 = selectedBase64;
      if(selectedSharedUrl) newP.imageURL = selectedSharedUrl;
      products.push(newP);
    }
    saveLS(LS_PRODUCTS(currentUID), products);
    selectedThumbArea.innerHTML = '';
    delete selectedThumbArea.dataset.base64; delete selectedThumbArea.dataset.sharedUrl;
    markDirty(true);
    refreshProductsUI();
    p_name.value=''; p_price.value=''; p_qty.value='';
  };

  clearProductBtn.onclick = ()=>{ editProductId=null; p_name.value=''; p_price.value=''; p_qty.value=''; selectedThumbArea.innerHTML=''; delete selectedThumbArea.dataset.base64; delete selectedThumbArea.dataset.sharedUrl; };

  function refreshProductsUI(){
    productList.innerHTML = '';
    const active = products.filter(p => !p.deleted).sort((a,b) => (a.name||'').localeCompare(b.name||''));
    if(!active.length){ productList.innerHTML = '<div class="muted">No products</div>'; refreshSaleProducts(); return; }
    active.forEach(p=>{
      const row = document.createElement('div');
      row.className = 'flex justify-between items-center border rounded p-2';
      const thumbHtml = p.localImageBase64 ? `<img src="${p.localImageBase64}" class="thumb mr-3" />` : (p.imageURL ? `<img src="${p.imageURL}" class="thumb mr-3" />` : `<div class="thumb mr-3 bg-slate-100 flex items-center justify-center">📷</div>`);
      row.innerHTML = `<div class="flex items-center"><div>${thumbHtml}</div><div><div class="font-semibold">${escapeHtml(p.name)}</div><div class="small muted">₹ ${Number(p.price).toFixed(2)} / ${p.unit} ${p.qty!=='' ? ' • ' + p.qty + ' ' + p.unit : ''}</div></div></div>
        <div class="flex gap-2">
          <button class="bg-sky-500 text-white px-2 rounded edit">${escapeHtml(translations[currentLang]['btn_save'] || 'Edit')}</button>
          <button class="bg-red-500 text-white px-2 rounded del">${escapeHtml(translations[currentLang]['btn_clear'] || 'Del')}</button>
        </div>`;
      row.querySelector('.edit').onclick = ()=>{ editProductId = p.id; p_name.value = p.name; p_price.value = p.price; p_qty.value = p.qty; p_unit.value = p.unit;
        selectedThumbArea.innerHTML = '';
        if(p.localImageBase64){ const im = document.createElement('img'); im.src = p.localImageBase64; im.className='thumb'; selectedThumbArea.appendChild(im); selectedThumbArea.dataset.base64 = p.localImageBase64; }
        else if(p.imageURL){ const im = document.createElement('img'); im.src = p.imageURL; im.className='thumb'; selectedThumbArea.appendChild(im); selectedThumbArea.dataset.sharedUrl = p.imageURL; }
        window.scrollTo({top:0,behavior:'smooth'});
      };
      row.querySelector('.del').onclick = ()=>{ 
        if(!showBilingualConfirm('confirm_delete_product')) return;
        const idx = products.findIndex(x=>x.id===p.id);
        if(idx>=0){ products[idx].deleted = true; products[idx].lastUpdated = now(); saveLS(LS_PRODUCTS(currentUID), products); markDirty(true); refreshProductsUI(); showBilingualAlert('product_deleted_local'); }
      };
      const imgEl = row.querySelector('img');
      if(imgEl) imgEl.onclick = ()=> openFullImage(imgEl.src);
      productList.appendChild(row);
    });
    refreshSaleProducts();
  }

  // ---------- SALES ----------
  saleSearch.oninput = ()=> refreshSaleProducts(saleSearch.value);
  function refreshSaleProducts(filterTerm=''){
    const term = (filterTerm||'').trim().toLowerCase();
    let list = products.filter(p => !p.deleted).slice();
    if(term){
      const starts = list.filter(p => p.name.toLowerCase().startsWith(term));
      const includes = list.filter(p => !p.name.toLowerCase().startsWith(term) && p.name.toLowerCase().includes(term));
      list = starts.concat(includes);
    }
    sale_product.innerHTML = list.map(p => {
      const thumb = p.localImageBase64 ? p.localImageBase64 : (p.imageURL || '');
      const label = `${escapeHtml(p.name)} — ₹${Number(p.price).toFixed(2)}/${p.unit}`;
      if(thumb) return `<option value="${p.id}" data-thumb="${thumb}">${label}</option>`;
      return `<option value="${p.id}">${label}</option>`;
    }).join('') || '<option value="">No match</option>';
    const sel = products.find(x => x.id === sale_product.value) || list[0];
    if (sel) {
        // This part can be enhanced to dynamically change sale_unit_box options.
        // For now, we'll keep the static HTML options.
    }
  }

  addToCartBtn.onclick = () => {
    const pid = sale_product.value;
    const p = products.find(x => x.id === pid);
    if (!p) return showBilingualAlert('product_required');
  
    const q = Number(sale_qty.value);
    if (!q || q <= 0) return showBilingualAlert('product_required');
  
    const selectedUnit = sale_unit_box.value;
    let finalQty = q;
    let displayUnit = selectedUnit;
  
    // ✅ Corrected dozen/piece conversion
    if (p.unit === 'dozen' && selectedUnit === 'piece') {
      // Convert pieces to a fraction of a dozen using baseUnitCount for accuracy
      finalQty = q / (p.baseUnitCount || 12);
    }
  
    const existing = cart.find(x => x.id === p.id && x.unit === p.unit);
    if (existing) {
      existing.qty = Number(existing.qty) + finalQty;
      // Ensure baseUnitCount is present for older cart items
      if (!existing.baseUnitCount && p.baseUnitCount) {
        existing.baseUnitCount = p.baseUnitCount;
      }
    } else {
      // Add baseUnitCount to the cart item so it can be used in other functions
      cart.push({
        id: p.id,
        name: p.name,
        price: p.price,
        qty: finalQty,
        unit: p.unit, // Always store the product's base unit (e.g., 'dozen')
        baseUnitCount: p.baseUnitCount
      });
    }
  
    sale_qty.value = '';
    refreshCartUI();
    showToast(`${q} ${displayUnit} of ${p.name} added`);
  };

  function refreshCartUI(){
    quickCart.innerHTML = '';
    if(!cart.length) return quickCart.innerHTML = '<div class="muted">Cart empty</div>';
    
    cart.forEach((it, idx) => {
      const div = document.createElement('div');
      const lineTotal = it.qty * it.price;
      let detailsHtml;

      // ⭐ [NEW] Improved display logic for different units
      if (it.unit === 'dozen' && it.baseUnitCount) {
        // For dozen-based items, show quantity in pieces and reference the dozen price
        const pieceQty = Math.round(it.qty * it.baseUnitCount);
        const pieceUnitLabel = translations[currentLang]['unit_piece'] || 'piece';
        const dozenUnitLabel = translations[currentLang]['unit_dozen'] || 'dozen';
        
        detailsHtml = `<div class="small">${pieceQty} ${pieceUnitLabel} <span class="muted">(@ ${formatCurrency(it.price)}/${dozenUnitLabel})</span> = <b>${formatCurrency(lineTotal)}</b></div>`;
      } else {
        // Original logic for other units (kg, g, piece)
        const singleUnitName = it.unit.endsWith('s') ? it.unit.slice(0, -1) : it.unit;
        detailsHtml = `<div class="muted small">${it.qty} ${it.unit} × ${formatCurrency(it.price)}/${singleUnitName} = <b>${formatCurrency(lineTotal)}</b></div>`;
      }

      div.className = 'flex justify-between items-center border rounded p-2';
      div.innerHTML = `<div class="flex-1">
                          <b>${escapeHtml(it.name)}</b>
                          ${detailsHtml}
                       </div>
                       <div class="flex gap-1">
                          <button class="px-2 bg-red-500 text-white rounded rm">X</button>
                       </div>`;
      
      div.querySelector('.rm').onclick = ()=>{ cart.splice(idx,1); refreshCartUI(); };
      quickCart.appendChild(div);
    });

    const total = cart.reduce((s,it)=> s + (it.qty * it.price), 0);

    // read discount inputs
    const discountVal = Number(discountValueEl.value) || 0;
    const discountType = discountTypeEl.value || '₹';
    let final = total;
    if(discountVal > 0){
      if(discountType === '%'){
        final = total - (total * (discountVal/100));
      } else {
        final = total - discountVal;
      }
      if(final < 0) final = 0;
    }

    const foot = document.createElement('div'); foot.className = 'text-right font-semibold mt-2';
    const totalLabel = translations[currentLang]['total_label'] || 'Total';
    const grandLabel = translations[currentLang]['grand_total_label'] || 'Grand Total';
    foot.innerHTML = `${totalLabel}: <span class="currency">${getCurrencySymbol()} ${total.toFixed(2)}</span><br>${grandLabel}: <span class="currency">${getCurrencySymbol()} ${final.toFixed(2)}</span>`;
    quickCart.appendChild(foot);

    // also show in separate box near discount inputs
    grandTotalBox.textContent = `${getCurrencySymbol()} ${final.toFixed(2)}`;
  }

  // recalc whenever discount inputs change
  discountValueEl.addEventListener('input', refreshCartUI);
  discountTypeEl.addEventListener('change', refreshCartUI);

  checkoutBtn.onclick = ()=>{
    if(!cart.length) return showBilingualAlert('product_required');
    const total = cart.reduce((s,it)=> s + (it.qty * it.price), 0);
    const discountVal = Number(discountValueEl.value) || 0;
    const discountType = discountTypeEl.value || '₹';
    let final = total;
    if(discountVal > 0){
      if(discountType === '%') final = total - (total * (discountVal/100));
      else final = total - discountVal;
      if(final < 0) final = 0;
    }
    const sale = {
      id: uidGen(),
      time: now(),
      timeStr: new Date().toLocaleString(),
      items: cart.map(x=>({...x})),
      discountType: discountType,
      discountValue: discountVal,
      total: total,
      finalTotal: final,
      lastUpdated: now()
    };
    sales.push(sale);
    saveLS(LS_SALES(currentUID), sales);
    // deduct stock if provided
    cart.forEach(it=>{
      const prod = products.find(p=>p.id===it.id);
      if (prod && prod.qty !== '' && !isNaN(prod.qty)) {
        // Simplified logic: it.qty is already in the correct base unit (e.g., 0.5 dozen)
        prod.qty = Number(prod.qty) - Number(it.qty);
        if (prod.qty < 0) prod.qty = 0;
        prod.lastUpdated = now();
      }
    });
    saveLS(LS_PRODUCTS(currentUID), products);
    cart = []; refreshCartUI(); refreshProductsUI(); refreshHistoryUI(); markDirty(true);
    showBilingualAlert('sale_recorded_local');

    // show send bill area
    sendBillArea.style.display = 'block';
    showToast('bill_ready');

    // clear discount inputs for next sale (optional)
    discountValueEl.value = '';
    discountTypeEl.value = '₹';
    grandTotalBox.textContent = '';
  };

  // ---------- prepare SINGLE-LANGUAGE bill text (based on currentLang) ----------
  function buildSingleLanguageBill(sale){
    // choose language
    const isHi = (currentLang === 'hi');
    const curSym = getCurrencySymbol();
    const shop = currentShop || (isHi ? 'दुकान' : 'Shop');
    const dt = new Date(sale.time);
    const dtStr = dt.toLocaleString();
    const lines = [];
    if(isHi){
      lines.push(`🧾 ${shop}`);
      lines.push(`दिनांक: ${dtStr}`);
      lines.push(`-----------------------------`);
      sale.items.forEach(it=>{
        lines.push(`${it.name} — ${it.qty} ${it.unit} × ${curSym} ${Number(it.price).toFixed(2)} = ${curSym} ${(it.qty * it.price).toFixed(2)}`);
      });
      lines.push(`-----------------------------`);
      lines.push(`${translations.hi['total_label'] || 'कुल'}: ${curSym} ${Number(sale.total).toFixed(2)}`);
      if(sale.discountValue && sale.discountValue > 0){
        const dLab = translations.hi['history_discount_label'] || 'छूट';
        if(sale.discountType === '%') lines.push(`${dLab}: ${sale.discountValue}%`);
        else lines.push(`${dLab}: ${curSym} ${Number(sale.discountValue).toFixed(2)}`);
      }
      lines.push(`${translations.hi['grand_total_label'] || 'कुल योग'}: ${curSym} ${Number(sale.finalTotal).toFixed(2)}`);
      lines.push('');
      lines.push(`धन्यवाद 🙏`);
      lines.push(`बिल ${'Vendor POS'} ऐप से बनाया गया`);
    } else {
      lines.push(`🧾 ${shop}`);
      lines.push(`Date: ${dtStr}`);
      lines.push(`-----------------------------`);
      sale.items.forEach(it=>{
        lines.push(`${it.name} — ${it.qty} ${it.unit} × ${curSym} ${Number(it.price).toFixed(2)} = ${curSym} ${(it.qty * it.price).toFixed(2)}`);
      });
      lines.push(`-----------------------------`);
      lines.push(`${translations.en['total_label'] || 'Total'}: ${curSym} ${Number(sale.total).toFixed(2)}`);
      if(sale.discountValue && sale.discountValue > 0){
        const dLab = translations.en['history_discount_label'] || 'Discount';
        if(sale.discountType === '%') lines.push(`${dLab}: ${sale.discountValue}%`);
        else lines.push(`${dLab}: ${curSym} ${Number(sale.discountValue).toFixed(2)}`);
      }
      lines.push(`${translations.en['grand_total_label'] || 'Grand Total'}: ${curSym} ${Number(sale.finalTotal).toFixed(2)}`);
      lines.push('');
      lines.push(`Thank you! 🙏`);
      lines.push(`Bill generated using Vendor POS App`);
    }
    return lines.join('\n');
  }

  // ---------- Send Bill logic ----------
  sendBillBtn.onclick = () => {
    if(!sales.length) return showBilingualAlert('product_required');
    const sale = sales[sales.length - 1];
    const text = buildSingleLanguageBill(sale); // single language bill
    const rawNumber = (custNumberEl.value || '').trim();
    if(rawNumber){
      let digits = rawNumber.replace(/\D/g,'');
      if(digits.length === 10) digits = '91' + digits;
      if(digits.startsWith('0')) digits = digits.replace(/^0+/, '');
      const encoded = encodeURIComponent(text);
      const waUrl = `https://wa.me/${digits}?text=${encoded}`;
      window.open(waUrl, '_blank');
      showToast('bill_ready');
    } else {
      // set modal title based on language
      const isHi = currentLang === 'hi';
      document.getElementById('billModalTitle').textContent = isHi ? 'बिल' : 'Bill';
      billPreview.textContent = text;
      billModal.style.display = 'flex';
    }
  };

  copyBillBtn.onclick = async () => {
    try{
      await navigator.clipboard.writeText(billPreview.textContent);
      showToast('bill_copied');
    }catch(e){
      const ta = document.createElement('textarea'); ta.value = billPreview.textContent; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); showToast('bill_copied'); } catch(e2){ alert('Copy failed'); }
      ta.remove();
    }
  };
  closeBillBtn.onclick = () => { billModal.style.display = 'none'; };

  // ---------- HISTORY ----------
  function refreshHistoryUI(){
    historyList.innerHTML = '';

    const filter = historyFilter.value || 'all';
    const isSameDay = (d1, d2) => new Date(d1).toDateString() === new Date(d2).toDateString();
    const startOfWeek = (d) => { const dt = new Date(d); const day = dt.getDay(); dt.setDate(dt.getDate() - day); dt.setHours(0,0,0,0); return dt; };
    const startOfMonth = (d) => { const dt = new Date(d); dt.setDate(1); dt.setHours(0,0,0,0); return dt; };

    const filteredSales = sales.filter(s => {
      if(!s.time) return false;
      const t = new Date(s.time);
      const today = new Date();
      if(filter === 'today') return isSameDay(t, today);
      if(filter === 'yesterday'){ const y = new Date(); y.setDate(y.getDate() -1); return isSameDay(t, y); }
      if(filter === 'week'){ return t >= startOfWeek(today); }
      if(filter === 'month'){ return t >= startOfMonth(today); }
      return true;
    });

    if(!filteredSales.length) { historyList.innerHTML = '<div class="muted">No sales for selected period</div>'; return; }

    const grandTotal = filteredSales.reduce((sum, s) => sum + Number(s.finalTotal || s.total || 0), 0);
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'p-2 mb-2 rounded bg-emerald-100 text-emerald-800 font-semibold flex justify-between';
    summaryDiv.innerHTML = `<span>${translations[currentLang]['heading_history'] || 'Grand Total (filtered)'}</span><span>${getCurrencySymbol()} ${grandTotal.toFixed(2)}</span>`;
    historyList.appendChild(summaryDiv);

    filteredSales.slice().reverse().forEach(s=>{
      const d = document.createElement('div'); d.className='border rounded p-2 bg-white mb-2';
      const itemsHtml = s.items.map(it => `<div>${escapeHtml(it.name)} • ${it.qty}${it.unit} — ${getCurrencySymbol()} ${(it.qty*it.price).toFixed(2)}</div>`).join('');
      const total = s.items.reduce((sum,it)=> sum + it.qty * it.price, 0);
      let discHtml = '';
      if(s.discountValue && s.discountValue > 0){
        const dLabel = translations[currentLang]['history_discount_label'] || 'Discount';
        if(s.discountType === '%') discHtml = `<div class="muted small">${dLabel}: ${s.discountValue}%</div>`;
        else discHtml = `<div class="muted small">${dLabel}: ${getCurrencySymbol()} ${Number(s.discountValue).toFixed(2)}</div>`;
      }
      const final = Number(s.finalTotal != null ? s.finalTotal : total);
      d.innerHTML = `<div class="small muted">${new Date(s.time).toLocaleString()}</div>${itemsHtml}${discHtml}<div class="mt-2 text-right font-semibold border-t pt-1">${translations[currentLang]['history_final_label'] || 'Final'}: ${getCurrencySymbol()} ${final.toFixed(2)}</div>`;
      historyList.appendChild(d);
    });
  }
  historyFilter.onchange = () => refreshHistoryUI();

  // ---------- PUSH (upload local -> cloud, includes image upload) ----------
  pushBtn.onclick = async () => {
    if(!navigator.onLine) return showBilingualAlert('no_internet');
    if(!currentUID) return showBilingualAlert('not_signed_in');
    if(!showBilingualConfirm('push_confirm')) return;

    const vendorRef = db.collection('vendors').doc(currentUID);
    const prodCol = vendorRef.collection('products');
    const salesCol = vendorRef.collection('sales');

    try{
      // ensure vendor profile
      await vendorRef.set({ shopName: currentShop || '', email: currentUser.email }, { merge: true });

      // upload images first: for each product that has localImageBase64 and no imageURL -> upload
      for(const p of products){
        if(p.localImageBase64 && !p.imageURL){
          try{
            // create filename using normalized name + uid + timestamp
            const fname = normalizeNameForFile(p.name) + '_' + currentUID + '_' + Math.floor(Date.now()/1000) + '.jpg';
            const refPath = `shared_images/${fname}`;
            const storageRef = storage.ref().child(refPath);
            // convert base64 to blob
            const blob = base64ToBlob(p.localImageBase64);
            await storageRef.put(blob);
            const url = await storageRef.getDownloadURL();
            p.imageURL = url;
            // add doc to shared_images collection with normalized doc id
            const docId = normalizeNameForFile(p.name) + '_' + Math.floor(Date.now()/1000) + '_' + currentUID;
            const docData = {
              name: p.name,
              url: url,
              uploaded_by: currentUID,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              filename: fname
            };
            await db.collection('shared_images').doc(docId).set(docData, { merge:true });

            // --- INSTANT REFRESH: add the newly uploaded image to local sharedImages and render ---
            try {
              const localEntry = { id: docId, name: p.name, url: url, uploaded_by: currentUID, timestamp: Date.now(), filename: fname };
              sharedImages.unshift(localEntry);
              renderSharedImagesGrid();
            } catch(e) {
              console.warn('Could not instant-refresh sharedImages array', e);
            }
            showToast('img_upload_success');
          }catch(e){
            console.warn('Image upload failed for', p.name, e);
          }
        }
      }

      // upload products (create or update)
      for(const p of products){
        if(p.deleted){
          await prodCol.doc(p.id).set({ deleted: true, lastUpdated: p.lastUpdated }, { merge:true });
        } else {
          await prodCol.doc(p.id).set(p, { merge:true });
        }
      }
      // upload sales
      for(const s of sales){
        await salesCol.doc(s.id).set(s, { merge:true });
      }

      // after upload, remove locally any products that were deleted
      products = products.filter(p => !p.deleted);
      saveLS(LS_PRODUCTS(currentUID), products);

      markDirty(false);
      showBilingualAlert('push_complete');
      // refresh shared images list for other devices
      await loadSharedImagesList();
    } catch(err){
      console.error(err);
      showBilingualAlert(err.message || translations.en['sync_failed']);
      markDirty(true);
    }
    refreshProductsUI(); refreshCartUI(); refreshHistoryUI();
  };

  function base64ToBlob(dataurl) {
    const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    for(let i=0;i<n;i++) u8arr[i]=bstr.charCodeAt(i);
    return new Blob([u8arr], {type:mime});
  }

  // ---------- PULL (download cloud -> merge local, apply deletions) ----------
  pullBtn.onclick = async () => {
    if(!navigator.onLine) return showBilingualAlert('no_internet');
    if(!currentUID) return showBilingualAlert('not_signed_in');
    if(!showBilingualConfirm('pull_confirm')) return;

    const vendorRef = db.collection('vendors').doc(currentUID);
    const prodCol = vendorRef.collection('products');
    const salesCol = vendorRef.collection('sales');

    try{
      const cloudProdsSnap = await prodCol.get();
      const cloudSalesSnap = await salesCol.get();
      const cloudProds = cloudProdsSnap.docs.map(d => d.data());
      const cloudSales = cloudSalesSnap.docs.map(d => d.data());

      // MERGE PRODUCTS
      const map = {};
      for(const cp of cloudProds){
        map[cp.id] = { ...cp };
      }
      for(const lp of products){
        if(!lp.id){ lp.id = uidGen(); lp.lastUpdated = lp.lastUpdated || now(); }
        const existing = map[lp.id];
        if(!existing) {
          map[lp.id] = { ...lp };
        } else {
          const cloudLU = existing.lastUpdated || 0;
          const localLU = lp.lastUpdated || 0;
          if(localLU > cloudLU) map[lp.id] = { ...lp };
        }
      }

      // Remove cloud-deleted items from merged map and also schedule cloud cleanup
      const finalProducts = [];
      const toDeleteCloudIds = [];
      for(const id in map){
        const item = map[id];
        if(item.deleted){
          toDeleteCloudIds.push(id);
        } else {
          finalProducts.push(item);
        }
      }

      // MERGE SALES
      const salesMap = {};
      for(const cs of cloudSales) salesMap[cs.id] = { ...cs };
      for(const ls of sales){
        if(!ls.id){ ls.id = uidGen(); ls.lastUpdated = ls.lastUpdated || now(); }
        const existing = salesMap[ls.id];
        if(!existing) salesMap[ls.id] = { ...ls };
        else {
          const cloudLU = existing.lastUpdated || 0;
          const localLU = ls.lastUpdated || 0;
          if(localLU > cloudLU) salesMap[ls.id] = { ...ls };
        }
      }
      const finalSales = Object.values(salesMap);

      // Normalize & save merged locally
      for (const p of finalProducts) { if (p.deleted === undefined) p.deleted = false; }
      products = finalProducts.sort((a,b) => (a.name||'').localeCompare(b.name||''));
      sales = finalSales.sort((a,b)=> b.time - a.time);
      saveLS(LS_PRODUCTS(currentUID), products);
      saveLS(LS_SALES(currentUID), sales);

      // Cleanup cloud docs that were marked deleted
      for(const did of toDeleteCloudIds){
        await prodCol.doc(did).delete().catch(()=>{ /* ignore */ });
      }

      markDirty(false);
      showBilingualAlert('pull_complete');
      // refresh shared images list and cache newly discovered imageURLs to local base64 (async)
      await loadSharedImagesList();
      cacheRemoteImagesLocally(); // don't await
    } catch(err){
      console.error(err);
      showBilingualAlert(err.message || translations.en['sync_failed']);
      markDirty(true);
    }
    refreshProductsUI(); refreshCartUI(); refreshHistoryUI();
  };

  // cache remote imageURLs to localImageBase64 if not already cached for offline use
  async function cacheRemoteImagesLocally(){
    for(const p of products){
      if(!p.localImageBase64 && p.imageURL){
        try{
          const base64 = await fetchUrlToBase64(p.imageURL);
          p.localImageBase64 = base64;
          // save immediately to LS for offline
          saveLS(LS_PRODUCTS(currentUID), products);
        }catch(e){
          // ignore failures
        }
      }
    }
  }

  // ---------- connectivity UI ----------
  window.addEventListener('online', ()=> { syncStatusEl.textContent = dirty ? 'Pending 🟡' : 'Synced ✅'; });
  window.addEventListener('offline', ()=> { syncStatusEl.textContent = 'Offline 🔴'; });

  syncStatusEl.textContent = navigator.onLine ? translations[currentLang]['sync_manual'] + ' / ' + translations.hi['sync_manual'] : 'Offline 🔴';

  
  
  // ---------- BILINGUAL VOICE INPUT (EN/HI) ----------
  // Adds voice input for Product add (productVoiceBtn) and Sales add-to-cart (saleVoiceBtn).
  (function(){

    // small helper: map common Hindi words to numbers
    const hindiNumbersMap = {
      'एक':1, 'दो':2, 'तीन':3, 'चार':4, 'पाँच':5, 'पांच':5, 'छह':6, 'सात':7, 'आठ':8, 'नौ':9, 'दस':10,
      'पंद्रह':15, 'बीस':20, 'पच्चीस':25, 'तीस':30, 'पचास':50,
      'आधा':0.5, 'पौना':0.75, 'सवा':1.25, 'डेढ़':1.5, 'डेढ':1.5, 'ढाई':2.5, 'साढ़े':0.5
    };
    // english words too
    const englishNumbersMap = {'half':0.5, 'quarter':0.25, 'one':1, 'two':2, 'three':3, 'four':4, 'five':5, 'ten':10, 'fifteen':15, 'twenty':20 };

    function replaceWordsWithDigits(text){
      for(const w in hindiNumbersMap){
        const re = new RegExp('\\b'+w+'\\b','g');
        text = text.replace(re, String(hindiNumbersMap[w]));
      }
      for(const w in englishNumbersMap){
        const re = new RegExp('\\b'+w+'\\b','g');
        text = text.replace(re, String(englishNumbersMap[w]));
      }
      return text;
    }

    // ⭐ NEW: Advanced parser for adding products
    function parseProductCommand(text) {
        text = replaceWordsWithDigits(text.toLowerCase());

        const unitRegex = '(?:kilo|kg|gram|g|piece|dozen|दर्जन|पीस|किलो|ग्राम)';
        const currencyRegex = '(?:rupee|rs|₹|रुपये)';

        // Pattern 1: Captures "potato 20 rupee kilo total 15 kilo"
        const fullPattern = new RegExp(`(?<name>.+?)\\s+(?<price>\\d+(\\.\\d+)?)\\s+${currencyRegex}\\s+(?<unit>${unitRegex})\\s+(?:total|stock|कुल)?\\s*(?<qty>\\d+(\\.\\d+)?)`, 'i');

        // Pattern 2: Captures "potato 20 rupee kilo" (without total quantity)
        const pricePattern = new RegExp(`(?<name>.+?)\\s+(?<price>\\d+(\\.\\d+)?)\\s+${currencyRegex}\\s+(?<unit>${unitRegex})`, 'i');
        
        let match = fullPattern.exec(text);
        if (match && match.groups) {
            return {
                name: match.groups.name.trim(),
                price: parseFloat(match.groups.price),
                unit: (match.groups.unit || '').replace('kilo', 'kg').replace('gram', 'g'),
                qty: parseFloat(match.groups.qty)
            };
        }

        match = pricePattern.exec(text);
        if (match && match.groups) {
            return {
                name: match.groups.name.trim(),
                price: parseFloat(match.groups.price),
                unit: (match.groups.unit || '').replace('kilo', 'kg').replace('gram', 'g'),
                qty: '' // No quantity specified
            };
        }

        // Fallback to old parser for quantity only, e.g., "potato 1.5 kilo"
        const oldParsed = parseWeightCommand(text);
        if (oldParsed.product) {
            const totalKg = (Number(oldParsed.kilos || 0) + Number(oldParsed.grams || 0) / 1000);
            return { name: oldParsed.product, qty: totalKg > 0 ? totalKg : '', unit: oldParsed.unit };
        }

        return { name: text }; // Default if no pattern matches
    }
    
    // Original parser, now used as a fallback and for sales
    function parseWeightCommand(text){
      text = text.toLowerCase();
      text = replaceWordsWithDigits(text);

      text = text.replace(/किलो/g, ' kilo ').replace(/किलोग्राम/g,' kilo ').replace(/ग्राम/g,' gram ').replace(/kgs?/g,' kilo ').replace(/grams?/g,' gram ');
      text = text.replace(/\s+/g,' ').trim();

      let product = '', kilos = 0, grams = 0;
      
      let m = text.match(/([\u0900-\u097F\w\s]+?)\s+(\d+(?:\.\d+)?)\s*kilo(?:\s+(\d+(?:\.\d+)?)\s*gram)?/i);
      if(m){ product = m[1].trim(); kilos = parseFloat(m[2])||0; grams = parseFloat(m[3])||0; return {product, kilos, grams, unit: 'kg'}; }
      
      m = text.match(/(\d+(?:\.\d+)?)\s*gram\s+([\u0900-\u097F\w\s]+)/i);
      if(m){ grams = parseFloat(m[1])||0; product = m[2].trim(); return {product, kilos, grams, unit: 'g'}; }
      
      m = text.match(/([\u0900-\u097F\w\s]+?)\s+(\d+(?:\.\d+)?)\s*gram/i);
      if(m){ product = m[1].trim(); grams = parseFloat(m[2])||0; return {product, kilos, grams, unit: 'g'}; }
      
      m = text.match(/([\u0900-\u097F\w\s]+?)\s+(\d+(?:\.\d+)?)/i);
      if(m){ product = m[1].trim(); kilos = parseFloat(m[2])||0; return {product, kilos, grams, unit: 'kg'}; }

      let unit = 'kg';
      if (text.includes('piece') || text.includes('पीस')) unit = 'piece';
      else if (text.includes('dozen') || text.includes('दर्जन')) unit = 'dozen';
      return { product: text, unit };
    }

    // Setup SpeechRecognition instance (reused)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognizer = null;
    if(SpeechRecognition){
      recognizer = new SpeechRecognition();
      recognizer.interimResults = false;
      recognizer.maxAlternatives = 1;
    }

    function startRecognition(context){ // context: 'product' or 'sale'
      if(!recognizer){
        alert('SpeechRecognition not supported in this browser.');
        return;
      }
      try{
        recognizer.lang = (currentLang === 'hi') ? 'hi-IN' : 'en-IN';
      }catch(e){ recognizer.lang = 'en-IN'; }

      voiceStatusLocal('🎧 Listening... ('+context+')');
      recognizer.start();

      recognizer.onresult = function(evt){
        const spoken = evt.results[0][0].transcript.trim();
        voiceStatusLocal('Heard: "'+spoken+'"');
        
        if(context === 'product'){
          // ⭐ MODIFIED: Use the new advanced parser
          const parsed = parseProductCommand(spoken);
          
          if(parsed.name) p_name.value = parsed.name;
          if(parsed.price) p_price.value = parsed.price;
          if(parsed.unit) p_unit.value = parsed.unit;
          if(parsed.qty) p_qty.value = parsed.qty;
          
          showToast('Product details filled from voice. Please verify and save.');
          p_price.focus();

        } else if(context === 'sale'){
          // Sales logic remains the same, using the weight parser
          const parsed = parseWeightCommand(spoken);
          const prodName = (parsed.product || '').toLowerCase();
          let matched = products.find(p => (p.name||'').toLowerCase() === prodName);
          if(!matched){
            matched = products.find(p => (p.name||'').toLowerCase().includes(prodName));
          }
          const totalKg = (Number(parsed.kilos||0) + Number(parsed.grams||0)/1000);
          if(matched){
            let qtyToAdd = totalKg > 0 ? totalKg : 1;
            if(matched.unit === 'g') qtyToAdd = Math.round(totalKg * 1000);
            else if(matched.unit === 'kg') qtyToAdd = Number(totalKg.toFixed(3));
            
            const existing = cart.find(x=>x.id===matched.id && x.unit===matched.unit);
            if(existing) existing.qty = Number(existing.qty) + qtyToAdd;
            else cart.push({ id: matched.id, name: matched.name, price: matched.price, qty: qtyToAdd, unit: matched.unit, baseUnitCount: matched.baseUnitCount });
            refreshCartUI();
            showToast('Added to cart: ' + matched.name + ' (' + qtyToAdd + ' ' + matched.unit + ')');
          } else {
            p_name.value = parsed.product || '';
            p_unit.value = 'kg';
            p_qty.value = (totalKg > 0) ? totalKg : '';
            showToast('Product not found. Prefilled add-product form — please Save it.');
            show('products');
            window.scrollTo({top:0, behavior:'smooth'});
          }
        }
      };

      recognizer.onerror = function(evt){
        if(evt.error === 'not-allowed' || evt.error === 'security') {
          voiceStatusLocal('🚫 Microphone access not allowed. Use HTTPS or allow mic permissions.');
        } else {
          voiceStatusLocal('Error: ' + evt.error);
        }
      };
    }

    let voiceStatusTimeout = null;
    function voiceStatusLocal(msg){
      const prev = syncStatusEl.textContent;
      syncStatusEl.textContent = msg;
      clearTimeout(voiceStatusTimeout);
      voiceStatusTimeout = setTimeout(()=>{ syncStatusEl.textContent = prev; }, 3500);
    }

    const prodVoiceBtn = document.getElementById('productVoiceBtn');
    const saleVoiceBtn = document.getElementById('saleVoiceBtn');
    if(prodVoiceBtn){ prodVoiceBtn.addEventListener('click', ()=> startRecognition('product')); }
    if(saleVoiceBtn){ saleVoiceBtn.addEventListener('click', ()=> startRecognition('sale')); }

  })();
  // ---------- END BILINGUAL VOICE INPUT ----------

  // ---------- initial UI refresh & i18n ----------
  applyTranslations(currentLang);
  refreshProductsUI();
  refreshCartUI();
  refreshHistoryUI();

  // language toggle (switch UI language; bill uses single selected language)
  document.getElementById('langToggle').addEventListener('click', ()=>{
    const newLang = (currentLang === 'en') ? 'hi' : 'en';
    applyTranslations(newLang);
    refreshProductsUI();
    refreshHistoryUI();
    refreshCartUI();
  });

  // small safety: ensure lastUpdated on old local items (upgrade)
  function upgradeLocalTimestamps(){
    let changed = false;
    products.forEach(p => { if(!p.lastUpdated){ p.lastUpdated = p._createdAt || now(); changed = true; }});
    sales.forEach(s => { if(!s.lastUpdated){ s.lastUpdated = s._createdAt || now(); changed = true; }});
    if(changed){ saveLS(LS_PRODUCTS(currentUID), products); saveLS(LS_SALES(currentUID), sales); markDirty(true); }
  }

  // ensure UI refresh once more shortly after load (fix timing)
  setTimeout(()=>{ refreshProductsUI(); refreshCartUI(); refreshHistoryUI(); }, 600);



// -------- BURGER MENU TOGGLE --------
// const menuToggle = document.getElementById('menuToggle');
// const closeMenu = document.getElementById('closeMenu');
// const sideMenu = document.getElementById('sideMenu');

// menuToggle.addEventListener('click', () => {
//   sideMenu.classList.remove('translate-x-full');
// });

// closeMenu.addEventListener('click', () => {
//   sideMenu.classList.add('translate-x-full');
// });

// // Optional: close when clicking outside
// window.addEventListener('click', (e) => {
//   if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
//     sideMenu.classList.add('translate-x-full');
//   }
// });


// ---------- HAMBURGER MENU LOGIC ----------
const menuToggle = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');
const sideMenu = document.getElementById('sideMenu');

// open menu
menuToggle?.addEventListener('click', () => {
  sideMenu.classList.remove('translate-x-full');
  sideMenu.classList.add('translate-x-0');
});

// close menu
closeMenu?.addEventListener('click', () => {
  sideMenu.classList.add('translate-x-full');
  sideMenu.classList.remove('translate-x-0');
});

// also close menu when clicking outside (optional)
document.addEventListener('click', (e) => {
  if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
    sideMenu.classList.add('translate-x-full');
    sideMenu.classList.remove('translate-x-0');
  }
});


//---------------Share QR Code-----------------

// shareLinkBtn.onclick = () => {
//   if(!currentUID) return alert("Login first");
//   const link = `${window.location.origin}/mandi-master/vendor.html?vendor_id=${currentUID}`;
//   const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`;
//   const modalHtml = `
//     <div class="modal-backdrop" id="qrModal">
//       <div class="bg-white rounded-lg p-4 text-center max-w-sm w-full shadow">
//         <h3 class="font-semibold mb-2">Share this Link / QR</h3>
//         <img src="${qrUrl}" class="mx-auto mb-3" />
//         <input type="text" readonly class="w-full border rounded p-2 mb-2" value="${link}">
//         <button class="big-btn bg-sky-500 text-white" onclick="navigator.clipboard.writeText('${link}')">Copy Link</button>
//         <button class="big-btn bg-slate-300 mt-2" onclick="document.getElementById('qrModal').remove()">Close</button>
//       </div>
//     </div>`;
//   document.body.insertAdjacentHTML('beforeend', modalHtml);
// };


// Find and replace the existing shareLinkBtn.onclick function with this one.
shareLinkBtn.onclick = async () => {
  if (!currentUID) return alert("Login first");

  try {
    const vendorDoc = await db.collection("vendors").doc(currentUID).get();
    if (!vendorDoc.exists) return alert("Vendor record not found!");

    const data = vendorDoc.data();
    const slug = data.slug;

    if (!slug) return alert("Could not generate a share link for this vendor.");

    // --- THIS IS THE KEY CHANGE ---
    // Generate the clean, user-friendly URL instead of the query parameter one.
    const link = `${window.location.origin}/mandi-master/vendor/${slug}`;
    
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`;

    const old = document.getElementById('qrModal');
    if (old) old.remove();

    const modalHtml = `
      <div class="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50" id="qrModal">
        <div class="bg-white rounded-2xl p-5 text-center max-w-sm w-full shadow-xl animate-fadeIn">
          <h3 class="font-semibold text-lg mb-3">Share Your Store Link</h3>
          <img src="${qrUrl}" alt="QR Code" class="mx-auto mb-3 rounded-md shadow-sm" />
          <input type="text" readonly class="w-full border rounded-lg p-2 mb-2 text-sm text-gray-700" value="${link}">
          <button id="copyBtn" class="big-btn bg-sky-500 text-white rounded-lg px-4 py-2 w-full">Copy Link</button>
          <button class="big-btn bg-slate-300 mt-2 rounded-lg px-4 py-2 w-full" onclick="document.getElementById('qrModal').remove()">Close</button>
        </div>
      </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('copyBtn').onclick = async () => {
      await navigator.clipboard.writeText(link);
      const btn = document.getElementById('copyBtn');
      btn.textContent = "Copied ✅";
      btn.classList.replace("bg-sky-500", "bg-green-600");
      setTimeout(() => {
        btn.textContent = "Copy Link";
        btn.classList.replace("bg-green-600", "bg-sky-500");
      }, 1500);
    };
  } catch (error) {
    console.error("Error generating share link:", error);
    alert("An error occurred while creating the share link.");
  }
};





//Badge
const orderBadge = document.getElementById('orderBadge');
const orderFilter = document.getElementById('orderFilter');

let unseenCount = 0;
let allOrders = [];



//------Load customer Order ---------------------


// async function loadOrders() {
//   const snap = await db.collection('vendors').doc(currentUID).collection('orders').orderBy('createdAt', 'desc').get();
//   ordersList.innerHTML = '';
//   if (snap.empty) {
//     ordersList.innerHTML = '<div class="muted">No orders yet</div>';
//     return;
//   }

//   snap.forEach(doc => {
//     const data = doc.data();
//     const div = document.createElement('div');
//     div.className = 'border rounded p-3 bg-white shadow-sm';
//     const items = data.items.map(i => `${i.name} (${i.qty} ${i.unit})`).join(', ');
//     div.innerHTML = `
//       <div class="font-semibold">${data.customerName} — ${data.phone}</div>
//       <div class="small muted mb-1">${items}</div>
//       <div class="font-semibold text-emerald-700 mb-2">₹${data.total}</div>
//       <select class="border rounded p-1 text-sm statusSelect">
//         <option ${data.status==='Pending'?'selected':''}>Pending</option>
//         <option ${data.status==='Confirmed'?'selected':''}>Confirmed</option>
//         <option ${data.status==='Delivered'?'selected':''}>Delivered</option>
//         <option ${data.status==='Cancelled'?'selected':''}>Cancelled</option>
//       </select>
//     `;
//     const select = div.querySelector('.statusSelect');
//     select.onchange = async () => {
//       await db.collection('vendors').doc(currentUID).collection('orders').doc(doc.id).update({ status: select.value });
//       select.classList.add('bg-emerald-100');
//     };
//     ordersList.appendChild(div);
//   });
// }

function listenToOrders() {
  if (!currentUID) return;

  const ordersRef = db.collection('vendors').doc(currentUID).collection('orders').orderBy('createdAt', 'desc');

  ordersRef.onSnapshot(snapshot => {
    if (snapshot.size > lastOrderCount && lastOrderCount > 0) {
      const latest = snapshot.docs[0].data();
      showToast(`🛒 New order from ${latest.customerName || 'Customer'}`);
      playSound();
      unseenCount += 1;
      updateBadge();
    }
    lastOrderCount = snapshot.size;

    allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderOrders();
  });
}


function updateBadge() {
  if (unseenCount > 0) {
    orderBadge.textContent = unseenCount;
    orderBadge.classList.remove('hidden');
  } else {
    orderBadge.classList.add('hidden');
  }
}

// When Orders tab is opened, mark all as seen
tabOrders.onclick = () => {
  unseenCount = 0;
  updateBadge();
  show('orders');
};

orderFilter.onchange = () => renderOrders();

function renderOrders() {
  const filter = orderFilter.value;
  ordersList.innerHTML = '';

  let visibleOrders = allOrders;
  if (filter !== 'all') {
    visibleOrders = allOrders.filter(o => o.status === filter);
  }

  if (visibleOrders.length === 0) {
    ordersList.innerHTML = `<div class="muted text-center">No ${filter === 'all' ? '' : filter} orders</div>`;
    return;
  }

  visibleOrders.forEach(order => {
    const colorMap = {
      Pending: 'bg-gray-200 text-gray-800',
      Confirmed: 'bg-blue-200 text-blue-800',
      Delivered: 'bg-green-200 text-green-800',
      Cancelled: 'bg-red-200 text-red-800'
    };
    const tagColor = colorMap[order.status] || 'bg-gray-100';

    const div = document.createElement('div');
    div.className = 'border rounded p-3 bg-white shadow-sm';
    const items = order.items.map(i => `${i.name} (${i.qty} ${i.unit})`).join(', ');
    div.innerHTML = `
      <div class="flex justify-between items-center mb-1">
        <div class="font-semibold">${order.customerName} — ${order.phone}</div>
        <span class="px-2 py-0.5 rounded text-xs font-semibold ${tagColor}">${order.status}</span>
      </div>
      <div class="small muted mb-1">${items}</div>
      <div class="font-semibold text-emerald-700 mb-2 text-right">₹${order.total}</div>
      <select class="border rounded p-1 text-sm statusSelect">
        <option ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
        <option ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
        <option ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
        <option ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
      </select>
    `;
    const select = div.querySelector('.statusSelect');
    select.onchange = async () => {
      await db.collection('vendors').doc(currentUID).collection('orders').doc(order.id).update({ status: select.value });
      select.classList.add('bg-emerald-100');
      showToast(`✅ Order marked as ${select.value}`);
    };
    ordersList.appendChild(div);
  });
}






//Notification 


const toast = document.getElementById('toast');
const notifySound = document.getElementById('notifySound');
let lastOrderCount = 0;

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

function playSound() {
  try { notifySound.play(); } catch (e) { console.warn("Sound blocked by browser autoplay policy"); }
}




})();