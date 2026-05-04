// ============================================
// KONEKSI SUPABASE - TPQ Akhlaqul Qurro
// ============================================

const SUPABASE_URL = "https://bsuozoqhrtkdehvjppdi.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzdW96b3FocnRrZGVodmpwcGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NzYzMDMsImV4cCI6MjA5MzI1MjMwM30.9AJshPyN4n3kED7aDaJGCkYLAx7txFaRiOSpyRm-ouk";

// ─── Inisialisasi Supabase ────────────────────────────────────────────────────
// Supabase dimuat dari file LOKAL: assets/js/supabase.min.js
// BUKAN dari CDN — supaya bisa jalan di localhost tanpa internet

window.supabaseClient = null;

function initSupabase() {
  if (typeof supabase !== "undefined") {
    window.supabaseClient = supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
    );
    console.log("✅ Supabase connected!");
    return true;
  }
  console.error("❌ Supabase library not loaded!");
  return false;
}

// Coba init sekarang, kalau belum siap tunggu DOMContentLoaded
if (!initSupabase()) {
  document.addEventListener("DOMContentLoaded", initSupabase);
}

// ─── State & DOM ─────────────────────────────────────────────────────────────

let currentRole = "santri";

const toast = document.getElementById("toast");
const toastMsg = document.getElementById("toast-msg");
const loginForm = document.getElementById("login-form");
const btnLogin = document.getElementById("btn-login");
const inputId = document.getElementById("input-id");
const inputPw = document.getElementById("input-pw");
const idLabel = document.getElementById("id-label");
const roleInfoText = document.getElementById("role-info-text");
const tabSantri = document.getElementById("tab-santri");
const tabOrtu = document.getElementById("tab-ortu");

// ─── Toast ───────────────────────────────────────────────────────────────────

