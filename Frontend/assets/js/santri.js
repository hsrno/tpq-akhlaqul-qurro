/* ════════════════════════════════════════
   TPQ AKHLAQUL QURRO' — Portal Santri JS
   Halaman: santri.html (Login Portal)
   ════════════════════════════════════════ */

(function () {
  "use strict";

  /* ══════════════════════════════════════
     STATE
  ══════════════════════════════════════ */
  let currentRole = "santri";

  /* ══════════════════════════════════════
     ROLE SWITCHER
  ══════════════════════════════════════ */
  function switchRole(role) {
    currentRole = role;

    // Update tab active style
    document
      .getElementById("tab-santri")
      .classList.toggle("active", role === "santri");
    document
      .getElementById("tab-ortu")
      .classList.toggle("active", role === "ortu");

    // Update label, placeholder, input type, dan info box
    const idLabel = document.getElementById("id-label");
    const idInput = document.getElementById("input-id");
    const roleInfoText = document.getElementById("role-info-text");

    if (role === "santri") {
      idLabel.textContent = "NIS (Nomor Induk Santri)";
      idInput.placeholder = "Contoh: 2024001";
      idInput.type = "text";
      roleInfoText.innerHTML =
        "Masuk dengan <strong>NIS (Nomor Induk Santri)</strong> dan password yang diberikan oleh ustadz/ustadzah.";
    } else {
      idLabel.textContent = "Nomor HP / NIS Anak";
      idInput.placeholder = "Contoh: 08123456789";
      idInput.type = "tel";
      roleInfoText.innerHTML =
        "Masuk dengan <strong>Nomor HP</strong> yang terdaftar atau <strong>NIS anak</strong> Anda beserta password.";
    }

    clearErrors();
  }

  // Expose ke global untuk onclick di HTML
  window.switchRole = switchRole;

  /* ══════════════════════════════════════
     TOGGLE PASSWORD VISIBILITY
  ══════════════════════════════════════ */
  function togglePassword() {
    const input = document.getElementById("input-pw");
    const icon = document.getElementById("eye-icon");
    const isHidden = input.type === "password";

    input.type = isHidden ? "text" : "password";
    icon.innerHTML = isHidden
      ? '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
      : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>';
  }

  window.togglePassword = togglePassword;

  /* ══════════════════════════════════════
     FORM VALIDATION
  ══════════════════════════════════════ */
  function clearErrors() {
    document.getElementById("id-error").classList.add("hidden");
    document.getElementById("pw-error").classList.add("hidden");
    document.getElementById("input-id").style.borderColor = "";
    document.getElementById("input-pw").style.borderColor = "";
  }

  /* ══════════════════════════════════════
     HANDLE LOGIN SUBMIT
  ══════════════════════════════════════ */
  function handleLogin(e) {
    e.preventDefault();
    clearErrors();

    const id = document.getElementById("input-id").value.trim();
    const pw = document.getElementById("input-pw").value.trim();
    let valid = true;

    if (!id) {
      document.getElementById("id-error").classList.remove("hidden");
      document.getElementById("input-id").style.borderColor = "#ef4444";
      valid = false;
    }
    if (!pw) {
      document.getElementById("pw-error").classList.remove("hidden");
      document.getElementById("input-pw").style.borderColor = "#ef4444";
      valid = false;
    }
    if (!valid) return;

    // Loading state
    const btn = document.getElementById("btn-login");
    btn.classList.add("loading");
    btn.disabled = true;

    // ── Dummy login (ganti dengan API call ke backend nanti) ──
    setTimeout(function () {
      btn.classList.remove("loading");
      btn.disabled = false;

      const dummyUsers = {
        santri: { 2024001: "santri123", 2024002: "santri456" },
        ortu: { "081234567890": "ortu123", 2024001: "ortu456" },
      };

      const users = dummyUsers[currentRole];

      if (users && users[id] === pw) {
        // Simpan session
        sessionStorage.setItem("tpq_role", currentRole);
        sessionStorage.setItem("tpq_id", id);

        showToast("success", "✅ Login berhasil! Mengalihkan...");

        setTimeout(function () {
          const dest =
            currentRole === "santri"
              ? "./dashboard-santri.html"
              : "./dashboard-ortu.html";
          window.location.href = dest;
        }, 1200);
      } else {
        showToast("error", "❌ ID atau password salah. Silakan coba lagi.");
        document.getElementById("input-id").style.borderColor = "#ef4444";
        document.getElementById("input-pw").style.borderColor = "#ef4444";
      }
    }, 1500);
  }

  window.handleLogin = handleLogin;

  /* ══════════════════════════════════════
     FORGOT PASSWORD INFO
  ══════════════════════════════════════ */
  function showForgotInfo(e) {
    e.preventDefault();
    showToast("success", "💬 Hubungi ustadz/ustadzah untuk reset password.");
  }

  window.showForgotInfo = showForgotInfo;

  /* ══════════════════════════════════════
     TOAST NOTIFICATION
  ══════════════════════════════════════ */
  function showToast(type, msg) {
    const toast = document.getElementById("toast");
    document.getElementById("toast-msg").textContent = msg;
    toast.className = "toast " + type + " show";
    setTimeout(function () {
      toast.classList.remove("show");
    }, 3500);
  }

  /* ══════════════════════════════════════
     INIT — DOMContentLoaded
  ══════════════════════════════════════ */
  document.addEventListener("DOMContentLoaded", function () {
    // Isi otomatis jika remember me aktif
    const savedId = localStorage.getItem("tpq_remember_id");
    const savedRole = localStorage.getItem("tpq_remember_role");
    if (savedId) {
      document.getElementById("input-id").value = savedId;
      document.getElementById("remember").checked = true;
      if (savedRole) switchRole(savedRole);
    }

    // Simpan remember me saat form submit
    document
      .getElementById("login-form")
      .addEventListener("submit", function () {
        const remember = document.getElementById("remember").checked;
        const id = document.getElementById("input-id").value.trim();
        if (remember && id) {
          localStorage.setItem("tpq_remember_id", id);
          localStorage.setItem("tpq_remember_role", currentRole);
        } else {
          localStorage.removeItem("tpq_remember_id");
          localStorage.removeItem("tpq_remember_role");
        }
      });
  });
})();
