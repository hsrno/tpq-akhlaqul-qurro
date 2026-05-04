/* ════════════════════════════════════════
   TPQ AKHLAQUL QURRO' — pages.js
   Logic SHARED untuk semua halaman statis

   ATURAN:
   - Hanya logic yang dipakai 2+ halaman
   - Logic khusus 1 halaman → tulis inline
     di <script> dalam file HTML itu sendiri
   - Jangan duplikasi logic dari main.js

   SECTIONS:
   1. SHARED      — navbar shadow, mobile menu,
                    mobile accordion, counter
   2. JADWAL      — showJadwal(), render tabel
   3. TATATERTIB  — showKategori(), renderCatatan()
   4. TENTANG     — render materi pengajar
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

    /* Toggle buka / tutup */
    menuBtn.addEventListener("click", function () {
      mobileMenu.classList.toggle("open");
      menuBtn.classList.toggle("menu-open");
    });

    /* Dipanggil oleh onclick="closeMobile()" di link mobile */
    window.closeMobile = function () {
      mobileMenu.classList.remove("open");
      menuBtn.classList.remove("menu-open");
    };

    /* Auto-hide + smooth close saat layar melebar ke desktop */
    var mq = window.matchMedia("(min-width: 768px)");

    mq.addEventListener("change", function (e) {
      if (!e.matches) return;
      mobileMenu.classList.remove("open");
      menuBtn.classList.remove("menu-open");
      /* Tutup accordion sekalian */
      var accBtn = document.getElementById("acc-btn");
      var accContent = document.getElementById("acc-content");
      if (accBtn) accBtn.classList.remove("open");
      if (accContent) accContent.classList.remove("open");
    });

    /* Auto-detect halaman aktif di link mobile */
    var path = window.location.pathname;

    document.querySelectorAll("#mobile-menu a").forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href) return;

      var isActive = false;

      if (href.includes("index")) {
        isActive = path === "/" || path.endsWith("index.html");
      } else {
        var pageName = href.replace(/.*\//, "").replace(".html", "");
        isActive = pageName !== "" && path.includes(pageName);
      }

      if (isActive) link.classList.add("mobile-active");
    });
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
     Berjalan di semua halaman yang punya .counter
     data-counted mencegah duplikasi trigger      ── */
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
     Requires : assets/data/jadwal.js
                (di-load SEBELUM pages.js)
     Halaman  : pages/jadwal.html
     ════════════════════════════════════════ */

  var jamMap = {
    "A Seluruhnya": { label: "Kelas A", jam: "13:30 – 15:30" },
    "B Seluruhnya": { label: "Kelas B", jam: "16:45 – 17:45" },
    "Qur'an 1 & 2": { label: "Qur'an 1 & 2", jam: "15:40 – 16:40" },
    "Tahfidz 1": { label: "Tahfidz 1", jam: "17:50 – 20:00" },
    "Tahfidz 2": { label: "Tahfidz 2", jam: "17:50 – 20:00" },
  };

  var hariList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  /* Dipanggil oleh onclick di HTML */
  window.showJadwal = function (kelas) {
    /* Update tab aktif di hero */
    document.querySelectorAll(".kelas-tab").forEach(function (t) {
      t.classList.toggle("active", t.dataset.kelas === kelas);
    });

    /* Update jam-card aktif */
    document.querySelectorAll(".jam-card").forEach(function (c) {
      c.classList.toggle("active", c.dataset.kelas === kelas);
    });

    /* Update judul & jam di header tabel */
    var info = jamMap[kelas] || {};
    var title = document.getElementById("jadwal-title");
    var jam = document.getElementById("jadwal-jam");
    if (title) title.textContent = "Jadwal " + (info.label || kelas);
    if (jam) jam.textContent = info.jam || "";

    /* Render baris tabel jadwal */
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

  function initJadwal() {
    if (typeof JADWAL_DATA === "undefined") return;

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
     3. TATATERTIB
     Requires : assets/data/tatatertib.js
                (di-load SEBELUM pages.js)
     Halaman  : pages/tatatertib.html
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

  /* Dipanggil oleh onclick di HTML */
  window.showKategori = function (cat) {
    /* Update tab aktif */
    document.querySelectorAll(".cat-tab").forEach(function (t) {
      t.classList.toggle("active", t.dataset.cat === cat);
    });

    /* Update judul & deskripsi */
    var meta = katMeta[cat] || {};
    var catTitle = document.getElementById("cat-title");
    var catDesc = document.getElementById("cat-desc");
    var catCount = document.getElementById("cat-count");
    if (catTitle) catTitle.textContent = meta.title || cat;
    if (catDesc) catDesc.textContent = meta.desc || "";

    /* Render tabel pelanggaran */
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
          " poin" +
          "</span>" +
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
            '<div class="catatan-item">' +
            '<span class="catatan-dot">•</span>' +
            "<span>" +
            c +
            "</span>" +
            "</div>"
          );
        })
        .join("");
    }

    /* Tampilkan kategori pertama secara default */
    window.showKategori("kedisiplinan");
  }

  /* ════════════════════════════════════════
     4. INIT
     ════════════════════════════════════════ */

  document.addEventListener("DOMContentLoaded", function () {
    initNavbar();
    initMobileMenu();
    initMobileAccordion();
    initCounters();

    var path = window.location.pathname;
    if (path.includes("jadwal")) initJadwal();
    if (path.includes("tatatertib")) initTatatertib();
    if (path.includes("tentang")) initTentang();
  });
})();

