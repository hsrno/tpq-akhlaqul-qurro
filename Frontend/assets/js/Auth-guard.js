/* ════════════════════════════════════════
   TPQ AKHLAQUL QURRO' — auth-guard.js  v2
   Simpan sebagai: Frontend/assets/js/auth-guard.js
   (huruf kecil semua — penting di Linux/server!)

   URUTAN LOAD di setiap dashboard:
   1. supabase.min.js
   2. santri.js
   3. auth-guard.js   ← file ini
   4. jadwal.js
   5. dash-santri.js / dash-ortu.js

   PERBAIKAN dari v1:
   1. Nama file lowercase konsisten (Auth-guard.js → auth-guard.js)
   2. window.logout TIDAK didefinisikan di sini —
      biarkan masing-masing dashboard yang define (mereka punya modal)
      auth-guard hanya menyiapkan _logoutFn sebagai fallback
   3. Redirect path dihitung dinamis, tidak hardcode "../login.html"
   4. Pesan console lebih informatif untuk debugging
   ════════════════════════════════════════ */

(function () {
  "use strict";

  /* ─────────────────────────────────────
     STEP 1: Baca data user dari localStorage
     ───────────────────────────────────── */
  var user = null;

  try {
    var raw = localStorage.getItem("user");
    if (raw) user = JSON.parse(raw);
  } catch (e) {
    // localStorage rusak / JSON invalid → anggap belum login
    console.warn("auth-guard: gagal baca localStorage →", e.message);
  }

  /* ─────────────────────────────────────
     STEP 2: Hitung path login yang benar
     Analogi: satpam tahu persis di lantai berapa dia berdiri,
     jadi tahu harus turun berapa tingkat untuk ke pintu masuk.

     dashboard-santri.html → satu level dari root → "login.html"
     pages/tentang.html    → satu level masuk     → "../login.html"
     ───────────────────────────────────── */
  var path = window.location.pathname;
  var depth = (path.match(/\//g) || []).length; // hitung jumlah "/"
  var loginPath = depth <= 2 ? "login.html" : "../login.html";

  function redirectToLogin() {
    console.warn("auth-guard: tidak terautentikasi → redirect ke", loginPath);
    window.location.replace(loginPath);
  }

  /* ─────────────────────────────────────
     STEP 3: Cek apakah halaman ini butuh role tertentu
     ───────────────────────────────────── */
  var isSantriDash = path.includes("dashboard-santri");
  var isOrtuDash = path.includes("dashboard-ortu");

  // Belum login sama sekali
  if (!user) {
    redirectToLogin();
    return; // stop — script di bawahnya tidak perlu jalan
  }

  // Login tapi role salah
  if (isSantriDash && user.role !== "santri") {
    console.warn(
      "auth-guard: role '" + user.role + "' tidak boleh akses dashboard santri",
    );
    redirectToLogin();
    return;
  }
  if (isOrtuDash && user.role !== "ortu") {
    console.warn(
      "auth-guard: role '" + user.role + "' tidak boleh akses dashboard ortu",
    );
    redirectToLogin();
    return;
  }

  /* ─────────────────────────────────────
     STEP 4: Lolos semua pengecekan
     Expose user ke global supaya dashboard script bisa pakai
     ───────────────────────────────────── */
  window.tpqUser = user;

  /*
     PENTING — window.logout SENGAJA tidak didefinisikan di sini.

     Analoginya: satpam tugasnya cek tiket masuk, bukan urus pintu keluar.
     Pintu keluar (logout dengan modal konfirmasi) diurus oleh
     dash-santri.js dan dash-ortu.js masing-masing.

     Tapi kalau script dashboard gagal load (misal error jaringan),
     kita sediakan fallback sederhana:
  */
  window._logoutFallback = function () {
    try {
      localStorage.removeItem("user");
    } catch (e) {}
    window.location.replace(loginPath);
  };

  // Pasang fallback dulu; dashboard script akan override window.logout
  // dengan versi yang punya modal konfirmasi
  if (typeof window.logout !== "function") {
    window.logout = window._logoutFallback;
  }

  console.log(
    "✅ auth-guard OK | role:",
    user.role,
    "| nama:",
    user.nama_lengkap || user.nama_ortu || "—",
    "| halaman:",
    path,
  );
})();
