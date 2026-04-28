/* ════════════════════════════════════════
   TPQ AKHLAQUL QURRO' — pages.js
   Logic SHARED untuk semua halaman statis

   ATURAN:
   - Hanya logic yang dipakai 2+ halaman
   - Logic khusus 1 halaman → tulis inline
     di <script> dalam file HTML itu sendiri
   - Jangan duplikasi logic dari main.js

   SECTIONS:
   1. SHARED    — navbar shadow, mobile menu,
                  mobile accordion, counter
   2. JADWAL    — showJadwal(), render tabel
   3. TATATERTIB— showKategori(), renderCatatan()
   4. TENTANG   — render materi pengajar
   ════════════════════════════════════════ */

(function () {
  "use strict";

  /* ════════════════════════════════════════
     1. SHARED
     ════════════════════════════════════════ */

  /* ── Navbar shadow on scroll ── */
  function initNavbar() {
    var navbar = document.getElementById("navbar");
    if (!navbar) return;
    window.addEventListener("scroll", function () {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
    });
  }

  /* ── Mobile hamburger ── */
  function initMobileMenu() {
    var menuBtn = document.getElementById("menu-btn");
    var mobileMenu = document.getElementById("mobile-menu");
    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });

    window.closeMobile = function () {
      mobileMenu.classList.add("hidden");
    };
  }

  /* ── Mobile accordion (Tentang Kami) ── */
  function initMobileAccordion() {
    var btn = document.getElementById("acc-btn");
    var content = document.getElementById("acc-content");
    if (!btn || !content) return;
    btn.addEventListener("click", function () {
      btn.classList.toggle("open");
      content.classList.toggle("open");
    });
  }

  /* ── Counter animasi (IntersectionObserver) ──
     Jalan di semua halaman yang punya .counter
     data-counted mencegah duplikasi           ── */
  function initCounters() {
    document.querySelectorAll(".counter").forEach(function (el) {
      if (el.dataset.counted) return;
      el.dataset.counted = "true";

      new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var target = +el.dataset.target || 0;
            var step = target / (1500 / 16);
            var cur = 0;
            var timer = setInterval(function () {
              cur += step;
              if (cur >= target) {
                el.textContent = target + "+";
                clearInterval(timer);
              } else {
                el.textContent = Math.floor(cur);
              }
            }, 16);
            observer.unobserve(el);
          });
        },
        { threshold: 0.5 },
      ).observe(el);
    });
  }

  /* ════════════════════════════════════════
     2. JADWAL
     Requires: assets/data/jadwal.js
     di-load SEBELUM pages.js
     Halaman: pages/jadwal.html
     ════════════════════════════════════════ */

  var jamMap = {
    "A Seluruhnya": { label: "Kelas A", jam: "13:30 – 15:30" },
    "B Seluruhnya": { label: "Kelas B", jam: "16:45 – 17:45" },
    "Qur'an 1 & 2": { label: "Qur'an 1 & 2", jam: "15:40 – 16:40" },
    "Tahfidz 1": { label: "Tahfidz 1", jam: "17:50 – 20:00" },
    "Tahfidz 2": { label: "Tahfidz 2", jam: "17:50 – 20:00" },
  };

  var hariList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  /* showJadwal dipanggil oleh onclick di HTML */
  window.showJadwal = function (kelas) {
    /* Update tab di hero */
    document.querySelectorAll(".kelas-tab").forEach(function (t) {
      t.classList.toggle("active", t.dataset.kelas === kelas);
    });
    /* Update jam-card */
    document.querySelectorAll(".jam-card").forEach(function (c) {
      c.classList.toggle("active", c.dataset.kelas === kelas);
    });
    /* Update header */
    var info = jamMap[kelas] || {};
    var title = document.getElementById("jadwal-title");
    var jam = document.getElementById("jadwal-jam");
    if (title) title.textContent = "Jadwal " + (info.label || kelas);
    if (jam) jam.textContent = info.jam || "";

    /* Render tabel */
    var data = JADWAL_DATA.semesterGenap[kelas];
    var tbody = document.getElementById("jadwal-tbody");
    if (!tbody) return;

    if (!data) {
      tbody.innerHTML =
        '<tr><td colspan="2" style="text-align:center;padding:32px;color:#9ca3af">Data tidak tersedia</td></tr>';
      return;
    }

    tbody.innerHTML = hariList
      .map(function (hari) {
        var materi = data[hari];
        if (!materi || materi.length === 0) return "";
        var items = materi
          .map(function (m) {
            return (
              '<div class="materi-item"><span class="materi-dot"></span><span>' +
              m +
              "</span></div>"
            );
          })
          .join("");
        return (
          '<tr><td class="td-hari">' +
          hari +
          '</td><td><div class="materi-list">' +
          items +
          "</div></td></tr>"
        );
      })
      .join("");
  };

  function initJadwal() {
    if (typeof JADWAL_DATA === "undefined") return;

    /* Rutinitas penutup */
    var rBody = document.getElementById("rutinitas-tbody");
    if (rBody && JADWAL_DATA.rutinitas) {
      rBody.innerHTML = JADWAL_DATA.rutinitas
        .map(function (r) {
          return (
            '<tr><td class="td-hari">' +
            r.hari +
            '</td><td class="td-kegiatan">' +
            r.kegiatan +
            "</td></tr>"
          );
        })
        .join("");
    }

    /* Daftar materi & pengajar */
    var mBody = document.getElementById("materi-tbody");
    if (mBody && JADWAL_DATA.materi) {
      mBody.innerHTML = JADWAL_DATA.materi
        .map(function (item) {
          return (
            "<tr>" +
            '<td class="td-no">' +
            item.no +
            "</td>" +
            '<td class="td-mapel">' +
            item.mapel +
            "</td>" +
            '<td class="td-pengajar">' +
            item.pengajar +
            "</td>" +
            "</tr>"
          );
        })
        .join("");
    }

    /* Default kelas pertama */
    window.showJadwal("A Seluruhnya");
  }

  /* ════════════════════════════════════════
     3. TATATERTIB
     Requires: assets/data/tatatertib.js
     di-load SEBELUM pages.js
     Halaman: pages/tatatertib.html
     ════════════════════════════════════════ */

  var katMeta = {
    kedisiplinan: {
      title: "⏰ Kedisiplinan",
      desc: "Pelanggaran terkait kehadiran dan ketepatan waktu",
    },
    pakaian: {
      title: "👗 Pakaian & Penampilan",
      desc: "Pelanggaran terkait aturan berpakaian Islami",
    },
    perilaku: {
      title: "🤝 Perilaku & Etika",
      desc: "Pelanggaran terkait akhlak dan etika pergaulan",
    },
    pembelajaran: {
      title: "📚 Pembelajaran",
      desc: "Pelanggaran terkait proses belajar mengajar",
    },
    etikaMedsos: {
      title: "📱 Medsos & Digital",
      desc: "Pelanggaran terkait penggunaan media sosial dan gadget",
    },
    barangTerlarang: {
      title: "🚫 Barang Terlarang",
      desc: "Pelanggaran terkait barang yang tidak boleh dibawa",
    },
  };

  function poinClass(p) {
    if (p >= 70) return "poin-max";
    if (p >= 20) return "poin-high";
    if (p >= 10) return "poin-mid";
    return "poin-low";
  }

  /* showKategori dipanggil oleh onclick di HTML */
  window.showKategori = function (cat) {
    document.querySelectorAll(".cat-tab").forEach(function (t) {
      t.classList.toggle("active", t.dataset.cat === cat);
    });

    var meta = katMeta[cat] || {};
    var catTitle = document.getElementById("cat-title");
    var catDesc = document.getElementById("cat-desc");
    var catCount = document.getElementById("cat-count");
    if (catTitle) catTitle.textContent = meta.title || cat;
    if (catDesc) catDesc.textContent = meta.desc || "";

    var data = TATATERTIB_DATA[cat];
    var tbody = document.getElementById("tt-tbody");
    if (!tbody) return;

    if (!data || data.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="3" style="text-align:center;padding:32px;color:#9ca3af">Data tidak tersedia</td></tr>';
      if (catCount) catCount.textContent = "0 pelanggaran";
      return;
    }

    if (catCount) catCount.textContent = data.length + " pelanggaran";

    tbody.innerHTML = data
      .map(function (item) {
        return (
          "<tr>" +
          '<td class="td-no">' +
          item.no +
          "</td>" +
          '<td class="td-pel">' +
          item.pelanggaran +
          "</td>" +
          '<td class="td-poin" style="text-align:center">' +
          '<span class="poin-badge ' +
          poinClass(item.poin) +
          '">' +
          item.poin +
          " poin</span>" +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
  };

  function initTatatertib() {
    if (typeof TATATERTIB_DATA === "undefined") return;

    /* Render catatan penting */
    var el = document.getElementById("catatan-list");
    if (el && TATATERTIB_DATA.catatan) {
      el.innerHTML = TATATERTIB_DATA.catatan
        .map(function (c) {
          return (
            '<div class="catatan-item"><span class="catatan-dot">•</span><span>' +
            c +
            "</span></div>"
          );
        })
        .join("");
    }

    /* Default kategori pertama */
    window.showKategori("kedisiplinan");
  }

  /* ════════════════════════════════════════
     4. TENTANG
     Requires: assets/data/jadwal.js
     Halaman: pages/tentang.html
     ════════════════════════════════════════ */

  function initTentang() {
    if (typeof JADWAL_DATA === "undefined") return;

    /* Render tabel materi pengajar */
    var tbody = document.getElementById("materi-tbody");
    if (tbody && JADWAL_DATA.materi) {
      tbody.innerHTML = JADWAL_DATA.materi
        .map(function (item) {
          return (
            "<tr>" +
            '<td class="td-no">' +
            item.no +
            "</td>" +
            '<td class="td-mapel">' +
            item.mapel +
            "</td>" +
            '<td class="td-pengajar">' +
            item.pengajar +
            "</td>" +
            "</tr>"
          );
        })
        .join("");
    }
  }

  /* ════════════════════════════════════════
     INIT — deteksi halaman lalu jalankan
     logic yang sesuai
     ════════════════════════════════════════ */
  document.addEventListener("DOMContentLoaded", function () {
    /* Shared — jalan di semua halaman */
    initNavbar();
    initMobileMenu();
    initMobileAccordion();
    initCounters();

    /* Deteksi halaman dari URL */
    var path = window.location.pathname;

    if (path.includes("jadwal")) initJadwal();
    if (path.includes("tatatertib")) initTatatertib();
    if (path.includes("tentang")) initTentang();

    /* Restore lang dari localStorage */
    var savedLang = localStorage.getItem("lang") || "id";
    if (typeof setLang === "function") setLang(savedLang);
  });
})();
