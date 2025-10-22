// ==========================
// 🔥 FIREBASE INITIALIZATION
// ==========================
// const auth = firebase.auth();
// const db = firebase.firestore();

// ==========================
// 🌐 DOM ELEMENTS
// ==========================
const loginView = document.getElementById("loginView");
const adminView = document.getElementById("adminView");
const emailField = document.getElementById("adminEmail");
const passField = document.getElementById("adminPass");
const loginBtn = document.getElementById("adminLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const vendorList = document.getElementById("vendorList");
const searchBox = document.getElementById("searchBox");

// Stat cards
const statVendors = document.querySelectorAll(".grid div:nth-child(1) p");
const statSubscriptions = document.querySelectorAll(".grid div:nth-child(2) p");
const statOrders = document.querySelectorAll(".grid div:nth-child(3) p");

// ==========================
// 🧾 LOGIN / LOGOUT
// ==========================
loginBtn.onclick = async () => {
  try {
    await auth.signInWithEmailAndPassword(
      emailField.value.trim(),
      passField.value.trim()
    );
  } catch (e) {
    alert("Login failed: " + e.message);
  }
};

logoutBtn.onclick = () => auth.signOut();

// ==========================
// 👑 AUTH STATE MANAGEMENT
// ==========================
auth.onAuthStateChanged(async (user) => {
  if (user) {
    try {
      console.log("Logged in user:", user.email);

      // Verify admin privileges
      const adminDoc = await db.collection("admins").doc(user.uid).get();
      if (!adminDoc.exists || adminDoc.data().role !== "superadmin") {
        alert("❌ Access denied. Superadmin only.");
        await auth.signOut();
        return;
      }

      // ✅ Grant access
      loginView.classList.add("hidden");
      adminView.classList.remove("hidden");

      // Initialize dashboard
      initDashboard();

    } catch (err) {
      console.error("Error verifying admin:", err);
      alert("Error checking admin privileges: " + err.message);
      await auth.signOut();
    }
  } else {
    adminView.classList.add("hidden");
    loginView.classList.remove("hidden");
  }
});

// ==========================
// 🧠 DASHBOARD INITIALIZER
// ==========================
async function initDashboard() {
  updateStats();
  loadVendors();

  // Setup tab switching logic
  document.querySelectorAll(".sidebar-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;
      switch (tabId) {
        case "vendors":
          loadVendors();
          break;
        case "subscriptions":
          loadSubscriptions();
          break;
        case "orders":
          loadOrders();
          break;
      }
    });
  });
}

// ==========================
// 📊 REAL-TIME DASHBOARD STATS
// ==========================
async function updateStats() {
  try {
    const vendorSnap = await db.collection("vendors").get();
    const totalVendors = vendorSnap.size;

    const activeSubs = vendorSnap.docs.filter(
      (d) => d.data().subscription?.status === "active"
    ).length;

    const orderSnap = await db.collection("orders").get();
    const totalOrders = orderSnap.size;

    // Populate dashboard stat cards
    statVendors.forEach((el) => (el.textContent = totalVendors));
    statSubscriptions.forEach((el) => (el.textContent = activeSubs));
    statOrders.forEach((el) => (el.textContent = totalOrders));
  } catch (err) {
    console.error("Error updating stats:", err);
  }
}

// ==========================
// 🧑‍💼 LOAD & RENDER VENDORS
// ==========================
async function loadVendors() {
  vendorList.innerHTML = `<div class="col-span-full text-center text-gray-500 p-4">Loading vendors...</div>`;
  const snap = await db.collection("vendors").get();
  const vendors = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  renderVendors(vendors);
}