function showToast(message, type = "error") {
  if (!toast || !toastMsg) return;
  toastMsg.innerText = message;
  toast.classList.remove("error", "success");
  toast.classList.add(type, "show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}
window.showToast = showToast;

// ─── Loading state ───────────────────────────────────────────────────────────

function setLoading(isLoading) {
  if (!btnLogin) return;
  btnLogin.classList.toggle("loading", isLoading);
  btnLogin.disabled = isLoading;
}

// ─── Switch role ─────────────────────────────────────────────────────────────

window.switchRole = function (role) {
  currentRole = role;

  if (role === "santri") {
    idLabel.innerText = "NIS (Nomor Induk Santri)";
    roleInfoText.innerHTML =
      "Masuk dengan <strong>NIS (Nomor Induk Santri)</strong> dan password yang diberikan oleh ustadz/ustadzah.";
    inputId.placeholder = "Contoh: A5001, A4001, Q1001, dll";
    tabSantri.classList.add("active");
    tabOrtu.classList.remove("active");
  } else {
    idLabel.innerText = "Kode Orang Tua";
    roleInfoText.innerHTML =
      "Masuk dengan <strong>Kode Orang Tua</strong> yang diberikan oleh ustadz/ustadzah.";
    inputId.placeholder = "Contoh: ORTU001";
    tabOrtu.classList.add("active");
    tabSantri.classList.remove("active");
  }

  inputId.value = "";
  inputPw.value = "";
};

// ─── Toggle password visibility ──────────────────────────────────────────────

window.togglePassword = function () {
  const type = inputPw.getAttribute("type");
  inputPw.setAttribute("type", type === "password" ? "text" : "password");
};

// ─── Lupa password ───────────────────────────────────────────────────────────

window.showForgotInfo = function (event) {
  event.preventDefault();
  showToast("Hubungi ustadz/ustadzah untuk reset password", "success");
};

// ─── Login Santri ─────────────────────────────────────────────────────────────

async function loginSantri(nis, password) {
  if (!window.supabaseClient) {
    return {
      success: false,
      message: "Koneksi database belum siap. Refresh halaman.",
    };
  }

  try {
    const { data, error } = await window.supabaseClient
      .from("santri")
      .select("id, nis, nama_lengkap, kelas, tingkat, status, password")
      .eq("nis", nis.toUpperCase()) // NIS diubah uppercase agar tidak case-sensitive
      .single();

    // Tidak ditemukan
    if (error && error.code === "PGRST116") {
      return { success: false, message: "NIS tidak ditemukan!" };
    }
    if (error) {
      console.error("DB error:", error);
      return {
        success: false,
        message: "Gagal menghubungi database. Coba lagi.",
      };
    }

    // Cek password (plaintext — sesuaikan jika pakai hash di masa depan)
    if (data.password !== password) {
      return { success: false, message: "Password salah!" };
    }

    if (data.status !== "aktif") {
      return { success: false, message: "Akun tidak aktif. Hubungi ustadz." };
    }

    // Hapus password sebelum disimpan ke localStorage
    const { password: _pw, ...safeData } = data;

    localStorage.setItem(
      "user",
      JSON.stringify({ ...safeData, role: "santri" }),
    );
    return { success: true, data: safeData };
  } catch (err) {
    console.error("loginSantri exception:", err);
    return { success: false, message: "Terjadi kesalahan. Coba lagi." };
  }
}

// ─── Login Orang Tua ─────────────────────────────────────────────────────────

async function loginOrtu(kodeOrtu, password) {
  if (!window.supabaseClient) {
    return {
      success: false,
      message: "Koneksi database belum siap. Refresh halaman.",
    };
  }

  try {
    const { data, error } = await window.supabaseClient
      .from("ortu")
      .select("id, kode_ortu, nama_ortu, no_wa, password")
      .eq("kode_ortu", kodeOrtu.toUpperCase())
      .single();

    if (error && error.code === "PGRST116") {
      return { success: false, message: "Kode Orang Tua tidak ditemukan!" };
    }
    if (error) {
      console.error("DB error:", error);
      return {
        success: false,
        message: "Gagal menghubungi database. Coba lagi.",
      };
    }

    if (data.password !== password) {
      return { success: false, message: "Password salah!" };
    }

    // Ambil daftar anak
    const { data: santriList, error: relasiError } = await window.supabaseClient
      .from("santri_ortu")
      .select(
        "santri_id, santri:santri_id (id, nis, nama_lengkap, kelas, tingkat)",
      )
      .eq("ortu_id", data.id);

    if (relasiError) console.error("Error get santri list:", relasiError);

    const { password: _pw, ...safeData } = data;

    localStorage.setItem(
      "user",
      JSON.stringify({
        ...safeData,
        role: "ortu",
        anak: santriList?.map((s) => s.santri) || [],
      }),
    );

    return { success: true, data: safeData };
  } catch (err) {
    console.error("loginOrtu exception:", err);
    return { success: false, message: "Terjadi kesalahan. Coba lagi." };
  }
}

// ─── Handle Login (dipanggil dari form onsubmit) ──────────────────────────────

window.handleLogin = async function (event) {
  event.preventDefault();

  // Pastikan Supabase sudah siap
  if (!window.supabaseClient) {
    // Coba init ulang sekali
    if (!initSupabase()) {
      showToast(
        "Koneksi database belum siap. Refresh halaman dan tunggu sebentar.",
      );
      return;
    }
  }

  const userId = inputId.value.trim();
  const password = inputPw.value.trim();

  if (!userId || !password) {
    showToast("Harap isi NIS/Kode dan password!");
    return;
  }

  setLoading(true);

  const result =
    currentRole === "santri"
      ? await loginSantri(userId, password)
      : await loginOrtu(userId, password);

  setLoading(false);

  if (result.success) {
    const nama =
      result.data.nama_lengkap || result.data.nama_ortu || "pengguna";
    showToast(`✅ Login berhasil! Selamat datang, ${nama}`, "success");

    setTimeout(() => {
      window.location.href =
        currentRole === "santri"
          ? "./santri/dashboard.html"
          : "./ortu/dashboard.html";
    }, 1000);
  } else {
    showToast(result.message);
  }
};

// ─── Remember Me ─────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function () {
  const rememberCheckbox = document.getElementById("remember");
  if (!rememberCheckbox || !loginForm) return;

  const savedId = localStorage.getItem("savedId");
  const savedRole = localStorage.getItem("savedRole");

  if (savedId && savedRole) {
    inputId.value = savedId;
    if (savedRole === "ortu") window.switchRole("ortu");
    rememberCheckbox.checked = true;
  }

  loginForm.addEventListener("submit", function () {
    if (rememberCheckbox.checked) {
      localStorage.setItem("savedId", inputId.value.trim());
      localStorage.setItem("savedRole", currentRole);
    } else {
      localStorage.removeItem("savedId");
      localStorage.removeItem("savedRole");
    }
  });
});

console.log("✅ santri.js loaded — Supabase dari file lokal.");
