/* ════════════════════════════════════════
   TPQ AKHLAQUL QURRO' — Dashboard Ortu JS
   Halaman: dashboard-ortu.html
   ════════════════════════════════════════ */

   
(function () {
  "use strict";

  /* ══════════════════════════════════════
     DUMMY DATA — Ganti dengan API backend
  ══════════════════════════════════════ */
  const ortuData = {
    nama: "Bapak Hasan",
    noHp: "081234567890",
    foto: "BH",

    // Data anak-anak (bisa lebih dari 1)
    anak: [
      {
        id: 1,
        nama: "Ahmad Fauzi",
        nis: "2024001",
        kelas: "Kelas B",
        avatar: "AF",
        ustadz: "Ust. Mahmud",
        iqraLevel: 4,
        iqraProgress: 65,
        juzSudah: 2,
        surahHafal: 8,
        statsHadir: 18,
        statsTotalPertemuan: 22,
        statsNilai: 87,
        statsRanking: 3,
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
        nilai: [
          { mapel: "Tajwid", nilai: 90, grade: "A", ket: "Sangat Baik" },
          { mapel: "Hafalan Surah", nilai: 85, grade: "B", ket: "Baik" },
          { mapel: "Akidah", nilai: 88, grade: "A", ket: "Sangat Baik" },
          { mapel: "Fiqih Ibadah", nilai: 82, grade: "B", ket: "Baik" },
          { mapel: "Akhlak", nilai: 92, grade: "A", ket: "Sangat Baik" },
        ],
        catatan: [
          {
            tanggal: "20 Mar 2026",
            isi: "Ahmad sudah menunjukkan peningkatan yang signifikan dalam bacaan tajwid. Terus semangat belajar!",
            ustadz: "Ust. Mahmud",
          },
          {
            tanggal: "15 Mar 2026",
            isi: "Hafalan surah Al-Mulk sudah lancar. Minggu depan lanjut ke surah Al-Qalam.",
            ustadz: "Ust. Mahmud",
          },
          {
            tanggal: "8 Mar 2026",
            isi: "Perlu lebih memperhatikan panjang pendek bacaan Mad. Mohon dilatih di rumah.",
            ustadz: "Ust. Mahmud",
          },
        ],
      },
      {
        id: 2,
        nama: "Siti Aisyah",
        nis: "2024015",
        kelas: "Kelas A",
        avatar: "SA",
        ustadz: "Ust. Fatimah",
        iqraLevel: 2,
        iqraProgress: 80,
        juzSudah: 0,
        surahHafal: 4,
        statsHadir: 20,
        statsTotalPertemuan: 22,
        statsNilai: 91,
        statsRanking: 1,
        absensi: [
          "H",
          "H",
          "H",
          "H",
          "H",
          "H",
          "H",
          "H",
          "H",
          "H",
          "H",
          "H",
          "H",
          "H",
          "H",
          "H",
          "H",
          "H",
          "H",
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
        nilai: [
          { mapel: "Tajwid", nilai: 95, grade: "A", ket: "Sangat Baik" },
          { mapel: "Hafalan Surah", nilai: 90, grade: "A", ket: "Sangat Baik" },
          { mapel: "Akidah", nilai: 88, grade: "A", ket: "Sangat Baik" },
          { mapel: "Fiqih Ibadah", nilai: 85, grade: "B", ket: "Baik" },
          { mapel: "Akhlak", nilai: 96, grade: "A", ket: "Sangat Baik" },
        ],
        catatan: [
          {
            tanggal: "21 Mar 2026",
            isi: "Siti sangat rajin dan disiplin. Hafalannya meningkat pesat. Orang tua perlu terus mendukung di rumah.",
            ustadz: "Ust. Fatimah",
          },
          {
            tanggal: "12 Mar 2026",
            isi: "Surah Al-Kafirun sudah hampir hafal. Tinggal kelancaran saja.",
            ustadz: "Ust. Fatimah",
          },
        ],
      },
    ],
  };

  /* ══════════════════════════════════════
     STATE
  ══════════════════════════════════════ */
  let activeAnakId = ortuData.anak[0].id;

  function getActiveAnak() {
    return ortuData.anak.find((a) => a.id === activeAnakId);
  }

  /* ══════════════════════════════════════
     SIDEBAR TOGGLE
  ══════════════════════════════════════ */
  function initSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    const hamburger = document.getElementById("hamburger");
    if (!sidebar || !hamburger) return;

    hamburger.addEventListener("click", function () {
      if (window.innerWidth < 768) {
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
     NAV SECTIONS
  ══════════════════════════════════════ */
  function initNav() {
    document
      .querySelectorAll(".nav-item[data-section]")
      .forEach(function (item) {
        item.addEventListener("click", function () {
          document
            .querySelectorAll(".nav-item")
            .forEach((n) => n.classList.remove("active"));
          this.classList.add("active");
          showSection(this.dataset.section);
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
    const el = document.getElementById("section-" + name);
    if (el) el.classList.remove("hidden");
  }

  /* ══════════════════════════════════════
     CHILD SELECTOR
  ══════════════════════════════════════ */
  function renderChildSelector() {
    const container = document.getElementById("child-selector");
    if (!container) return;

    container.innerHTML = ortuData.anak
      .map(function (anak) {
        const isActive = anak.id === activeAnakId;
        return (
          '<button class="child-card ' +
          (isActive ? "active" : "") +
          '" onclick="selectAnak(' +
          anak.id +
          ')">' +
          '<div class="child-avatar">' +
          anak.avatar +
          "</div>" +
          "<div>" +
          '<p class="text-sm font-semibold text-navy">' +
          anak.nama +
          "</p>" +
          '<p class="text-xs text-gray-500">' +
          anak.kelas +
          "</p>" +
          "</div>" +
          "</button>"
        );
      })
      .join("");
  }

  window.selectAnak = function (id) {
    activeAnakId = id;
    renderChildSelector();
    populateData();
    animateBars();
  };

  /* ══════════════════════════════════════
     POPULATE DATA
  ══════════════════════════════════════ */
  function populateData() {
    const d = getActiveAnak();
    if (!d) return;

    // Ortu info (sidebar)
    setText("ortu-nama", ortuData.nama);
    setText("ortu-hp", "HP: " + ortuData.noHp);
    setText("avatar-text", ortuData.foto);

    // Topbar
    setText("topbar-nama", ortuData.nama.split(" ").slice(-1)[0]);

    // Anak aktif info
    setText("anak-nama", d.nama);
    setText("anak-kelas", d.kelas);
    setText("anak-nis", "NIS: " + d.nis);
    setText("anak-ustadz", "Ustadz: " + d.ustadz);
    setText("banner-nama", d.nama);

    // Stats
    const pctHadir = Math.round((d.statsHadir / d.statsTotalPertemuan) * 100);
    setText("stat-hadir", d.statsHadir + " Hari");
    setText("stat-pct", pctHadir + "%");
    setText("stat-nilai", d.statsNilai);
    setText("stat-ranking", "#" + d.statsRanking);
    setText("stat-surah", d.surahHafal + " Surah");
    setText("pct-hadir", pctHadir + "%");

    // Progress
    setText("iqra-level-text", "Iqra' Jilid " + d.iqraLevel);
    setText("iqra-pct-text", d.iqraProgress + "%");
    setWidth("iqra-bar", d.iqraProgress + "%");

    const juzPct = Math.round((d.juzSudah / 30) * 100);
    setText("juz-text", d.juzSudah + " dari 30 juz");
    setWidth("juz-bar", juzPct + "%");
    setWidth("bar-hadir", pctHadir + "%");

    // Absensi
    renderAbsensi(d.absensi, "absensi-grid");
    renderAbsensi(d.absensi, "absensi-grid-full");

    // Absensi rekap
    const hadir = d.absensi.filter((s) => s === "H" || s === "T").length;
    const absen = d.absensi.filter((s) => s === "A").length;
    const izin = d.absensi.filter((s) => s === "I").length;
    setText("rekap-hadir", hadir);
    setText("rekap-absen", absen);
    setText("rekap-izin", izin);

    // Nilai
    renderNilai(d.nilai);

    // Catatan
    renderCatatan(d.catatan, "catatan-list");
    renderCatatan(d.catatan, "catatan-list-full");
    setText("nama-ustadz", d.ustadz);
  }

  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function setWidth(id, val) {
    const el = document.getElementById(id);
    if (el) el.style.width = val;
  }

  /* ── Absensi Grid ── */
  function renderAbsensi(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    let html = days
      .map(
        (d) =>
          '<div class="attend-day" style="background:transparent;color:#9ca3af;font-size:.65rem;font-weight:700;">' +
          d +
          "</div>",
      )
      .join("");
    const classMap = {
      H: "hadir",
      A: "absen",
      I: "izin",
      F: "future",
      T: "today",
    };
    const labelMap = { H: "✓", A: "✗", I: "I", F: "", T: "✓" };
    data.forEach(function (s) {
      html +=
        '<div class="attend-day ' +
        (classMap[s] || "future") +
        '">' +
        (labelMap[s] || "") +
        "</div>";
    });
    container.innerHTML = html;
  }

  /* ── Nilai ── */
  function renderNilai(data) {
    const tbody = document.getElementById("nilai-tbody");
    if (!tbody) return;
    tbody.innerHTML = data
      .map(function (item) {
        return (
          "<tr>" +
          '<td class="font-medium">' +
          item.mapel +
          "</td>" +
          "<td><strong>" +
          item.nilai +
          "</strong></td>" +
          '<td><span class="nilai-pill nilai-' +
          item.grade +
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

  /* ── Catatan ── */
  function renderCatatan(data, containerId) {
    const container = document.getElementById(containerId);
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
     KIRIM PESAN KE USTADZ
  ══════════════════════════════════════ */
  window.kirimPesan = function () {
    const input = document.getElementById("msg-input");
    if (!input) return;
    const msg = input.value.trim();
    if (!msg) return;

    const d = getActiveAnak();
    const waMsg = encodeURIComponent(
      "Assalamu'alaikum Ust. " +
        d.ustadz.replace("Ust. ", "") +
        ", saya orang tua dari " +
        d.nama +
        " (NIS: " +
        d.nis +
        ").\n\n" +
        msg,
    );
    window.open("https://wa.me/6281234567890?text=" + waMsg, "_blank");
    input.value = "";
  };

  /* ══════════════════════════════════════
     ANIMATE BARS
  ══════════════════════════════════════ */
  function animateBars() {
    document.querySelectorAll(".progress-fill").forEach(function (bar) {
      const target = bar.style.width;
      bar.style.width = "0%";
      setTimeout(function () {
        bar.style.width = target;
      }, 300);
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
     INIT
  ══════════════════════════════════════ */
  document.addEventListener("DOMContentLoaded", function () {
    renderChildSelector();
    populateData();
    initSidebar();
    initNav();
    setTimeout(animateBars, 400);
  });
})();
