/* ════════════════════════════════════════
   TPQ AKHLAQUL QURRO' — Main JavaScript
   ════════════════════════════════════════ */

(function () {
  "use strict";

  /* ══════════════════════════════════════
     TRANSLATIONS (i18n)
  ══════════════════════════════════════ */
  const translations = {
    id: {
      /* Navbar */
      nav_home: "Beranda",
      nav_about_menu: "Tentang Kami",
      nav_profile: "Profil TPQ",
      nav_vision: "Visi & Misi",
      nav_gallery: "Galeri",
      nav_contact: "Kontak",
      nav_portal: "Portal Santri",

      /* Search */
      search_label: "Cari Info",
      search_link: "Hubungi kami untuk pendaftaran →",
      search_placeholder: "Cari program, jadwal, informasi pendaftaran...",

      /* Icon grid */
      grid_program: "Program",
      grid_schedule: "Jadwal",
      grid_achievement: "Capaian",
      grid_activity: "Kegiatan",
      grid_news: "Pengumuman",
      grid_location: "Lokasi",

      /* Stats */
      stats_title: "Capaian Kami",
      stats_more: "Selengkapnya →",
      stat_1: "Santri Aktif",
      stat_2: "Alumni Lulus",
      stat_3: "Tenaga Pengajar",
      stat_4: "Tahun Berdiri",
      stats_note: "*Data per tahun 2026",

      /* Hero */
      hero_sub: "Selamat Datang di TPQ Akhlaqul Qurro'",
      hero_title_1: "Membentuk Generasi dengan",
      hero_title_2: "Iman & Ilmu",
      hero_desc:
        "Kami membimbing anak-anak dengan nilai-nilai Islam yang kuat, kedisiplinan, dan kecintaan terhadap Al-Qur'an dalam lingkungan belajar yang terstruktur dan penuh kasih sayang.",
      hero_btn1: "Lihat Program",
      hero_btn2: "Hubungi Kami",

      /* Programs */
      prog_badge: "Program Unggulan",
      prog_title_1: "Program",
      prog_title_2: "Kami",
      prog_desc:
        "Program pembelajaran terstruktur yang dirancang untuk membangun keimanan, kedisiplinan, dan akhlak Islami yang kuat.",
      prog_cta: "Daftar Sekarang →",
      program1_title: "Baca Al-Qur'an",
      program1_desc:
        "Pembelajaran terbimbing dengan tajwid dan makhraj yang benar untuk memperkuat kemampuan membaca Al-Qur'an.",
      program2_title: "Ilmu Agama Islam",
      program2_desc:
        "Pengetahuan dasar tentang akidah, fiqih, dan praktik Islam sehari-hari.",
      program3_title: "Pembinaan Akhlak",
      program3_desc:
        "Membangun kedisiplinan, rasa hormat, dan nilai moral yang kuat melalui bimbingan dan teladan.",

      /* Why */
      why_title_1: "Mengapa",
      why_title_2: "Memilih Kami",
      why_desc:
        "Kami memadukan tradisi, kurikulum terstruktur, dan standar pendidikan modern.",
      why1_title: "Pengajar Berkualitas",
      why1_desc:
        "Pendidik berpengalaman dan tersertifikasi yang membimbing setiap santri dengan sabar dan penuh dedikasi.",
      why2_title: "Kurikulum Terstruktur",
      why2_desc:
        "Tingkatan yang jelas dan progres yang terukur di setiap program sesuai standar pendidikan Islam modern.",
      why3_title: "Lingkungan Aman",
      why3_desc:
        "Suasana belajar yang nyaman, aman, dan kondusif secara Islami untuk setiap anak.",

      /* About */
      about_badge: "Tentang Kami",
      about_title_1: "Tentang",
      about_title_2: "Sekolah Kami",
      about_desc1:
        "Kami berkomitmen menyediakan lingkungan Islami yang penuh kasih di mana santri tumbuh secara spiritual, intelektual, dan moral.",
      about_desc2:
        "Kurikulum kami memadukan ilmu Islam tradisional dengan nilai pendidikan modern, memastikan perkembangan yang seimbang.",
      about_accred: "Terakreditasi",
      stat_years: "Tahun Berdiri",
      stat_alumni: "Alumni",
      stat_teachers: "Pengajar",

      /* Gallery */
      gallery_title_1: "Fasilitas",
      gallery_title_2: "Kami",
      gallery_link: "Lihat semua →",

      /* Testimonials */
      testi_title_1: "Kata",
      testi_title_2: "Orang Tua Santri",
      testi_desc:
        "Dipercaya oleh keluarga-keluarga yang mengutamakan pendidikan Islam berkualitas.",
      testi_role: "Orang Tua Santri",

      /* FAQ */
      faq_title_1: "Pertanyaan yang",
      faq_title_2: "Sering Diajukan",
      faq1_q: "Usia berapa santri yang diterima?",
      faq1_a:
        "Kami menerima santri usia 5 hingga 15 tahun, dikelompokkan berdasarkan tingkat dan tahap pembelajaran.",
      faq2_q: "Apakah ada sertifikat kelulusan?",
      faq2_a:
        "Ya, santri menerima sertifikat setelah menyelesaikan setiap tingkatan program, yang diakui oleh otoritas keagamaan setempat.",
      faq3_q: "Di mana lokasi TPQ ini?",
      faq3_a:
        "Kami berlokasi di Dusun Kabungka, Winning, Buton, Sulawesi Tenggara, Indonesia.",
      faq4_q: "Berapa biaya pendaftaran?",
      faq4_a:
        "Silakan hubungi kami melalui WhatsApp atau datang langsung untuk informasi biaya pendaftaran.",

      /* Location */
      loc_title_1: "Kunjungi",
      loc_title_2: "Lokasi Kami",

      /* CTA */
      cta_title: "Siap Mendaftarkan Anak Anda?",
      cta_desc:
        "Bergabunglah dengan komunitas belajar Islam kami dan bantu anak Anda tumbuh dengan iman, ilmu, dan akhlak yang kuat.",
      cta_btn1: "Daftar via WhatsApp",
      cta2_title: "Punya Pertanyaan?",
      cta2_desc:
        "Kami siap membantu menjawab semua pertanyaan Anda tentang program dan pendaftaran.",
      cta_btn2: "Lihat Program →",

      /* Footer */
      footer_desc:
        "Membangun iman, ilmu, dan akhlak yang kuat melalui pendidikan Islam yang terstruktur.",
      footer_links: "Tautan Cepat",
      footer_about: "Tentang",
      footer_programs: "Program",
      footer_testi: "Testimoni",
      footer_contact: "Kontak",
      footer_prog: "Program",
      footer_prog1: "📖 Baca Al-Qur'an",
      footer_prog2: "🕌 Ilmu Agama Islam",
      footer_prog3: "⭐ Pembinaan Akhlak",
      footer_cta: "Daftar Sekarang →",
      wa_btn: "Hubungi Kami",
    },

    en: {
      /* Navbar */
      nav_home: "Home",
      nav_about_menu: "About Us",
      nav_profile: "TPQ Profile",
      nav_vision: "Vision & Mission",
      nav_gallery: "Gallery",
      nav_contact: "Contact",
      nav_portal: "Student Portal",

      /* Search */
      search_label: "Search",
      search_link: "Contact us for registration →",
      search_placeholder: "Search programs, schedules, registration info...",

      /* Icon grid */
      grid_program: "Program",
      grid_schedule: "Schedule",
      grid_achievement: "Achievement",
      grid_activity: "Activities",
      grid_news: "Announcement",
      grid_location: "Location",

      /* Stats */
      stats_title: "Our Achievements",
      stats_more: "See more →",
      stat_1: "Active Students",
      stat_2: "Graduates",
      stat_3: "Teachers",
      stat_4: "Years Active",
      stats_note: "*Data as of 2026",

      /* Hero */
      hero_sub: "Welcome to TPQ Akhlaqul Qurro'",
      hero_title_1: "Shaping the Future with",
      hero_title_2: "Faith & Knowledge",
      hero_desc:
        "We nurture children with strong Islamic values, discipline, and love for the Qur'an in a structured and supportive learning environment.",
      hero_btn1: "Explore Programs",
      hero_btn2: "Get in Touch",

      /* Programs */
      prog_badge: "Featured Programs",
      prog_title_1: "Our",
      prog_title_2: "Programs",
      prog_desc:
        "Structured learning programs designed to build faith, discipline, and strong Islamic character.",
      prog_cta: "Register Now →",
      program1_title: "Qur'an Reading",
      program1_desc:
        "Guided learning with proper tajwid and pronunciation to strengthen Qur'anic literacy.",
      program2_title: "Islamic Studies",
      program2_desc:
        "Foundational knowledge in aqidah, fiqh, and daily Islamic practices.",
      program3_title: "Character Building",
      program3_desc:
        "Developing discipline, respect, and strong moral values through guided mentorship.",

      /* Why */
      why_title_1: "Why",
      why_title_2: "Choose Us",
      why_desc:
        "We combine tradition, structure, and modern education standards.",
      why1_title: "Qualified Teachers",
      why1_desc:
        "Experienced and certified educators guiding each student with patience and dedication.",
      why2_title: "Structured Curriculum",
      why2_desc:
        "Clear levels and measurable progress in every program with modern Islamic standards.",
      why3_title: "Safe Environment",
      why3_desc:
        "Comfortable, safe, and supportive Islamic learning atmosphere for every child.",

      /* About */
      about_badge: "About Us",
      about_title_1: "About",
      about_title_2: "Our School",
      about_desc1:
        "We are committed to providing a nurturing Islamic environment where students grow spiritually, intellectually, and morally.",
      about_desc2:
        "Our structured curriculum combines traditional Islamic knowledge with modern educational values, ensuring balanced development.",
      about_accred: "Accredited",
      stat_years: "Years Active",
      stat_alumni: "Alumni",
      stat_teachers: "Teachers",

      /* Gallery */
      gallery_title_1: "Our",
      gallery_title_2: "Facilities",
      gallery_link: "See all →",

      /* Testimonials */
      testi_title_1: "What Parents",
      testi_title_2: "Say",
      testi_desc: "Trusted by families who value strong Islamic education.",
      testi_role: "Parent",

      /* FAQ */
      faq_title_1: "Frequently Asked",
      faq_title_2: "Questions",
      faq1_q: "What age groups do you accept?",
      faq1_a:
        "We accept students from ages 5 to 15, grouped by level and learning stage.",
      faq2_q: "Do you provide certification?",
      faq2_a:
        "Yes, students receive certificates upon completing each program level, recognized by local religious authorities.",
      faq3_q: "Where is the school located?",
      faq3_a:
        "We are located in Dusun Kabungka, Winning, Buton, Southeast Sulawesi, Indonesia.",
      faq4_q: "How much is the registration fee?",
      faq4_a:
        "Please contact us via WhatsApp or visit directly for registration fee information.",

      /* Location */
      loc_title_1: "Visit",
      loc_title_2: "Our Location",

      /* CTA */
      cta_title: "Ready to Enroll Your Child?",
      cta_desc:
        "Join our Islamic learning community and help your child grow with strong faith, knowledge, and character.",
      cta_btn1: "Register via WhatsApp",
      cta2_title: "Have Questions?",
      cta2_desc:
        "We are ready to help answer all your questions about programs and registration.",
      cta_btn2: "View Programs →",

      /* Footer */
      footer_desc:
        "Building strong faith, knowledge, and character through structured Islamic education.",
      footer_links: "Quick Links",
      footer_about: "About",
      footer_programs: "Programs",
      footer_testi: "Testimonials",
      footer_contact: "Contact",
      footer_prog: "Program",
      footer_prog1: "📖 Qur'an Reading",
      footer_prog2: "🕌 Islamic Studies",
      footer_prog3: "⭐ Character Building",
      footer_cta: "Register Now →",
      wa_btn: "Chat Us",
    },
  };

  /* ══════════════════════════════════════
     SET LANGUAGE
  ══════════════════════════════════════ */
  function setLang(lang) {
    // Ganti semua elemen [data-i18n]
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key] !== undefined) {
        el.textContent = translations[lang][key];
      }
    });

    // Ganti placeholder search
    const searchInput = document.getElementById("search-input");
    if (searchInput && translations[lang].search_placeholder) {
      searchInput.placeholder = translations[lang].search_placeholder;
    }

    // Simpan ke localStorage
    localStorage.setItem("tpq_lang", lang);

    // Update warna tombol toggle
    // ID aktif = hijau, EN aktif = navy
    ["btn-id", "btn-id-m"].forEach(function (id) {
      const el = document.getElementById(id);
      if (!el) return;
      el.className =
        lang === "id" ? "lang-btn active-id" : "lang-btn inactive-id";
    });
    ["btn-en", "btn-en-m"].forEach(function (id) {
      const el = document.getElementById(id);
      if (!el) return;
      el.className =
        lang === "en" ? "lang-btn active-en" : "lang-btn inactive-en";
    });

    document.documentElement.lang = lang;
  }

  // Expose ke global untuk onclick di HTML
  window.setLang = setLang;

  /* ══════════════════════════════════════
     MOBILE MENU
  ══════════════════════════════════════ */
  document.addEventListener("DOMContentLoaded", function () {
    // Toggle mobile menu
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener("click", function () {
        mobileMenu.classList.toggle("hidden");
      });
    }

    // Close mobile menu (dipanggil dari onclick di HTML)
    window.closeMobile = function () {
      if (mobileMenu) mobileMenu.classList.add("hidden");
    };

    /* ── Mobile accordion: Tentang Kami ── */
    const accBtn = document.getElementById("acc-btn");
    const accContent = document.getElementById("acc-content");
    if (accBtn && accContent) {
      accBtn.addEventListener("click", function () {
        accContent.classList.toggle("open");
        this.classList.toggle("open");
      });
    }

    /* ══════════════════════════════════════
       COUNTER ANIMATION
    ══════════════════════════════════════ */
    const counters = document.querySelectorAll(".counter");
    if (counters.length) {
      const counterObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = +el.dataset.target;
            const step = target / (1500 / 16);
            let current = 0;
            const timer = setInterval(function () {
              current += step;
              if (current >= target) {
                el.textContent = target + "+";
                clearInterval(timer);
              } else {
                el.textContent = Math.floor(current);
              }
            }, 16);
            counterObserver.unobserve(el);
          });
        },
        { threshold: 0.5 },
      );
      counters.forEach(function (c) {
        counterObserver.observe(c);
      });
    }

    /* ══════════════════════════════════════
       NAVBAR SHADOW ON SCROLL
    ══════════════════════════════════════ */
    const navbar = document.querySelector("header.navbar");
    if (navbar) {
      window.addEventListener("scroll", function () {
        navbar.classList.toggle("scrolled", window.scrollY > 40);
      });
    }

    /* ══════════════════════════════════════
       INIT LANGUAGE (localStorage atau default ID)
    ══════════════════════════════════════ */
    const savedLang = localStorage.getItem("tpq_lang") || "id";
    setLang(savedLang);
  });
})();

