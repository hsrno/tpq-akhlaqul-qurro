/* ════════════════════════════════════════
   TPQ AKHLAQUL QURRO' — pages.js
   ════════════════════════════════════════ */

(function () {
  "use strict";

  /* ─────────────────────────────────────
     1. NAVBAR — shadow on scroll
     ───────────────────────────────────── */
  function initNavbar() {
    var navbar = document.getElementById("navbar");
    if (!navbar) return;
    window.addEventListener("scroll", function () {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
    });
  }

  /* ─────────────────────────────────────
     2. MOBILE MENU
     Masalah lama: HTML pakai class="hidden" (Tailwind display:none)
     tapi JS toggle class "open". Hasilnya menu tidak pernah muncul
     karena "hidden" tidak pernah dihapus.
     Solusi: JS hapus "hidden" saat DOM siap, lalu pakai "open" saja.
     ───────────────────────────────────── */
  function initMobileMenu() {
    var menuBtn    = document.getElementById("menu-btn");
    var mobileMenu = document.getElementById("mobile-menu");
    if (!menuBtn || !mobileMenu) return;

    // Hapus class Tailwind "hidden" agar JS bisa kontrol sendiri
    mobileMenu.classList.remove("hidden");

    menuBtn.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("open");
      menuBtn.classList.toggle("menu-open", isOpen);
    });

    // Expose ke global (dipanggil onclick="closeMobile()" di link)
    window.closeMobile = function () {
      mobileMenu.classList.remove("open");
      menuBtn.classList.remove("menu-open");
    };

    // Tutup saat layar melebar ke desktop
    var mq = window.matchMedia("(min-width: 768px)");
    mq.addEventListener("change", function (e) {
      if (!e.matches) return;
      window.closeMobile();
      var accBtn     = document.getElementById("acc-btn");
      var accContent = document.getElementById("acc-content");
      if (accBtn)     accBtn.classList.remove("open");
      if (accContent) accContent.classList.remove("open");
    });

    // Highlight link aktif di mobile
    var path = window.location.pathname;
    document.querySelectorAll("#mobile-menu a").forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href) return;
      var pageName = href.replace(/.*\//, "").replace(".html", "").replace(/#.*/, "");
      var isIndex  = href.includes("index") && (path === "/" || path.endsWith("index.html"));
      var isActive = isIndex || (pageName !== "" && path.includes(pageName));
      if (isActive) link.classList.add("mobile-active");
    });
  }

  /* ─────────────────────────────────────
     3. MOBILE ACCORDION ("Tentang Kami")
     ───────────────────────────────────── */
  function initMobileAccordion() {
    var btn     = document.getElementById("acc-btn");
    var content = document.getElementById("acc-content");
    if (!btn || !content) return;
    btn.addEventListener("click", function () {
      btn.classList.toggle("open");
      content.classList.toggle("open");
    });
  }

  /* ─────────────────────────────────────
     4. COUNTER — animasi angka statistik
     ───────────────────────────────────── */
  function initCounters() {
    document.querySelectorAll(".counter").forEach(function (el) {
      if (el.dataset.counted) return; // cegah dobel trigger
      el.dataset.counted = "true";

      new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var target = +el.dataset.target || 0;
          var step   = target / (1500 / 16);
          var cur    = 0;
          var timer  = setInterval(function () {
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
      }, { threshold: 0.5 }).observe(el);
    });
  }

  /* ─────────────────────────────────────
     5. JADWAL
     Butuh: assets/data/jadwal.js di-load lebih dulu
     ───────────────────────────────────── */
  var jamMap = {
    "A Seluruhnya": { label: "Kelas A",      jam: "13:30 – 15:30" },
    "B Seluruhnya": { label: "Kelas B",      jam: "16:45 – 17:45" },
    "Qur'an 1 & 2": { label: "Qur'an 1 & 2",jam: "15:40 – 16:40" },
    "Tahfidz 1":    { label: "Tahfidz 1",    jam: "17:50 – 20:00" },
    "Tahfidz 2":    { label: "Tahfidz 2",    jam: "17:50 – 20:00" },
  };
  var hariList = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

  window.showJadwal = function (kelas) {
    document.querySelectorAll(".kelas-tab").forEach(function (t) {
      t.classList.toggle("active", t.dataset.kelas === kelas);
    });
    document.querySelectorAll(".jam-card").forEach(function (c) {
      c.classList.toggle("active", c.dataset.kelas === kelas);
    });

    var info  = jamMap[kelas] || {};
    var title = document.getElementById("jadwal-title");
    var jam   = document.getElementById("jadwal-jam");
    if (title) title.textContent = "Jadwal " + (info.label || kelas);
    if (jam)   jam.textContent   = info.jam || "";

    if (typeof JADWAL_DATA === "undefined") return;
    var data  = JADWAL_DATA.semesterGenap[kelas];
    var tbody = document.getElementById("jadwal-tbody");
    if (!tbody) return;

    if (!data) {
      tbody.innerHTML = '<tr><td colspan="2" style="text-align:center;padding:32px;color:#9ca3af">Data tidak tersedia</td></tr>';
      return;
    }

    tbody.innerHTML = hariList.map(function (hari) {
      var materi = data[hari];
      if (!materi || materi.length === 0) return "";
      var items = materi.map(function (m) {
        return '<div class="materi-item"><span class="materi-dot"></span><span>' + escHtml(m) + "</span></div>";
      }).join("");
      return "<tr><td class='td-hari'>" + hari + "</td><td><div class='materi-list'>" + items + "</div></td></tr>";
    }).join("");
  };

  function initJadwal() {
    if (typeof JADWAL_DATA === "undefined") return;

    var rBody = document.getElementById("rutinitas-tbody");
    if (rBody && JADWAL_DATA.rutinitas) {
      rBody.innerHTML = JADWAL_DATA.rutinitas.map(function (r) {
        return "<tr><td class='td-hari'>" + r.hari + "</td><td class='td-kegiatan'>" + escHtml(r.kegiatan) + "</td></tr>";
      }).join("");
    }

    var mBody = document.getElementById("materi-tbody");
    if (mBody && JADWAL_DATA.materi) {
      rBody = mBody; // reuse var name, sudah benar
      mBody.innerHTML = JADWAL_DATA.materi.map(function (item) {
        return "<tr>" +
          "<td class='td-no'>"      + item.no       + "</td>" +
          "<td class='td-mapel'>"   + escHtml(item.mapel)    + "</td>" +
          "<td class='td-pengajar'>"+ escHtml(item.pengajar) + "</td>" +
          "</tr>";
      }).join("");
    }

    window.showJadwal("A Seluruhnya");
  }

  /* ─────────────────────────────────────
     6. TATATERTIB
     Butuh: assets/data/tatatertib.js di-load lebih dulu
     ───────────────────────────────────── */
  var katMeta = {
    kedisiplinan:    { title: "⏰ Kedisiplinan",        desc: "Pelanggaran terkait kehadiran dan ketepatan waktu" },
    pakaian:         { title: "👗 Pakaian & Penampilan", desc: "Pelanggaran terkait aturan berpakaian Islami" },
    perilaku:        { title: "🤝 Perilaku & Etika",    desc: "Pelanggaran terkait akhlak dan etika pergaulan" },
    pembelajaran:    { title: "📚 Pembelajaran",         desc: "Pelanggaran terkait proses belajar mengajar" },
    etikaMedsos:     { title: "📱 Medsos & Digital",    desc: "Pelanggaran terkait penggunaan media sosial dan gadget" },
    barangTerlarang: { title: "🚫 Barang Terlarang",    desc: "Pelanggaran terkait barang yang tidak boleh dibawa" },
  };

  function poinClass(p) {
    if (p >= 70) return "poin-max";
    if (p >= 20) return "poin-high";
    if (p >= 10) return "poin-mid";
    return "poin-low";
  }

  window.showKategori = function (cat) {
    document.querySelectorAll(".cat-tab").forEach(function (t) {
      t.classList.toggle("active", t.dataset.cat === cat);
    });

    var meta     = katMeta[cat] || {};
    var catTitle = document.getElementById("cat-title");
    var catDesc  = document.getElementById("cat-desc");
    var catCount = document.getElementById("cat-count");
    if (catTitle) catTitle.textContent = meta.title || cat;
    if (catDesc)  catDesc.textContent  = meta.desc  || "";

    if (typeof TATATERTIB_DATA === "undefined") return;
    var data  = TATATERTIB_DATA[cat];
    var tbody = document.getElementById("tt-tbody");
    if (!tbody) return;

    if (!data || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:32px;color:#9ca3af">Data tidak tersedia</td></tr>';
      if (catCount) catCount.textContent = "0 pelanggaran";
      return;
    }

    if (catCount) catCount.textContent = data.length + " pelanggaran";
    tbody.innerHTML = data.map(function (item) {
      return "<tr>" +
        "<td class='td-no'>"  + item.no + "</td>" +
        "<td class='td-pel'>" + escHtml(item.pelanggaran) + "</td>" +
        "<td class='td-poin' style='text-align:center'>" +
          "<span class='poin-badge " + poinClass(item.poin) + "'>" + item.poin + " poin</span>" +
        "</td></tr>";
    }).join("");
  };

  function initTatatertib() {
    if (typeof TATATERTIB_DATA === "undefined") return;

    var el = document.getElementById("catatan-list");
    if (el && TATATERTIB_DATA.catatan) {
      el.innerHTML = TATATERTIB_DATA.catatan.map(function (c) {
        return '<div class="catatan-item"><span class="catatan-dot">•</span><span>' + escHtml(c) + "</span></div>";
      }).join("");
    }

    window.showKategori("kedisiplinan");
  }

  /* ─────────────────────────────────────
     7. TENTANG  ← PERBAIKAN UTAMA
     Sebelumnya: initTentang() dipanggil tapi TIDAK ADA
     → ReferenceError di console setiap buka halaman tentang.html
     Sekarang: fungsi ada, render tabel pengajar dari JADWAL_DATA
     ───────────────────────────────────── */
  function initTentang() {
    if (typeof JADWAL_DATA === "undefined") return;

    var mBody = document.getElementById("materi-tbody");
    if (mBody && JADWAL_DATA.materi) {
      mBody.innerHTML = JADWAL_DATA.materi.map(function (item) {
        return "<tr>" +
          "<td class='td-no'>"       + item.no             + "</td>" +
          "<td class='td-mapel'>"    + escHtml(item.mapel)    + "</td>" +
          "<td class='td-pengajar'>" + escHtml(item.pengajar) + "</td>" +
          "</tr>";
      }).join("");
    }
  }

  /* ─────────────────────────────────────
     8. DAFTAR — Form pendaftaran multi-step
     Sebelumnya: semua fungsi ditulis di luar IIFE (di bawah)
     sehingga bisa tumpang tindih dengan script lain.
     Sekarang: semua di dalam IIFE, expose hanya yang perlu.
     ───────────────────────────────────── */
  function initDaftar() {
    // Hanya jalan jika elemen form ada di halaman
    if (!document.getElementById("step-1")) return;

    var currentStep = 1;

    function showStep(n) {
      for (var i = 1; i <= 4; i++) {
        var el = document.getElementById("step-" + i);
        if (el) el.classList.toggle("hidden", i !== n);
      }
      for (var j = 1; j <= 3; j++) {
        var ind = document.getElementById("step-ind-" + j);
        if (!ind) continue;
        ind.classList.remove("active", "done");
        if (j < n)      ind.classList.add("done");
        else if (j === n) ind.classList.add("active");
      }
      document.querySelectorAll(".step-line").forEach(function (line, idx) {
        line.classList.toggle("done", idx < n - 1);
      });
      currentStep = n;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function val(id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : "";
    }

    function validateStep1() {
      var ok = val("inp-nama") && val("inp-umur") && val("inp-jk") && val("inp-kelas");
      var err = document.getElementById("error-1");
      if (err) err.classList.toggle("hidden", !!ok);
      return !!ok;
    }

    function validateStep2() {
      var ortu = val("inp-ortu");
      var wa   = val("inp-wa").replace(/\D/g, "");
      var err  = document.getElementById("error-2");
      var msg  = "";
      if (!ortu || !wa)      msg = "⚠️ Mohon isi nama orang tua dan nomor WhatsApp.";
      else if (wa.length < 8) msg = "⚠️ Nomor WhatsApp tidak valid, minimal 8 digit.";
      if (err) {
        err.textContent = msg;
        err.classList.toggle("hidden", !msg);
      }
      return !msg;
    }

    function buildPreview() {
      function set(id, v) {
        var el = document.getElementById(id);
        if (el) el.textContent = v || "—";
      }
      set("prev-nama",       val("inp-nama"));
      set("prev-umur",       val("inp-umur") + " tahun");
      set("prev-jk",         val("inp-jk"));
      set("prev-kelas",      val("inp-kelas"));
      set("prev-pengalaman", val("inp-pengalaman"));
      set("prev-sekolah",    val("inp-sekolah") || "Tidak diisi");
      set("prev-ortu",       val("inp-ortu"));
      set("prev-wa",         "+62" + val("inp-wa").replace(/\D/g,"").replace(/^0/,""));
      set("prev-alamat",     val("inp-alamat") || "Tidak diisi");
      set("prev-catatan",    val("inp-catatan") || "Tidak ada");
    }

    // Expose ke global (dipanggil dari onclick di HTML)
    window.nextStep = function (n) {
      if (n === 2 && !validateStep1()) return;
      if (n === 3 && !validateStep2()) return;
      if (n === 3) buildPreview();
      showStep(n);
    };
    window.prevStep = function (n) { showStep(n); };

    window.kirimWhatsApp = function () {
      var wa = val("inp-wa").replace(/\D/g, "").replace(/^0/, "");
      var sekolah  = val("inp-sekolah");
      var alamat   = val("inp-alamat");
      var catatan  = val("inp-catatan");

      var pesan =
        "*PENDAFTARAN SANTRI BARU*\n" +
        "TPQ Akhlaqul Qurro\n\n" +
        "📋 *Data Santri*\n" +
        "• Nama     : " + val("inp-nama") + "\n" +
        "• Umur     : " + val("inp-umur") + " tahun\n" +
        "• Kelamin  : " + val("inp-jk")   + "\n" +
        "• Kelas    : " + val("inp-kelas") + "\n" +
        "• Pengalaman: " + val("inp-pengalaman") + "\n" +
        (sekolah ? "• Sekolah  : " + sekolah + "\n" : "") +
        "\n👨‍👩‍👧 *Data Orang Tua*\n" +
        "• Nama     : " + val("inp-ortu") + "\n" +
        "• WhatsApp : +62" + wa + "\n" +
        (alamat  ? "• Alamat   : " + alamat  + "\n" : "") +
        (catatan ? "\n📝 Catatan:\n" + catatan + "\n" : "") +
        "\n_Dikirim via website TPQ Akhlaqul Qurro_";

      showStep(4);
      setTimeout(function () {
        window.open("https://wa.me/62895425173700?text=" + encodeURIComponent(pesan), "_blank");
      }, 800);
    };

    // Mulai dari step 1
    showStep(1);
  }

  /* ─────────────────────────────────────
     9. UTILITY — escape HTML sederhana
     Cegah XSS kalau data dari luar masuk ke innerHTML
     ───────────────────────────────────── */
  function escHtml(str) {
    if (typeof str !== "string") return String(str || "");
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ─────────────────────────────────────
     10. INIT — jalankan berdasarkan halaman
     ───────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", function () {
    initNavbar();
    initMobileMenu();
    initMobileAccordion();
    initCounters();

    var path = window.location.pathname;
    if (path.includes("jadwal"))     initJadwal();
    if (path.includes("tatatertib")) initTatatertib();
    if (path.includes("tentang"))    initTentang();  // ← sekarang fungsinya ada
    if (path.includes("daftar"))     initDaftar();   // ← sekarang tidak tumpang tindih
  });

})();