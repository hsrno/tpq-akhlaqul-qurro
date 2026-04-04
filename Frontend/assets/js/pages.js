/* ════════════════════════════════════════
   TPQ AKHLAQUL QURRO' — pages.js
   Logic untuk semua halaman statis

   SECTIONS:
   1. SHARED     — navbar, mobile menu, counter, lang
   2. JADWAL     — showJadwal(), rutinitas, materi
   3. TENTANG    — (counter sudah di SHARED)
   4. PROGRAM    — placeholder
   5. GALLERY    — placeholder
   6. TATATERTIB — placeholder
   ════════════════════════════════════════ */

(function () {
  "use strict";

  /* ════════════════════════════════════════
     1. SHARED — jalan di semua halaman
     ════════════════════════════════════════ */

  /* ── Navbar scroll shadow ── */
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

  /* ── Mobile accordion navbar (Tentang Kami) ── */
  function initMobileAccordion() {
    var btn = document.getElementById("acc-btn");
    var content = document.getElementById("acc-content");
    if (!btn || !content) return;

    btn.addEventListener("click", function () {
      btn.classList.toggle("open");
      content.classList.toggle("open");
    });
  }

  /* ── Counter animasi — IntersectionObserver ──
     Jalan otomatis di semua halaman yang punya .counter
     (index, tentang, dll). Animasi mulai saat elemen
     masuk viewport, tidak duplikat berkat data-counted.  ── */
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

  /* ── Quick tabs di page-hero (scroll ke section) ── */
  function initQuickTabs() {
    document
      .querySelectorAll(".quick-tab[data-target]")
      .forEach(function (tab) {
        tab.addEventListener("click", function () {
          var target = document.getElementById(this.dataset.target);
          if (target)
            target.scrollIntoView({ behavior: "smooth", block: "start" });

          var group = this.dataset.group || "default";
          document
            .querySelectorAll('.quick-tab[data-group="' + group + '"]')
            .forEach(function (t) {
              t.classList.remove("active");
            });
          this.classList.add("active");
        });
      });
  }

  /* ── Language toggle ── */
  window.setLang = function (lang) {
    if (typeof translations !== "undefined") {
      document.querySelectorAll("[data-i18n]").forEach(function (el) {
        var key = el.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key] !== undefined) {
          el.innerHTML = translations[lang][key];
        }
      });
    }

    var map = {
      "btn-id": "lang-btn " + (lang === "id" ? "active-id" : "inactive-id"),
      "btn-en": "lang-btn " + (lang === "en" ? "active-en" : "inactive-en"),
      "btn-id-m": "lang-btn " + (lang === "id" ? "active-id" : "inactive-id"),
      "btn-en-m": "lang-btn " + (lang === "en" ? "active-en" : "inactive-en"),
    };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.className = map[id];
    });

    localStorage.setItem("lang", lang);
  };

  /* ════════════════════════════════════════
     2. JADWAL
     Requires: assets/data/jadwal.js di-load
     sebelum pages.js di jadwal.html
     ════════════════════════════════════════ */

  /* ── Data jam per kelas ── */
  var jamMap = {
    "A Seluruhnya": { label: "Kelas A", jam: "13:30 – 15:30" },
    "B Seluruhnya": { label: "Kelas B", jam: "16:45 – 17:45" },
    "Qur'an 1 & 2": { label: "Qur'an 1 & 2", jam: "15:40 – 16:40" },
    "Tahfidz 1": { label: "Tahfidz 1", jam: "17:50 – 20:00" },
    "Tahfidz 2": { label: "Tahfidz 2", jam: "17:50 – 20:00" },
  };

  var hariList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  /* ── showJadwal — dipanggil oleh onclick tab di HTML ── */
  window.showJadwal = function (kelas) {
    /* Update kelas-tab aktif */
    document.querySelectorAll(".kelas-tab").forEach(function (t) {
      t.classList.toggle("active", t.dataset.kelas === kelas);
    });

    /* Update jam-card aktif */
    document.querySelectorAll(".jam-card").forEach(function (c) {
      c.classList.toggle("active", c.dataset.kelas === kelas);
    });

    /* Update header info */
    var info = jamMap[kelas] || {};
    var title = document.getElementById("jadwal-title");
    var jam = document.getElementById("jadwal-jam");
    if (title) title.textContent = "Jadwal " + (info.label || kelas);
    if (jam) jam.textContent = info.jam || "";

    /* Render tabel jadwal */
    var data = JADWAL_DATA.semesterGenap[kelas];
    var tbody = document.getElementById("jadwal-tbody");
    if (!tbody) return;

    if (!data) {
      tbody.innerHTML =
        '<tr><td colspan="2" style="text-align:center;padding:32px;color:#9ca3af">' +
        "Data tidak tersedia</td></tr>";
      return;
    }

    tbody.innerHTML = hariList
      .map(function (hari) {
        var materi = data[hari];
        if (!materi || materi.length === 0) return "";

        var items = materi
          .map(function (m) {
            return (
              '<div class="materi-item">' +
              '<span class="materi-dot"></span>' +
              "<span>" +
              m +
              "</span>" +
              "</div>"
            );
          })
          .join("");

        return (
          "<tr>" +
          '<td class="td-hari">' +
          hari +
          "</td>" +
          '<td><div class="materi-list">' +
          items +
          "</div></td>" +
          "</tr>"
        );
      })
      .join("");
  };

  /* ── Init jadwal — render rutinitas + materi + jadwal awal ── */
  function initJadwal() {
    if (typeof JADWAL_DATA === "undefined") {
      console.error(
        "JADWAL_DATA tidak ditemukan! Pastikan jadwal.js di-load sebelum pages.js",
      );
      return;
    }

    /* Rutinitas penutup */
    var rBody = document.getElementById("rutinitas-tbody");
    if (rBody && JADWAL_DATA.rutinitas) {
      rBody.innerHTML = JADWAL_DATA.rutinitas
        .map(function (r) {
          return (
            "<tr>" +
            '<td class="td-hari">' +
            r.hari +
            "</td>" +
            '<td class="td-kegiatan">' +
            r.kegiatan +
            "</td>" +
            "</tr>"
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

    /* Tampilkan kelas pertama secara default */
    window.showJadwal("A Seluruhnya");
  }

  /* ════════════════════════════════════════
     3. TENTANG
     Counter → sudah ditangani initCounters()
     FAQ     → sudah native <details>, tidak
               perlu JS tambahan
     ════════════════════════════════════════ */

  /* ════════════════════════════════════════
     4. PROGRAM — placeholder
     ════════════════════════════════════════ */
  function initProgram() {
    // TODO: tab filter program (Iqra, Quran, Akhlak)
  }

  /* ════════════════════════════════════════
     5. GALLERY — placeholder
     ════════════════════════════════════════ */
  function initGallery() {
    // TODO: filter kategori & lightbox
  }

  /* ════════════════════════════════════════
     6. TATATERTIB — placeholder
     ════════════════════════════════════════ */
  function initTatatertib() {
    // TODO: jika ada interaksi
  }

  /* ════════════════════════════════════════
     INIT — satu DOMContentLoaded
     ════════════════════════════════════════ */
  document.addEventListener("DOMContentLoaded", function () {
    /* Shared — jalan di semua halaman */
    initNavbar();
    initMobileMenu();
    initMobileAccordion();
    initCounters();
    initQuickTabs();

    /* Restore bahasa */
    var savedLang = localStorage.getItem("lang") || "id";
    window.setLang(savedLang);

    /* Per halaman — deteksi dari URL */
    var path = window.location.pathname;
    if (path.includes("jadwal")) initJadwal();
    if (path.includes("program")) initProgram();
    if (path.includes("gallery")) initGallery();
    if (path.includes("tatatertib")) initTatatertib();
    /* tentang.html tidak perlu blok khusus —
       counter & FAQ sudah ditangani di atas  */
  });
})();
