// admin.js
// ✅ Works with firebase-config.js globals

const allowedAdmins = ["youremail@gmail.com"]; // <-- change this to your admin email

const loginView = document.getElementById("loginView");
const adminView = document.getElementById("adminView");
const emailField = document.getElementById("adminEmail");
const passField = document.getElementById("adminPass");
const loginBtn = document.getElementById("adminLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const searchBox = document.getElementById("searchBox");
const vendorList = document.getElementById("vendorList");

// --- Login ---
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

// --- Auth State ---
auth.onAuthStateChanged(async (user) => {
    if (user) {
      try {
        console.log("Logged in user:", user.email, user.uid);
        
        // Get Firestore admin document
        const adminRef = db.collection("admins").doc(user.uid);
        const adminDoc = await adminRef.get();
  
        if (!adminDoc.exists) {
          console.warn("No admin document found for UID:", user.uid);
          alert("❌ Access denied. No admin document found.");
          await auth.signOut();
          return;
        }
  
        const data = adminDoc.data();
        console.log("Admin doc data:", data);
  
        if (data.role !== "superadmin") {
          alert("❌ Access denied. You are not a superadmin.");
          await auth.signOut();
          return;
        }
  
        // ✅ Passed all checks
        console.log("✅ Admin access granted");
        loginView.classList.add("hidden");
        adminView.classList.remove("hidden");
        loadVendors();
  
      } catch (err) {
        console.error("Error verifying admin:", err);
        alert("Error checking admin privileges: " + err.message);
        await auth.signOut();
      }
    } else {
      // Signed out
      adminView.classList.add("hidden");
      loginView.classList.remove("hidden");
    }
  });
  

// --- Load Vendor List ---
async function loadVendors() {
  vendorList.innerHTML = "<p>Loading vendors...</p>";
  const snap = await db.collection("vendors").get();
  renderVendors(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

// --- Render Cards ---
function renderVendors(vendors) {
  vendorList.innerHTML = "";
  vendors.forEach((v) => {
    const sub = v.subscription || {};
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded-lg shadow";
    const status = sub.status || "no plan";
    card.innerHTML = `
      <div class="flex justify-between">
        <div>
          <h3 class="font-semibold">${v.shopName || "Unnamed"}</h3>
          <p class="text-sm text-gray-500">${v.email || ""}</p>
        </div>
        <div class="text-right">
          <span class="text-xs text-gray-500">${sub.plan || "-"}</span><br>
          <span class="font-semibold ${
            status === "active" ? "text-green-600" : "text-red-600"
          }">${status}</span>
        </div>
      </div>
      <div class="mt-3 flex gap-2">
        <button class="activateBtn bg-emerald-500 text-white px-3 py-1 rounded">Activate</button>
        <button class="deactivateBtn bg-rose-500 text-white px-3 py-1 rounded">Deactivate</button>
      </div>
    `;

    card.querySelector(".activateBtn").onclick = async () => {
      await db.collection("vendors").doc(v.id).set(
        {
          subscription: { ...sub, status: "active" },
        },
        { merge: true }
      );
      alert("✅ Activated");
      loadVendors();
    };

    card.querySelector(".deactivateBtn").onclick = async () => {
      await db.collection("vendors").doc(v.id).set(
        {
          subscription: { ...sub, status: "inactive" },
        },
        { merge: true }
      );
      alert("🚫 Deactivated");
      loadVendors();
    };

    vendorList.appendChild(card);
  });
}

// --- Search ---
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
