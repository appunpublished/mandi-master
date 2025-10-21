// subscription.js — Enhanced visual version

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const vendorId = params.get("vendor");
    if (!vendorId) {
      alert("Vendor ID missing from URL (use ?vendor=vendor-1)");
      return;
    }
  
    const loading = document.getElementById("loading");
    const card = document.getElementById("subCard");
    const renewContainer = document.getElementById("renewBtnContainer");
    const planBadge = document.getElementById("planBadge");
    const statusBadge = document.getElementById("statusBadge");
  
    try {
      const vendorRef = db.collection("vendors").doc(vendorId);
      const docSnap = await vendorRef.get();
  
      if (!docSnap.exists) {
        loading.textContent = "No vendor data found.";
        return;
      }
  
      const data = docSnap.data();
      const sub = data.subscription || {};
      const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now());
      const now = new Date();
  
      let planName = sub.plan || "Trial";
      let startDate = sub.startDate ? new Date(sub.startDate) : createdAt;
      let endDate = sub.endDate ? new Date(sub.endDate) : new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
      let daysLeft = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
      let totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  
      const isExpired = daysLeft <= 0;
      const isInactive = sub.status && sub.status.toLowerCase() === "inactive";
      const isPending = sub.status && sub.status.toLowerCase() === "pending";
  
      // Show data
      loading.classList.add("hidden");
      card.classList.remove("hidden");
  
    //   document.getElementById("plan").textContent = planName;
    //   document.getElementById("status").textContent = sub.status || "Active";
      document.getElementById("start").textContent = startDate.toDateString();
      document.getElementById("end").textContent = endDate.toDateString();
      document.getElementById("daysLeft").textContent = daysLeft;
      document.getElementById("mode").textContent = sub.paymentMode || "manual";
  
      // Color badges
      planBadge.textContent = planName.toUpperCase();
      planBadge.className =
        "px-3 py-1 rounded-full text-white text-sm font-medium " +
        (planName.toLowerCase() === "basic"
          ? "bg-emerald-500"
          : planName.toLowerCase() === "advanced"
          ? "bg-indigo-500"
          : "bg-gray-400");
  
      statusBadge.textContent = (sub.status || "active").toUpperCase();
      statusBadge.className =
        "px-3 py-1 rounded-full text-white text-sm font-medium " +
        (isPending
          ? "bg-amber-500"
          : isInactive
          ? "bg-rose-500"
          : isExpired
          ? "bg-gray-400"
          : "bg-emerald-500");
  
      // Progress bar
      const percent = Math.min(100, Math.floor(((totalDays - daysLeft) / totalDays) * 100));
      document.getElementById("progressBar").style.width = `${percent}%`;
      document.getElementById("progressLabel").textContent = `Progress: ${percent}% • ${daysLeft} days left`;
      
  
      // Renew button visibility
      if (isExpired || isInactive) {
        renewContainer.classList.remove("hidden");
        document.getElementById("renewBtn").onclick = async () => {
          await vendorRef.set(
            {
              subscription: {
                plan: sub.plan,
                status: "pending",
                startDate: now.toISOString(),
                endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                paymentMode: "manual",
                remarks: "Renewal request pending admin verification",
              },
            },
            { merge: true }
          );
          alert("🕓 Renewal request submitted. Wait for admin approval.");
          window.location.reload();
        };
      } else {
        renewContainer.classList.add("hidden");
      }
    } catch (e) {
      console.error(e);
      loading.textContent = "Error loading subscription details.";
    }
  });


  
  