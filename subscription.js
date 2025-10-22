document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const vendorId = params.get("vendor");
  if (!vendorId) {
    alert("Vendor ID missing (use ?vendor=vendor-1)");
    return;
  }

  const dbRef = db.collection("vendors").doc(vendorId);
  const loading = document.getElementById("loading");
  const info = document.getElementById("subscription-info");
  const planType = document.getElementById("plan-type");
  const startDate = document.getElementById("start-date");
  const endDate = document.getElementById("end-date");
  const daysLeft = document.getElementById("days-left");
  const upgradeBtn = document.getElementById("upgrade-btn");
  const plansGrid = document.getElementById("plans-grid");

  try {
    const [vendorSnap, plansSnap, trialSnap] = await Promise.all([
      dbRef.get(),
      db.collection("plans").get(),
      db.collection("settings").doc("trial").get()
    ]);

    const vendorData = vendorSnap.exists ? vendorSnap.data() : {};
    const sub = vendorData.subscription || {};
    const now = new Date();
    const trialDays = trialSnap.exists ? trialSnap.data().days : 7;

    // // --- Fetch & Display Plans ---
    // const plans = [];
    // plansSnap.forEach(doc => plans.push({ id: doc.id, ...doc.data() }));

    // plansGrid.innerHTML = plans.map(plan => `
    //   <div class="plan-card bg-white rounded-xl shadow-lg p-6 border border-gray-200 text-center">
    //     <div class="text-4xl mb-3">${plan.icon || "⭐"}</div>
    //     <h3 class="text-xl font-bold text-gray-800">${plan.name}</h3>
    //     <p class="text-2xl font-bold text-blue-600 mt-1">₹${plan.price}/month</p>
    //     <ul class="mt-4 text-sm text-gray-600 space-y-1">
    //       ${plan.features.map(f => `<li>✓ ${f}</li>`).join("")}
    //     </ul>
    //     <button data-plan="${plan.id}" class="select-plan w-full mt-6 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">Select</button>
    //   </div>
    // `).join("");


    // --- Fetch & Display Plans ---
const plans = [];
plansSnap.forEach(doc => plans.push({ id: doc.id, ...doc.data() }));

plansGrid.innerHTML = plans.map(plan => {
  // Fallbacks for safety
  const weekly = plan.pricePerWeek ?? 0;
  const daily = plan.pricePerDay ?? 0;
  const isTrial = plan.id === "trial";

  return `
    <div class="plan-card bg-white rounded-xl shadow-lg p-6 border border-gray-200 text-center relative overflow-hidden">
      ${isTrial ? `<div class="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 rounded-bl-md">Trial</div>` : ""}
      <div class="text-4xl mb-3">${plan.icon || (isTrial ? "🎁" : "⭐")}</div>
      <h3 class="text-xl font-bold text-gray-800">${plan.name}</h3>
      ${!isTrial ? `
        <p class="text-2xl font-bold text-blue-600 mt-1">₹${weekly} / week</p>
        <p class="text-sm text-gray-500 mb-4">≈ ₹${daily} / day</p>
      ` : `
        <p class="text-lg font-semibold text-emerald-600 mt-2">Free for ${plan.trialDurationDays || 7} days</p>
        <p class="text-sm text-gray-500 mb-4">All premium features included</p>
      `}
      <p class="text-gray-600 text-sm mb-4">${plan.description || ""}</p>
      <ul class="mt-4 text-sm text-gray-700 text-left space-y-1 mb-6">
        ${plan.features.map(f => `<li>✅ ${f}</li>`).join("")}
      </ul>
      <button data-plan="${plan.id}"
        class="select-plan w-full mt-auto bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
        ${isTrial ? "Activate Trial" : "Select Plan"}
      </button>
    </div>
  `;
}).join("");


    // --- Handle Plan Selection ---
    document.querySelectorAll(".select-plan").forEach(btn => {
      btn.addEventListener("click", async () => {
        const planId = btn.dataset.plan;
        const plan = plans.find(p => p.id === planId);
        if (!plan) return;

        if (!confirm(`Confirm subscription to ${plan.name} for ₹${plan.price}?`)) return;

        const start = new Date();
        const end = new Date(start);
        end.setMonth(end.getMonth() + 1);

        await dbRef.set({
          subscription: {
            plan: plan.name,
            status: "pending",
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            paymentMode: "manual",
          }
        }, { merge: true });

        alert("Subscription request sent for admin approval.");
        location.reload();
      });
    });

    // --- Show Current Subscription ---
    loading.classList.add("hidden");
    info.classList.remove("hidden");

    if (!sub.plan) {
      planType.textContent = "Trial (All Features)";
      const trialEnd = new Date(vendorData.createdAt?.toDate() || Date.now());
      trialEnd.setDate(trialEnd.getDate() + trialDays);
      startDate.textContent = new Date().toDateString();
      endDate.textContent = trialEnd.toDateString();
      daysLeft.textContent = `${trialDays} days`;
      upgradeBtn.classList.remove("hidden");
      return;
    }

    const start = new Date(sub.startDate);
    const end = new Date(sub.endDate);
    const diff = Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));

    planType.textContent = sub.plan;
    startDate.textContent = start.toDateString();
    endDate.textContent = end.toDateString();
    daysLeft.textContent = `${diff} days`;

    if (sub.status === "active" && sub.plan.toLowerCase() !== "elite") {
      upgradeBtn.classList.remove("hidden");
      upgradeBtn.onclick = () => {
        plansGrid.scrollIntoView({ behavior: "smooth" });
      };
    }

  } catch (err) {
    console.error("Error loading subscription:", err);
    loading.textContent = "⚠️ Failed to load data.";
  }
});
