/* ════════════════════════════════════════
   TPQ AKHLAQUL QURRO' — auth-guard.js
   Taruh di: Frontend/assets/js/auth-guard.js
   Load PERTAMA sebelum script lain di setiap dashboard
   ════════════════════════════════════════ */

(function () {
  "use strict";

  var user = null;

  try {
    var raw = localStorage.getItem("user");
    if (raw) user = JSON.parse(raw);
  } catch (e) {
    console.error("auth-guard: gagal parse user dari localStorage", e);
  }

  // Tentukan halaman saat ini
  var path = window.location.pathname;
  var isSantriDash =
    path.includes("dashboard-santri") || path.includes("santri/dashboard");
  var isOrtuDash =
    path.includes("dashboard-ortu") || path.includes("ortu/dashboard");

  // Kalau belum login → redirect ke login
  if (!user) {
    window.location.replace("../login.html");
    return; // stop eksekusi script lain
  }

  // Kalau role tidak sesuai halaman → redirect ke login
  if (isSantriDash && user.role !== "santri") {
    window.location.replace("../login.html");
    return;
  }
  if (isOrtuDash && user.role !== "ortu") {
    window.location.replace("../login.html");
    return;
  }

  // Expose user ke global supaya script lain bisa pakai
  window.tpqUser = user;

  // Fungsi logout global
  window.logout = function () {
    localStorage.removeItem("user");
    window.location.replace("../login.html");
  };

  console.log(
    "✅ auth-guard: login sebagai",
    user.role,
    "-",
    user.nama_lengkap || user.nama_ortu,
  );
})();
