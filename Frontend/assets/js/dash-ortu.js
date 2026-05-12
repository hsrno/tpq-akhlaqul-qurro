/* ════════════════════════════════════════
   TPQ AKHLAQUL QURRO' — Dashboard Santri JS
   Halaman: dashboard-santri.html
   Data dari: localStorage (user) + Supabase (absensi, nilai, catatan)
   ════════════════════════════════════════ */

(function () {
  "use strict";

  /* ══════════════════════════════════════
     DATA USER DARI LOCALSTORAGE
  ══════════════════════════════════════ */
  var user = window.tpqUser || {};
  var santriId = user.id || null;

  /* ══════════════════════════════════════
     HELPER: GRADE DARI NILAI
  ══════════════════════════════════════ */
  function getGrade(n) {
    if (n >= 90) return { grade: "A", ket: "Sangat Baik" };
    if (n >= 80) return { grade: "B", ket: "Baik" };
    if (n >= 70) return { grade: "C", ket: "Cukup" };
    if (n >= 60) return { grade: "D", ket: "Perlu Perbaikan" };
    return { grade: "E", ket: "Kurang" };
  }

  /* ══════════════════════════════════════
     HELPER: DETEKSI JADWAL DARI KELAS
  ══════════════════════════════════════ */
  var HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  function getTingkatan(kelas) {
    if (!kelas || typeof JADWAL_DATA === "undefined") return null;
    var k = kelas.toString().trim();
    if (/tahfidz/i.test(k)) return "Tahfidz 1";
    if (/qur.?an/i.test(k)) return "Qur'an 1 & 2";
    if (/^b/i.test(k)) return "B Seluruhnya";
    if (/^a/i.test(k)) return "A Seluruhnya";
    return null;
  }

  /* ══════════════════════════════════════
     FETCH: ABSENSI BULAN INI
  ══════════════════════════════════════ */
  async function fetchAbsensi() {
    if (!window.supabaseClient || !santriId) return [];
    var now = new Date();
    var year = now.getFullYear();
    var month = String(now.getMonth() + 1).padStart(2, "0");
    var dari = year + "-" + month + "-01";
    var sampai = year + "-" + month + "-31";

    var { data, error } = await window.supabaseClient
      .from("absensi")
      .select("tanggal, status")
      .eq("santri_id", santriId)
      .gte("tanggal", dari)
      .lte("tanggal", sampai)
      .order("tanggal", { ascending: true });

    if (error) {
      console.error("fetchAbsensi:", error);
      return [];
    }
    return data || [];
  }

  /* ══════════════════════════════════════
     FETCH: NILAI
  ══════════════════════════════════════ */
  async function fetchNilai() {
    if (!window.supabaseClient || !santriId) return [];

    var { data, error } = await window.supabaseClient
      .from("nilai")
      .select("mapel, nilai, semester")
      .eq("santri_id", santriId)
      .order("mapel", { ascending: true });

    if (error) {
      console.error("fetchNilai:", error);
      return [];
    }
    return data || [];
  }

  /* ══════════════════════════════════════
     FETCH: CATATAN USTADZ
  ══════════════════════════════════════ */
  async function fetchCatatan() {
    if (!window.supabaseClient || !santriId) return [];

    var { data, error } = await window.supabaseClient
      .from("catatan")
      .select("isi, ustadz, tanggal")
      .eq("santri_id", santriId)
      .order("tanggal", { ascending: false })
      .limit(10);

    if (error) {
      console.error("fetchCatatan:", error);
      return [];
    }
    return data || [];
  }

  /* ══════════════════════════════════════
     RENDER: INFO DASAR SANTRI
  ══════════════════════════════════════ */
  function renderUserInfo() {
    var nama = user.nama_lengkap || "Santri";
    var nis = user.nis || "-";
    var kelas = user.kelas ? "Kelas " + user.kelas : "-";
    var inisial = nama
      .split(" ")
      .slice(0, 2)
      .map(function (w) {
        return w[0];
      })
      .join("")
      .toUpperCase();

    setText("user-nama", nama);
    setText("user-nis", "NIS: " + nis);
    setText("user-kelas", kelas);
    setText("avatar-text", inisial);
    setText("topbar-nama", nama.split(" ")[0]);
    setText("banner-nama", "Halo, " + nama + "!");
  }

  /* ══════════════════════════════════════
     RENDER: ABSENSI — KALENDER BULAN INI
  ══════════════════════════════════════ */
  function renderAbsensi(data) {
    var hadir = data.filter(function (d) {
      return d.status === "hadir";
    }).length;
    var absen = data.filter(function (d) {
      return d.status === "absen";
    }).length;
    var izin = data.filter(function (d) {
      return d.status === "izin";
    }).length;
    var total = hadir + absen + izin;
    var pct = total > 0 ? Math.round((hadir / total) * 100) : 0;

    setText("stat-hadir", hadir + " Hari");
    setText("pct-hadir", pct + "%");
    setText("pct-hadir-2", pct + "%");
    setWidth("bar-hadir", pct + "%");

    // Build kalender
    var now = new Date();
    var tahun = now.getFullYear();
    var bulan = now.getMonth();
    var hariIniStr = now.toISOString().slice(0, 10);
    var totalHari = new Date(tahun, bulan + 1, 0).getDate();
    var hariPertama = new Date(tahun, bulan, 1).getDay();

    var statusMap = {};
    data.forEach(function (d) {
      statusMap[d.tanggal] = d.status;
    });

    var classMap = { hadir: "hadir", absen: "absen", izin: "izin" };
    var labelMap = { hadir: "✓", absen: "✗", izin: "I" };
    var days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    var html = days
      .map(function (d) {
        return (
          '<div class="attend-day" style="background:transparent;color:#9ca3af;font-size:.65rem;font-weight:700;">' +
          d +
          "</div>"
        );
      })
      .join("");

    for (var i = 0; i < hariPertama; i++) {
      html += '<div class="attend-day future"></div>';
    }

    for (var tgl = 1; tgl <= totalHari; tgl++) {
      var tglStr =
        tahun +
        "-" +
        String(bulan + 1).padStart(2, "0") +
        "-" +
        String(tgl).padStart(2, "0");
      var isToday = tglStr === hariIniStr;
      var isFuture = tglStr > hariIniStr;
      var status = statusMap[tglStr];
      var cls, lbl;

      if (isToday) {
        cls = status ? classMap[status] : "today";
        lbl = status ? labelMap[status] : "●";
      } else if (isFuture) {
        cls = "future";
        lbl = "";
      } else {
        cls = status ? classMap[status] : "future";
        lbl = status ? labelMap[status] : tgl;
      }

      html +=
        '<div class="attend-day ' +
        cls +
        '" title="' +
        tglStr +
        '">' +
        lbl +
        "</div>";
    }

    ["absensi-grid", "absensi-grid-2"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });
  }

  /* ══════════════════════════════════════
     RENDER: NILAI
  ══════════════════════════════════════ */
  function renderNilai(data) {
    var tbody = document.getElementById("nilai-tbody");
    if (!tbody) return;

    if (data.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="4" class="text-center text-gray-400 py-4">Belum ada data nilai</td></tr>';
      return;
    }

    var rata = Math.round(
      data.reduce(function (sum, d) {
        return sum + Number(d.nilai);
      }, 0) / data.length,
    );
    setText("stat-nilai", rata);

    tbody.innerHTML = data
      .map(function (item) {
        var g = getGrade(Number(item.nilai));
        return (
          "<tr>" +
          '<td class="font-medium">' +
          item.mapel +
          "</td>" +
          "<td><strong>" +
          item.nilai +
          "</strong></td>" +
          '<td><span class="nilai-pill nilai-' +
          g.grade +
          '">' +
          g.grade +
          "</span></td>" +
          '<td class="text-gray-500">' +
          g.ket +
          "</td>" +
          "</tr>"
        );
      })
      .join("");
  }

  /* ══════════════════════════════════════
     RENDER: CATATAN USTADZ
  ══════════════════════════════════════ */
  function renderCatatan(data) {
    var html =
      data.length === 0
        ? '<p class="text-sm text-gray-400">Belum ada catatan dari ustadz.</p>'
        : data
            .map(function (item) {
              var tgl = new Date(item.tanggal).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              });
              return (
                '<div class="catatan-item">' +
                '<p class="catatan-date">' +
                tgl +
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

    ["catatan-list", "catatan-list-full"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.innerHTML = html;
    });

    if (data.length > 0) setText("nama-ustadz", data[0].ustadz);
  }

  /* ══════════════════════════════════════
     RENDER: JADWAL HARI INI (dari jadwal.js)
  ══════════════════════════════════════ */
  function renderJadwalHariIni() {
    var el = document.getElementById("jadwal-hari-ini");
    if (!el || typeof JADWAL_DATA === "undefined") return;

    var hariNama = HARI[new Date().getDay()];
    var tingkat = getTingkatan(user.kelas);

    if (
      !tingkat ||
      !JADWAL_DATA.semesterGenap[tingkat] ||
      !JADWAL_DATA.semesterGenap[tingkat][hariNama]
    ) {
      el.innerHTML =
        '<p class="text-sm text-gray-400">Tidak ada jadwal hari ini.</p>';
      return;
    }

    var jadwal = JADWAL_DATA.semesterGenap[tingkat][hariNama];
    var rutinitas = JADWAL_DATA.rutinitas.find(function (r) {
      return r.hari === hariNama;
    });
    var html = "";

    if (rutinitas) {
      html +=
        '<div class="catatan-item mb-2"><p class="catatan-date">Rutinitas</p><p class="catatan-text">📖 ' +
        rutinitas.kegiatan +
        "</p></div>";
    }

    jadwal.forEach(function (item, i) {
      html +=
        '<div class="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">' +
        '<span class="text-xs font-bold text-white px-2 py-0.5 rounded-full" style="background:var(--grad-main)">' +
        (i + 1) +
        "</span>" +
        '<span class="text-sm">' +
        item +
        "</span>" +
        "</div>";
    });

    el.innerHTML = html;
    if (user.jam_belajar) setText("jam-belajar", user.jam_belajar);
  }

  /* ══════════════════════════════════════
     ANIMATE BARS
  ══════════════════════════════════════ */
  function animateBars() {
    document.querySelectorAll(".progress-fill").forEach(function (bar) {
      var target = bar.style.width;
      bar.style.width = "0%";
      setTimeout(function () {
        bar.style.width = target;
      }, 300);
    });
  }

  /* ══════════════════════════════════════
     SIDEBAR & NAV
  ══════════════════════════════════════ */
  function initSidebar() {
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("sidebar-overlay");
    var hamburger = document.getElementById("hamburger");
    if (!sidebar || !hamburger) return;

    hamburger.addEventListener("click", function () {
      if (window.innerWidth < 768) {
        sidebar.classList.toggle("mobile-open");
        if (overlay) overlay.classList.toggle("show");
      } else {
        sidebar.classList.toggle("collapsed");
        var mc = document.getElementById("main-content");
        if (mc) mc.classList.toggle("expanded");
      }
    });

    if (overlay) {
      overlay.addEventListener("click", function () {
        sidebar.classList.remove("mobile-open");
        overlay.classList.remove("show");
      });
    }
  }

  function initNav() {
    document
      .querySelectorAll(".nav-item[data-section]")
      .forEach(function (item) {
        item.addEventListener("click", function () {
          document.querySelectorAll(".nav-item").forEach(function (n) {
            n.classList.remove("active");
          });
          this.classList.add("active");
          showSection(this.dataset.section);
          if (window.innerWidth < 768) {
            document.getElementById("sidebar").classList.remove("mobile-open");
            var ov = document.getElementById("sidebar-overlay");
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

  /* ══════════════════════════════════════
     HELPER DOM
  ══════════════════════════════════════ */
  function setText(id, val) {
    var el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  function setWidth(id, val) {
    var el = document.getElementById(id);
    if (el) el.style.width = val;
  }

  /* ══════════════════════════════════════
     INIT
  ══════════════════════════════════════ */
  document.addEventListener("DOMContentLoaded", async function () {
    renderUserInfo();
    initSidebar();
    initNav();
    renderJadwalHariIni();

    if (!santriId) {
      console.warn("Tidak ada santri_id — data Supabase tidak diload");
      return;
    }

    try {
      var [absensi, nilaiData, catatan] = await Promise.all([
        fetchAbsensi(),
        fetchNilai(),
        fetchCatatan(),
      ]);

      renderAbsensi(absensi);
      renderNilai(nilaiData);
      renderCatatan(catatan);
      setTimeout(animateBars, 400);
    } catch (err) {
      console.error("Error load dashboard santri:", err);
    }
  });
})();
