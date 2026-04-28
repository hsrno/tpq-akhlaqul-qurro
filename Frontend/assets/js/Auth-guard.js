/* ════════════════════════════════════════
   TPQ AKHLAQUL QURRO' — Auth Guard
   assets/js/auth-guard.js

   CARA PAKAI di setiap dashboard:
   <script src="../assets/js/auth-guard.js"></script>
   Letakkan paling PERTAMA sebelum script lain.

   Otomatis redirect ke login jika tidak ada session.
   Set window.REQUIRED_ROLE = 'santri' atau 'ortu'
   sebelum load script ini untuk validasi role.
   ════════════════════════════════════════ */

(function () {
  "use strict";

  const SESSION_KEY = "tpq_session";

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  const session = getSession();

  // Tidak ada session → redirect login
  if (!session || !session.role) {
    window.location.replace("./login.html");
    throw new Error("Unauthorized");
  }

  // Validasi role (jika REQUIRED_ROLE sudah diset)
  const required = window.REQUIRED_ROLE;
  if (required && session.role !== required) {
    // Role salah → redirect ke dashboard yang sesuai
    if (session.role === "santri") {
      window.location.replace("./dashboard-santri.html");
    } else {
      window.location.replace("./dashboard-ortu.html");
    }
    throw new Error("Wrong role");
  }

  // Expose session globally
  window.TPQSession = {
    get: function () {
      return getSession();
    },
    clear: function () {
      clearSession();
      window.location.replace("./login.html");
    },
    logout: function () {
      clearSession();
      window.location.replace("./login.html");
    },
  };

  window.TPQ_CURRENT_USER = session;
})();
