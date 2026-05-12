// ============================================
// KONEKSI SUPABASE - TPQ Akhlaqul Qurro
// ============================================

const SUPABASE_URL = "https://bsuozojhtrkdehvjppdi.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzdW96b2podHJrZGVodmpwcGRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NzYzMDMsImV4cCI6MjA5MzI1MjMwM30.9AJshPyN4n3kED7aDaJGCkYLAx7txFaRiOSpyRm-ouk";

/* ════════════════════════════════════════
   TPQ AKHLAQUL QURRO' — dash-santri.js  v2
   Halaman: dashboard-santri.html

   PERBAIKAN dari v1:
   1. initSidebar() didefinisikan DUA KALI → dihapus duplikatnya
   2. initNav() didefinisikan DUA KALI → dihapus duplikatnya
   3. window.logout sekarang di-define SETELAH auth-guard,
      sehingga modal konfirmasi yang menang (bukan fallback)
   4. Semua fungsi dalam satu IIFE — tidak ada yang bocor ke global
      kecuali window.logout yang memang perlu
   ════════════════════════════════════════ */

(function () {
  "use strict";

  /* ──────────────────────────────────────
     DATA USER
  ────────────────────────────────────── */
  var user     = window.tpqUser || {};
  var santriId = user.id || null;

  /* ──────────────────────────────────────
     HELPER: DOM
  ────────────────────────────────────── */
  function setText(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }
  function setWidth(id, val) {
    var el = document.getElementById(id);
    if (el) el.style.width = val;
  }

  /* ──────────────────────────────────────
     HELPER: GRADE NILAI
  ────────────────────────────────────── */
  function getGrade(n) {
    if (n >= 90) return { grade: "A", ket: "Sangat Baik" };
    if (n >= 80) return { grade: "B", ket: "Baik" };
    if (n >= 70) return { grade: "C", ket: "Cukup" };
    if (n >= 60) return { grade: "D", ket: "Perlu Perbaikan" };
    return { grade: "E", ket: "Kurang" };
  }

  /* ──────────────────────────────────────
     HELPER: DETEKSI KELAS → TINGKATAN JADWAL
  ────────────────────────────────────── */
  var HARI = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];

  function getTingkatan(kelas) {
    if (!kelas || typeof JADWAL_DATA === "undefined") return null;
    var k = kelas.toString().trim();
    if (/tahfidz/i.test(k))  return "Tahfidz 1";
    if (/qur.?an/i.test(k))  return "Qur'an 1 & 2";
    if (/^b/i.test(k))       return "B Seluruhnya";
    if (/^a/i.test(k))       return "A Seluruhnya";
    return null;
  }

  /* ──────────────────────────────────────
     FETCH: ABSENSI BULAN INI
  ────────────────────────────────────── */
  async function fetchAbsensi() {
    if (!window.supabaseClient || !santriId) return [];
    var now   = new Date();
    var year  = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, "0");

    var { data, error } = await window.supabaseClient
      .from("absensi")
      .select("tanggal, status")
      .eq("santri_id", santriId)
      .gte("tanggal", year + "-" + month + "-01")
      .lte("tanggal", year + "-" + month + "-31")
      .order("tanggal", { ascending: true });

    if (error) { console.error("fetchAbsensi:", error); return []; }
    return data || [];
  }

  /* ──────────────────────────────────────
     FETCH: NILAI
  ────────────────────────────────────── */
  async function fetchNilai() {
    if (!window.supabaseClient || !santriId) return [];

    var { data, error } = await window.supabaseClient
      .from("nilai")
      .select("mapel, nilai, semester")
      .eq("santri_id", santriId)
      .order("mapel", { ascending: true });

    if (error) { console.error("fetchNilai:", error); return []; }
    return data || [];
  }

  /* ──────────────────────────────────────
     FETCH: CATATAN USTADZ
  ────────────────────────────────────── */
  async function fetchCatatan() {
    if (!window.supabaseClient || !santriId) return [];

    var { data, error } = await window.supabaseClient
      .from("catatan")
      .select("isi, ustadz, tanggal")
      .eq("santri_id", santriId)
      .order("tanggal", { ascending: false })
      .limit(10);

    if (error) { console.error("fetchCatatan:", error); return []; }
    return data || [];
  }

  /* ──────────────────────────────────────
     RENDER: INFO SANTRI
  ────────────────────────────────────── */
  function renderUserInfo() {
    var nama   = user.nama_lengkap || "Santri";
    var nis    = user.nis          || "-";
    var kelas  = user.kelas        ? "Kelas " + user.kelas : "-";
    var inisial = nama.split(" ").slice(0, 2)
      .map(function (w) { return w[0]; }).join("").toUpperCase();

    setText("user-nama",    nama);
    setText("user-nis",     "NIS: " + nis);
    setText("user-kelas",   kelas);
    setText("avatar-text",  inisial);
    setText("topbar-nama",  nama.split(" ")[0]);
    setText("banner-nama",  "Halo, " + nama + "!");
  }

  /* ──────────────────────────────────────
     RENDER: ABSENSI — kalender bulan ini
  ────────────────────────────────────── */
  function renderAbsensi(data) {
    var hadir = data.filter(function (d) { return d.status === "hadir"; }).length;
    var absen = data.filter(function (d) { return d.status === "absen"; }).length;
    var izin  = data.filter(function (d) { return d.status === "izin";  }).length;
    var total = hadir + absen + izin;
    var pct   = total > 0 ? Math.round((hadir / total) * 100) : 0;

    setText("stat-hadir",  hadir + " Hari");
    setText("pct-hadir",   pct + "%");
    setText("pct-hadir-2", pct + "%");
    setWidth("bar-hadir",  pct + "%");

    // Build grid kalender
    var now         = new Date();
    var tahun       = now.getFullYear();
    var bulan       = now.getMonth();
    var hariIniStr  = now.toISOString().slice(0, 10);
    var totalHari   = new Date(tahun, bulan + 1, 0).getDate();
    var hariPertama = new Date(tahun, bulan, 1).getDay();

    var statusMap = {};
    data.forEach(function (d) { statusMap[d.tanggal] = d.status; });

    var classMap = { hadir: "hadir", absen: "absen", izin: "izin" };
    var labelMap = { hadir: "✓",    absen: "✗",    izin: "I"    };
    var days     = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

    // Header hari
    var html = days.map(function (d) {
      return '<div class="attend-day" style="background:transparent;color:#9ca3af;font-size:.65rem;font-weight:700;">' + d + "</div>";
    }).join("");

    // Offset hari pertama
    for (var i = 0; i < hariPertama; i++) {
      html += '<div class="attend-day future"></div>';
    }

    // Isi tanggal
    for (var tgl = 1; tgl <= totalHari; tgl++) {
      var tglStr  = tahun + "-" + String(bulan + 1).padStart(2, "0") + "-" + String(tgl).padStart(2, "0");
      var isToday  = tglStr === hariIniStr;
      var isFuture = tglStr > hariIniStr;
      var status   = statusMap[tglStr];
      var cls, lbl;

      if (isToday) {
        cls = status ? classMap[status] : "today";
        lbl = status ? labelMap[status] : "●";
      } else if (isFuture) {
        cls = "future"; lbl = "";
      } else {
        cls = status ? classMap[status] : "future";
        lbl = status ? labelMap[status] : tgl;
      }

      html += '<div class="attend-day ' + cls + '" title="' + tglStr + '">' + lbl + "</div>";
    }

    ["absensi-grid", "absensi-grid-2"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  }

  /* ──────────────────────────────────────
     RENDER: NILAI
  ────────────────────────────────────── */
  function renderNilai(data) {
    var tbody = document.getElementById("nilai-tbody");
    if (!tbody) return;

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-gray-400 py-4">Belum ada data nilai</td></tr>';
      return;
    }

    var rata = Math.round(
      data.reduce(function (sum, d) { return sum + Number(d.nilai); }, 0) / data.length
    );
    setText("stat-nilai", String(rata));

    tbody.innerHTML = data.map(function (item) {
      var g = getGrade(Number(item.nilai));
      return "<tr>" +
        '<td class="font-medium">' + item.mapel + "</td>" +
        "<td><strong>" + item.nilai + "</strong></td>" +
        '<td><span class="nilai-pill nilai-' + g.grade + '">' + g.grade + "</span></td>" +
        '<td class="text-gray-500">' + g.ket + "</td>" +
        "</tr>";
    }).join("");
  }

  /* ──────────────────────────────────────
     RENDER: CATATAN USTADZ
  ────────────────────────────────────── */
  function renderCatatan(data) {
    var html = data.length === 0
      ? '<p class="text-sm text-gray-400">Belum ada catatan dari ustadz.</p>'
      : data.map(function (item) {
          var tgl = new Date(item.tanggal).toLocaleDateString("id-ID", {
            day: "numeric", month: "long", year: "numeric",
          });
          return '<div class="catatan-item">' +
            '<p class="catatan-date">'   + tgl       + "</p>" +
            '<p class="catatan-text">'   + item.isi  + "</p>" +
            '<p class="catatan-ustadz">— ' + item.ustadz + "</p>" +
            "</div>";
        }).join("");

    ["catatan-list", "catatan-list-full"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });

    if (data.length > 0) setText("nama-ustadz", data[0].ustadz);
  }

  /* ──────────────────────────────────────
     RENDER: JADWAL HARI INI
  ────────────────────────────────────── */
  function renderJadwalHariIni() {
    var el = document.getElementById("jadwal-hari-ini");
    if (!el || typeof JADWAL_DATA === "undefined") return;

    var hariNama = HARI[new Date().getDay()];
    var tingkat  = getTingkatan(user.kelas);

    if (!tingkat || !JADWAL_DATA.semesterGenap[tingkat] || !JADWAL_DATA.semesterGenap[tingkat][hariNama]) {
      el.innerHTML = '<p class="text-sm text-gray-400">Tidak ada jadwal hari ini.</p>';
      return;
    }

    var jadwal    = JADWAL_DATA.semesterGenap[tingkat][hariNama];
    var rutinitas = JADWAL_DATA.rutinitas.find(function (r) { return r.hari === hariNama; });
    var html      = "";

    if (rutinitas) {
      html += '<div class="catatan-item mb-2"><p class="catatan-date">Rutinitas</p><p class="catatan-text">📖 ' + rutinitas.kegiatan + "</p></div>";
    }

    jadwal.forEach(function (item, i) {
      html += '<div class="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">' +
        '<span class="text-xs font-bold text-white px-2 py-0.5 rounded-full" style="background:var(--grad-main)">' + (i + 1) + "</span>" +
        '<span class="text-sm">' + item + "</span>" +
        "</div>";
    });

    el.innerHTML = html;
  }

  /* ──────────────────────────────────────
     ANIMATE PROGRESS BARS
  ────────────────────────────────────── */
  function animateBars() {
    document.querySelectorAll(".progress-fill").forEach(function (bar) {
      var target = bar.style.width;
      bar.style.width = "0%";
      setTimeout(function () { bar.style.width = target; }, 300);
    });
  }

  /* ──────────────────────────────────────
     SIDEBAR
     PERBAIKAN: sebelumnya didefinisikan DUA KALI —
     yang pertama tidak punya collapse desktop,
     yang kedua punya tapi tidak pernah dipanggil karena
     sudah di-override oleh yang pertama saat DOMContentLoaded.
     Sekarang: satu definisi, lengkap.
  ────────────────────────────────────── */
  function initSidebar() {
    var sidebar     = document.getElementById("sidebar");
    var overlay     = document.getElementById("sidebar-overlay");
    var hamburger   = document.getElementById("hamburger");
    var mainContent = document.getElementById("main-content");
    if (!sidebar || !hamburger) return;

    hamburger.addEventListener("click", function () {
      if (window.innerWidth < 768) {
        // Mobile: slide in/out
        sidebar.classList.toggle("mobile-open");
        if (overlay) overlay.classList.toggle("show");
      } else {
        // Desktop: collapse ke icon-only
        sidebar.classList.toggle("collapsed");
        if (mainContent) mainContent.classList.toggle("expanded");
      }
    });

    // Tap overlay → tutup sidebar mobile
    if (overlay) {
      overlay.addEventListener("click", function () {
        sidebar.classList.remove("mobile-open");
        overlay.classList.remove("show");
      });
    }

    // Auto-tutup saat resize ke desktop
    var mq = window.matchMedia("(min-width: 768px)");
    mq.addEventListener("change", function (e) {
      if (e.matches) {
        sidebar.classList.remove("mobile-open");
        if (overlay) overlay.classList.remove("show");
      }
    });
  }

  /* ──────────────────────────────────────
     NAVIGASI SECTION
     PERBAIKAN: sebelumnya juga didefinisikan DUA KALI
  ────────────────────────────────────── */
  function initNav() {
    document.querySelectorAll(".nav-item[data-section]").forEach(function (item) {
      item.addEventListener("click", function () {
        document.querySelectorAll(".nav-item").forEach(function (n) {
          n.classList.remove("active");
        });
        this.classList.add("active");
        showSection(this.dataset.section);

        // Tutup mobile sidebar setelah pilih menu
        if (window.innerWidth < 768) {
          var sb = document.getElementById("sidebar");
          var ov = document.getElementById("sidebar-overlay");
          if (sb) sb.classList.remove("mobile-open");
          if (ov) ov.classList.remove("show");
        }
      });
    });
  }

  function showSection(name) {
    document.querySelectorAll(".dash-section").forEach(function (s) {
      s.classList.add("hidden");
    });
    var target = document.getElementById("section-" + name);
    if (target) target.classList.remove("hidden");
  }

  /* ──────────────────────────────────────
     MODAL NOTIFIKASI
  ────────────────────────────────────── */
  function initNotifModal() {
    var btn   = document.getElementById("btn-notif");
    var modal = document.getElementById("modal-notif");
    var close = document.getElementById("notif-close");
    if (!btn || !modal) return;

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      modal.classList.toggle("aktif");
    });

    if (close) {
      close.addEventListener("click", function () {
        modal.classList.remove("aktif");
      });
    }

    // Klik luar modal → tutup
    document.addEventListener("click", function (e) {
      if (!modal.contains(e.target) && e.target !== btn) {
        modal.classList.remove("aktif");
      }
    });
  }

  /* ──────────────────────────────────────
     MODAL LOGOUT
     PERBAIKAN: window.logout di-define DI SINI (bukan di auth-guard)
     sehingga versi dengan modal yang selalu menang.
     auth-guard.js hanya pasang fallback jika fungsi ini belum ada.
  ────────────────────────────────────── */
  function initLogoutModal() {
    var modal   = document.getElementById("modal-logout");
    var btnYa   = document.getElementById("logout-ya");
    var btnBatal = document.getElementById("logout-batal");
    if (!modal) return;

    // Override window.logout dengan versi yang punya modal
    window.logout = function () {
      modal.classList.add("aktif");
      document.body.style.overflow = "hidden";
    };

    if (btnBatal) {
      btnBatal.addEventListener("click", function () {
        modal.classList.remove("aktif");
        document.body.style.overflow = "";
      });
    }

    if (btnYa) {
      btnYa.addEventListener("click", function () {
        try { localStorage.removeItem("user"); } catch (e) {}
        window.location.replace("../login.html");
      });
    }

    // Klik overlay gelap → batal
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        modal.classList.remove("aktif");
        document.body.style.overflow = "";
      }
    });
  }

  /* ──────────────────────────────────────
     INIT — titik masuk utama
  ────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", async function () {

    renderUserInfo();

    // Inisialisasi UI — urutan penting
    initSidebar();      // satu kali, lengkap
    initNav();          // satu kali, lengkap
    initNotifModal();
    initLogoutModal();  // ini yang define window.logout — harus setelah auth-guard
    renderJadwalHariIni();

    // Kalau tidak ada santriId, tampilkan data kosong saja
    if (!santriId) {
      console.warn("dash-santri: santriId kosong — skip fetch Supabase");
      renderAbsensi([]);
      renderNilai([]);
      renderCatatan([]);
      return;
    }

    // Fetch semua data sekaligus (paralel, lebih cepat)
    try {
      var results = await Promise.all([
        fetchAbsensi(),
        fetchNilai(),
        fetchCatatan(),
      ]);

      renderAbsensi(results[0]);
      renderNilai(results[1]);
      renderCatatan(results[2]);
      setTimeout(animateBars, 400);

    } catch (err) {
      console.error("dash-santri: error saat fetch data →", err);
    }
  });

})();