function renderVendors(vendors) {
  vendorList.innerHTML = "";
  if (!vendors.length) {
    vendorList.innerHTML = `<div class="text-gray-500 p-4">No vendors found.</div>`;
    return;
  }

  vendors.forEach((v) => {
    const sub = v.subscription || {};
    const status = sub.status || "inactive";
    const card = document.createElement("div");

    card.className =
      "bg-white p-4 rounded-xl shadow hover:shadow-lg transition border border-gray-100";

    card.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">${
            v.shopName || "Unnamed Vendor"
          }</h3>
          <p class="text-sm text-gray-500">${v.email || "-"}</p>
        </div>
     <div class="text-right">
  <span class="text-xs text-gray-500">${sub.pricePerWeek || "-"}</span><br>
  <span class="font-semibold ${
    status === "active" ? "text-green-600" : "text-red-600"
  }">${status}</span><br>
  <span class="text-sm text-gray-700">${sub.pricePerWeek ? `₹${sub.price}/month` : "-"}</span>
</div>

      </div>
      <div class="mt-4 flex gap-2">
        <button class="activateBtn bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg text-sm">Activate</button>
        <button class="deactivateBtn bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded-lg text-sm">Deactivate</button>
      </div>
    `;

    // --- Button actions ---
    card.querySelector(".activateBtn").onclick = async () => {
      await db.collection("vendors").doc(v.id).set(
        { subscription: { ...sub, status: "active" } },
        { merge: true }
      );
      alert("✅ Vendor activated");
      loadVendors();
      updateStats();
    };

    card.querySelector(".deactivateBtn").onclick = async () => {
      await db.collection("vendors").doc(v.id).set(
        { subscription: { ...sub, status: "inactive" } },
        { merge: true }
      );
      alert("🚫 Vendor deactivated");
      loadVendors();
      updateStats();
    };

    vendorList.appendChild(card);
  });
}

// ==========================
// 💳 LOAD SUBSCRIPTIONS
// ==========================
async function loadSubscriptions() {
  const container = document.querySelector("#subscriptions");
  container.innerHTML = `
    <h2 class="text-xl font-semibold mb-4">💳 Manage Subscriptions</h2>
    <div class="text-gray-500 p-6">Loading subscription plans...</div>
  `;

  const snap = await db.collection("plans").get();
  const plans = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  if (!plans.length) {
    container.innerHTML += `<div class="text-gray-500 p-6">No subscription plans found.</div>`;
    return;
  }

  const grid = document.createElement("div");
  grid.className = "grid md:grid-cols-2 lg:grid-cols-3 gap-4";

  plans.forEach((plan) => {
    const card = document.createElement("div");
    card.className =
      "bg-white shadow rounded-xl p-5 hover:shadow-lg transition border border-gray-100";
    card.innerHTML = `
      <h3 class="text-lg font-semibold text-emerald-700">${plan.name}</h3>
      <p class="text-sm text-gray-600">${plan.description || ""}</p>
      <p class="mt-2 text-2xl font-bold text-emerald-600">₹${
        plan.pricePerWeek
      } / ${plan.duration || "month"}</p>
      <p class="mt-2 text-xs text-gray-400">${plan.features
        ?.join(", ") || ""}</p>
      <div class="mt-3 flex gap-2">
        <button class="editPlan bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg text-sm">Edit</button>
        <button class="deletePlan bg-rose-500 hover:bg-rose-600 text-white px-3 py-1 rounded-lg text-sm">Delete</button>
      </div>
    `;
    grid.appendChild(card);
  });

  container.innerHTML = `
    <h2 class="text-xl font-semibold mb-4">💳 Manage Subscriptions</h2>
  `;
  container.appendChild(grid);
}
// ==========================
// 📦 LOAD ORDERS (with vendor name)
// ==========================
async function loadOrders() {
  const container = document.querySelector("#orders");
  container.innerHTML = `
    <h2 class="text-xl font-semibold mb-4">📦 Manage Orders</h2>
    <div class="text-gray-500 p-6">Loading orders...</div>
  `;

  try {
    const vendorsSnap = await db.collection("vendors").get();
    const allOrders = [];

    // Fetch orders for each vendor
    for (const vendorDoc of vendorsSnap.docs) {
      const vendorId = vendorDoc.id;
      const vendorData = vendorDoc.data();
      const vendorName =
        vendorData.shopName || vendorData.businessName || vendorData.storeName || "Unnamed Vendor";

      const ordersSnap = await db
        .collection("vendors")
        .doc(vendorId)
        .collection("orders")
        .orderBy("createdAt", "desc")
        .get();

      ordersSnap.forEach((orderDoc) => {
        const orderData = orderDoc.data();
        allOrders.push({
          id: orderDoc.id,
          vendorName, // ✅ Show vendor name here
          ...orderData,
        });
      });
    }

    // Sort all orders by createdAt descending
    allOrders.sort((a, b) => {
      const t1 = a.createdAt?.seconds || 0;
      const t2 = b.createdAt?.seconds || 0;
      return t2 - t1;
    });

    // No orders found
    if (!allOrders.length) {
      container.innerHTML = `
        <h2 class="text-xl font-semibold mb-4">📦 Manage Orders</h2>
        <div class="text-gray-500 p-6">No orders yet.</div>
      `;
      return;
    }

    // Build orders table
    const table = document.createElement("table");
    table.className = "min-w-full bg-white rounded-xl shadow overflow-hidden";

    table.innerHTML = `
      <thead class="bg-emerald-600 text-white">
        <tr>
          <th class="py-2 px-4 text-left text-sm">Order ID</th>
          <th class="py-2 px-4 text-left text-sm">Vendor</th>
          <th class="py-2 px-4 text-left text-sm">Customer</th>
          <th class="py-2 px-4 text-left text-sm">Amount</th>
          <th class="py-2 px-4 text-left text-sm">Status</th>
          <th class="py-2 px-4 text-left text-sm">Date</th>
        </tr>
      </thead>
      <tbody class="text-gray-700"></tbody>
    `;

    const tbody = table.querySelector("tbody");

    allOrders.forEach((o) => {
      const tr = document.createElement("tr");
      tr.className = "border-b hover:bg-gray-50";
      tr.innerHTML = `
        <td class="py-2 px-4 text-sm">${o.id}</td>
        <td class="py-2 px-4 text-sm">${o.vendorName}</td>
        <td class="py-2 px-4 text-sm">${o.customerName || "-"}</td>
        <td class="py-2 px-4 text-sm">₹${o.total || 0}</td>
        <td class="py-2 px-4 text-sm font-semibold ${
          o.status === "delivered"
            ? "text-green-600"
            : o.status === "cancelled"
            ? "text-red-600"
            : "text-yellow-600"
        }">${o.status || "pending"}</td>
        <td class="py-2 px-4 text-sm">${
          o.createdAt
            ? new Date(o.createdAt.seconds * 1000).toLocaleString()
            : "-"
        }</td>
      `;
      tbody.appendChild(tr);
    });

    container.innerHTML = `
      <h2 class="text-xl font-semibold mb-4">📦 Manage Orders</h2>
    `;
    container.appendChild(table);
  } catch (err) {
    console.error("Error loading orders:", err);
    container.innerHTML = `
      <div class="text-red-600 p-6">Failed to load orders. Check console for details.</div>
    `;
  }
}









// ==========================
// 🔍 SEARCH FUNCTIONALITY
// ==========================
searchBox.oninput = async (e) => {
  const val = e.target.value.toLowerCase();
  const snap = await db.collection("vendors").get();
  const vendors = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter(
      (v) =>
        (v.shopName || "").toLowerCase().includes(val) ||
        (v.email || "").toLowerCase().includes(val)
    );
  renderVendors(vendors);
};