// =====================
// Daftar
// =====================

/* ── Step Navigation ── */
      var currentStep = 1;

      function showStep(n) {
        for (var i = 1; i <= 4; i++) {
          var el = document.getElementById('step-' + i);
          if (el) el.classList.add('hidden');
        }
        var target = document.getElementById('step-' + n);
        if (target) target.classList.remove('hidden');

        // Update step indicators
        for (var j = 1; j <= 3; j++) {
          var ind = document.getElementById('step-ind-' + j);
          if (!ind) continue;
          ind.classList.remove('active', 'done');
          if (j < n) ind.classList.add('done');
          else if (j === n) ind.classList.add('active');
        }

        // Update step lines
        var lines = document.querySelectorAll('.step-line');
        lines.forEach(function(line, idx) {
          line.classList.toggle('done', idx < n - 1);
        });

        currentStep = n;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      function nextStep(n) {
        if (n === 2 && !validateStep1()) return;
        if (n === 3 && !validateStep2()) return;
        if (n === 3) buildPreview();
        showStep(n);
      }

      function prevStep(n) {
        showStep(n);
      }

      /* ── Validasi ── */
      function validateStep1() {
        var nama  = document.getElementById('inp-nama').value.trim();
        var umur  = document.getElementById('inp-umur').value.trim();
        var jk    = document.getElementById('inp-jk').value;
        var kelas = document.getElementById('inp-kelas').value;
        var err   = document.getElementById('error-1');

        if (!nama || !umur || !jk || !kelas) {
          err.classList.remove('hidden');
          return false;
        }
        err.classList.add('hidden');
        return true;
      }

      function validateStep2() {
        var ortu = document.getElementById('inp-ortu').value.trim();
        var wa   = document.getElementById('inp-wa').value.trim();
        var err  = document.getElementById('error-2');

        if (!ortu || !wa) {
          err.classList.remove('hidden');
          return false;
        }
        var noWa = wa.replace(/\D/g, '');
        if (noWa.length < 8) {
          err.textContent = '⚠️ Nomor WhatsApp tidak valid, minimal 8 digit.';
          err.classList.remove('hidden');
          return false;
        }
        err.classList.add('hidden');
        return true;
      }

      /* ── Build Preview ── */
      function buildPreview() {
        var set = function(id, val) {
          var el = document.getElementById(id);
          if (el) el.textContent = val || '—';
        };
        set('prev-nama',       document.getElementById('inp-nama').value.trim());
        set('prev-umur',       document.getElementById('inp-umur').value + ' tahun');
        set('prev-jk',         document.getElementById('inp-jk').value);
        set('prev-kelas',      document.getElementById('inp-kelas').value);
        set('prev-pengalaman', document.getElementById('inp-pengalaman').value);
        set('prev-sekolah',    document.getElementById('inp-sekolah').value.trim() || 'Tidak diisi');
        set('prev-ortu',       document.getElementById('inp-ortu').value.trim());
        set('prev-wa',         '+62' + document.getElementById('inp-wa').value.trim().replace(/\D/g,'').replace(/^0/,''));
        set('prev-alamat',     document.getElementById('inp-alamat').value.trim() || 'Tidak diisi');
        set('prev-catatan',    document.getElementById('inp-catatan').value.trim() || 'Tidak ada');
      }

      /* ── Kirim WhatsApp ── */
      function kirimWhatsApp() {
        var nama       = document.getElementById('inp-nama').value.trim();
        var umur       = document.getElementById('inp-umur').value.trim();
        var jk         = document.getElementById('inp-jk').value;
        var kelas      = document.getElementById('inp-kelas').value;
        var pengalaman = document.getElementById('inp-pengalaman').value;
        var sekolah    = document.getElementById('inp-sekolah').value.trim();
        var ortu       = document.getElementById('inp-ortu').value.trim();
        var wa         = document.getElementById('inp-wa').value.trim().replace(/\D/g,'').replace(/^0/,'');
        var alamat     = document.getElementById('inp-alamat').value.trim();
        var catatan    = document.getElementById('inp-catatan').value.trim();

        var pesan =
'*PENDAFTARAN SANTRI BARU*\n' +
'TPQ Akhlaqul Qurro\n\n' +
'📋 *Data Santri*\n' +
'• Nama Santri     : ' + nama + '\n' +
'• Umur            : ' + umur + ' tahun\n' +
'• Jenis Kelamin   : ' + jk + '\n' +
'• Kelas / Tingkat : ' + kelas + '\n' +
'• Pengalaman      : ' + pengalaman + '\n' +
(sekolah ? '• Asal Sekolah    : ' + sekolah + '\n' : '') +
'\n👨‍👩‍👧 *Data Orang Tua / Wali*\n' +
'• Nama            : ' + ortu + '\n' +
'• No. WhatsApp    : +62' + wa + '\n' +
(alamat ? '• Alamat          : ' + alamat + '\n' : '') +
(catatan ? '\n📝 *Catatan*\n' + catatan + '\n' : '') +
'\n_Dikirim melalui website TPQ Akhlaqul Qurro_';

        var url = 'https://wa.me/62895425173700?text=' + encodeURIComponent(pesan);

        // Tampilkan sukses
        showStep(4);

        // Buka WA setelah 800ms
        setTimeout(function() {
          window.open(url, '_blank');
        }, 800);
      }