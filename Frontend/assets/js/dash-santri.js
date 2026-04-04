/* ════════════════════════════════════════
   TPQ AKHLAQUL QURRO' — Dashboard Santri JS
   Halaman: dashboard-santri.html
   ════════════════════════════════════════ */

// Sync catatan ke section catatan penuh
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(function () {
    const src = document.getElementById("catatan-list");
    const dest = document.getElementById("catatan-list-full");
    const nama = document.getElementById("user-nama");
    const banner = document.getElementById("banner-nama");
    const pct2 = document.getElementById("pct-hadir-2");
    const pct1 = document.getElementById("pct-hadir");

    if (dest && src) dest.innerHTML = src.innerHTML;
    if (banner && nama) banner.textContent = "Halo, " + nama.textContent + "!";
    if (pct2 && pct1) pct2.textContent = pct1.textContent;

    // Clone absensi grid ke section absensi
    const grid1 = document.getElementById("absensi-grid");
    const grid2 = document.getElementById("absensi-grid-2");
    if (grid1 && grid2) grid2.innerHTML = grid1.innerHTML;

    // Set nama ustadz
    const u = document.getElementById("nama-ustadz");
    if (u) u.textContent = "Ust. Mahmud";
  }, 500);
});

(function () {
  "use strict";

  /* ══════════════════════════════════════
     DUMMY DATA SANTRI
     Nanti diganti dengan API call ke backend
  ══════════════════════════════════════ */
  const santriData = {
    nama: "Shiva Anggraini",
    nis: "2024001",
    kelas: "Kelas A.5",
    ustadz: "Kak Inang",
    foto: "AF",

    // Progress Iqra & Quran
    iqraLevel: 4,
    iqraTotal: 6,
    iqraProgress: 65, // % dalam jilid saat ini
    juzSudah: 2,
    juzTotal: 30,
    surahHafal: 8,

    // Statistik bulan ini
    statsHadir: 18,
    statsTotalPertemuan: 22,
    statsNilaiRata: 87,
    statsRanking: 3,

    // Absensi bulan ini (H=hadir, A=absen, I=izin, F=future, T=today)
    absensi: [
      "H",
      "H",
      "H",
      "A",
      "H",
      "H",
      "H",
      "H",
      "I",
      "H",
      "H",
      "H",
      "H",
      "H",
      "H",
      "H",
      "H",
      "H",
      "A",
      "H",
      "H",
      "H",
      "H",
      "T",
      "F",
      "F",
      "F",
      "F",
      "F",
      "F",
    ],

    // Nilai per mata pelajaran
    nilai: [
      { mapel: "Tajwid", nilai: 90, grade: "A", ket: "Sangat Baik" },
      { mapel: "Hafalan Surah", nilai: 85, grade: "B", ket: "Baik" },
      { mapel: "Akidah", nilai: 88, grade: "A", ket: "Sangat Baik" },
      { mapel: "Fiqih Ibadah", nilai: 82, grade: "B", ket: "Baik" },
      { mapel: "Akhlak", nilai: 92, grade: "A", ket: "Sangat Baik" },
    ],

    // Catatan ustadz
    catatan: [
      {
        tanggal: "20 Mar 2026",
        isi: "Ahmad sudah menunjukkan peningkatan yang signifikan dalam bacaan tajwid. Terus semangat belajar!",
        ustadz: "Kak Inang",
      },
      {
        tanggal: "15 Mar 2026",
        isi: "Hafalan surah Al-Mulk sudah lancar. Minggu depan lanjut ke surah Al-Qalam.",
        ustadz: "Kak Inang",
      },
      {
        tanggal: "8 Mar 2026",
        isi: "Perlu lebih memperhatikan panjang pendek bacaan Mad. Mohon dilatih di rumah.",
        ustadz: "Kak Inang",
      },
    ],
  };

  /* ══════════════════════════════════════
     SIDEBAR TOGGLE
  ══════════════════════════════════════ */
  function initSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    const hamburger = document.getElementById("hamburger");

    if (!sidebar || !hamburger) return;

    hamburger.addEventListener("click", function () {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        sidebar.classList.toggle("mobile-open");
        overlay.classList.toggle("show");
      } else {
        sidebar.classList.toggle("collapsed");
        document.getElementById("main-content").classList.toggle("expanded");
      }
    });

    if (overlay) {
      overlay.addEventListener("click", function () {
        sidebar.classList.remove("mobile-open");
        overlay.classList.remove("show");
      });
    }
  }

  /* ══════════════════════════════════════
     ACTIVE NAV ITEM
  ══════════════════════════════════════ */
  function initNav() {
    document
      .querySelectorAll(".nav-item[data-section]")
      .forEach(function (item) {
        item.addEventListener("click", function () {
          // Update active nav
          document
            .querySelectorAll(".nav-item")
            .forEach((n) => n.classList.remove("active"));
          this.classList.add("active");

          // Show section
          const section = this.dataset.section;
          showSection(section);

          // Close mobile sidebar
          if (window.innerWidth < 768) {
            document.getElementById("sidebar").classList.remove("mobile-open");
            document.getElementById("sidebar-overlay").classList.remove("show");
          }
        });
      });
  }

  function showSection(name) {
    document
      .querySelectorAll(".dash-section")
      .forEach((s) => s.classList.add("hidden"));
    const target = document.getElementById("section-" + name);
    if (target) target.classList.remove("hidden");
  }

  /* ══════════════════════════════════════
     POPULATE DATA
  ══════════════════════════════════════ */
  function populateData() {
    const d = santriData;

    // User info
    setText("user-nama", d.nama);
    setText("user-nis", "NIS: " + d.nis);
    setText("user-kelas", d.kelas);
    setText("avatar-text", d.foto);
    setText("topbar-nama", d.nama.split(" ")[0]);

    // Stats
    setText("stat-hadir", d.statsHadir + " Hari");
    setText("stat-nilai", d.statsNilaiRata);
    setText("stat-ranking", "#" + d.statsRanking);
    setText("stat-surah", d.surahHafal + " Surah");

    // Iqra progress
    setText("iqra-level", "Iqra' Jilid " + d.iqraLevel);
    setText("iqra-progress-text", d.iqraProgress + "% selesai");
    setWidth("iqra-bar", d.iqraProgress + "%");

    // Juz progress
    const juzPct = Math.round((d.juzSudah / d.juzTotal) * 100);
    setText("juz-progress-text", d.juzSudah + " dari " + d.juzTotal + " juz");
    setWidth("juz-bar", juzPct + "%");

    // Absensi
    renderAbsensi(d.absensi);

    // Nilai
    renderNilai(d.nilai);

    // Catatan
    renderCatatan(d.catatan);

    // Kehadiran persen
    const pctHadir = Math.round((d.statsHadir / d.statsTotalPertemuan) * 100);
    setText("pct-hadir", pctHadir + "%");
    setWidth("bar-hadir", pctHadir + "%");
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function setWidth(id, val) {
    const el = document.getElementById(id);
    if (el) el.style.width = val;
  }

  /* ── Render absensi grid ── */
  function renderAbsensi(data) {
    const container = document.getElementById("absensi-grid");
    if (!container) return;

    const labels = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    let html = "";

    // Header hari
    labels.forEach(function (l) {
      html +=
        '<div class="attend-day" style="background:transparent;color:#9ca3af;font-size:.65rem;font-weight:700;">' +
        l +
        "</div>";
    });

    // Data
    data.forEach(function (status, i) {
      const classes = {
        H: "hadir",
        A: "absen",
        I: "izin",
        F: "future",
        T: "today",
      };
      const labels = {
        H: "✓",
        A: "✗",
        I: "I",
        F: "",
        T: "✓",
      };
      html +=
        '<div class="attend-day ' +
        (classes[status] || "future") +
        '" title="' +
        getStatusLabel(status) +
        '">' +
        (labels[status] || "") +
        "</div>";
    });

    container.innerHTML = html;
  }

  function getStatusLabel(s) {
    return (
      { H: "Hadir", A: "Absen", I: "Izin", F: "Belum", T: "Hari ini" }[s] || ""
    );
  }

  /* ── Render nilai table ── */
  function renderNilai(data) {
    const tbody = document.getElementById("nilai-tbody");
    if (!tbody) return;

    tbody.innerHTML = data
      .map(function (item) {
        const gradeClass = "nilai-" + item.grade;
        return (
          "<tr>" +
          '<td class="font-medium">' +
          item.mapel +
          "</td>" +
          "<td><strong>" +
          item.nilai +
          "</strong></td>" +
          '<td><span class="nilai-pill ' +
          gradeClass +
          '">' +
          item.grade +
          "</span></td>" +
          '<td class="text-gray-500">' +
          item.ket +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  /* ── Render catatan ustadz ── */
  function renderCatatan(data) {
    const container = document.getElementById("catatan-list");
    if (!container) return;

    container.innerHTML = data
      .map(function (item) {
        return (
          '<div class="catatan-item">' +
          '<p class="catatan-date">' +
          item.tanggal +
          "</p>" +
          '<p class="catatan-text">' +
          item.isi +
          "</p>" +
          '<p class="catatan-ustadz">— ' +
          item.ustadz +
          "</p>" +
          "</div>"
        );
      })
      .join("");
  }

  /* ══════════════════════════════════════
     TAB SYSTEM
  ══════════════════════════════════════ */
  function initTabs() {
    document.querySelectorAll(".tab-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const group = this.dataset.tabGroup;
        const target = this.dataset.tab;

        // Update buttons
        document
          .querySelectorAll('.tab-btn[data-tab-group="' + group + '"]')
          .forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        // Update panels
        document
          .querySelectorAll('.tab-panel[data-tab-group="' + group + '"]')
          .forEach((p) => p.classList.remove("active"));
        const panel = document.querySelector(
          '.tab-panel[data-tab="' +
            target +
            '"][data-tab-group="' +
            group +
            '"]',
        );
        if (panel) panel.classList.add("active");
      });
    });
  }

  /* ══════════════════════════════════════
     LOGOUT
  ══════════════════════════════════════ */
  window.logout = function () {
    sessionStorage.removeItem("tpq_role");
    sessionStorage.removeItem("tpq_id");
    window.location.href = "./santri.html";
  };

  /* ══════════════════════════════════════
     AUTH CHECK
  ══════════════════════════════════════ */
  function checkAuth() {
    const role = sessionStorage.getItem("tpq_role");
    // Uncomment untuk production:
    // if (!role || role !== 'santri') window.location.href = './santri.html';
  }

  /* ══════════════════════════════════════
     ANIMATE PROGRESS BARS ON LOAD
  ══════════════════════════════════════ */
  function animateBars() {
    // Reset dulu ke 0, lalu animate
    document.querySelectorAll(".progress-fill").forEach(function (bar) {
      const target = bar.style.width;
      bar.style.width = "0%";
      setTimeout(function () {
        bar.style.width = target;
      }, 300);
    });
  }

  /* ══════════════════════════════════════
     INIT
  ══════════════════════════════════════ */
  document.addEventListener("DOMContentLoaded", function () {
    checkAuth();
    populateData();
    initSidebar();
    initNav();
    initTabs();
    setTimeout(animateBars, 400);
  });
})();
