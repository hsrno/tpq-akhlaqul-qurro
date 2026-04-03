// <!-- ═══════════════════════════════════
// ═══════════════════════════════════ -->

(function () {
  "use strict";

  /* ── Navbar scroll shadow ── */
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", function () {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  });

  /* ── Mobile menu ── */
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  menuBtn.addEventListener("click", function () {
    mobileMenu.classList.toggle("hidden");
  });
  window.closeMobile = function () {
    mobileMenu.classList.add("hidden");
  };

  /* ── Counter animation ── */
  function runCounter() {
    document.querySelectorAll(".counter").forEach(function (counter) {
      const target = +counter.getAttribute("data-target");
      const inc = target / 80;
      function update() {
        const cur = +counter.innerText.replace("+", "");
        if (cur < target) {
          counter.innerText = Math.ceil(cur + inc);
          setTimeout(update, 20);
        } else {
          counter.innerText = target + "+";
        }
      }
      update();
    });
  }
  window.addEventListener("load", runCounter);

  /* ── Language translations ── */
  const translations = {
    en: {
      nav_home: "Home",
      nav_about: "About",
      nav_programs: "Programs",
      nav_contact: "Contact",
      hero_sub: "Welcome to TPQ Akhlaqul Qurro'",
      hero_title:
        "Shaping the Future with <span style='color:#fde047'>Faith & Knowledge</span>",
      hero_desc:
        "We nurture children with strong Islamic values, discipline, and love for the Qur'an in a structured and supportive learning environment.",
      hero_btn1: "Explore Programs",
      hero_btn2: "Get in Touch",
      programs_title: "Our <span style='color:#C8960C'>Programs</span>",
      programs_desc:
        "Structured learning programs designed to build faith, discipline, and strong Islamic character.",
      program1_title: "Qur'an Reading",
      program1_desc:
        "Guided learning with proper tajwid and pronunciation to strengthen Qur'anic literacy.",
      program2_title: "Islamic Studies",
      program2_desc:
        "Foundational knowledge in aqidah, fiqh, and daily Islamic practices.",
      program3_title: "Character Building",
      program3_desc:
        "Developing discipline, respect, and strong moral values through guided mentorship.",
      why_title: "Why <span style='color:#C8960C'>Choose Us</span>",
      why_desc:
        "We combine tradition, structure, and modern education standards.",
      about_title: "About <span style='color:#C8960C'>Our School</span>",
      about_desc1:
        "We are committed to providing a nurturing Islamic environment where students grow spiritually, intellectually, and morally.",
      about_desc2:
        "Our structured curriculum combines traditional Islamic knowledge with modern educational values, ensuring balanced development.",
      gallery_title: "Our <span style='color:#C8960C'>Facilities</span>",
      gallery_desc:
        "A safe and inspiring learning environment for every student.",
      testimonial_title: "What Parents <span style='color:#C8960C'>Say</span>",
      testimonial_desc:
        "Trusted by families who value strong Islamic education.",
      faq_title:
        "Frequently Asked <span style='color:#C8960C'>Questions</span>",
      faq_desc: "Clear answers to help you make the right decision.",
      location_title: "Visit <span style='color:#C8960C'>Our Location</span>",
      location_desc: "Easily accessible and located in a safe neighborhood.",
      cta_title: "Ready to Enroll Your Child?",
      cta_desc:
        "Join our Islamic learning community and help your child grow with strong faith, knowledge, and character.",
      cta_btn1: "Register Now",
      cta_btn2: "View Programs",
      footer_desc:
        "Building strong faith, knowledge, and character through structured Islamic education.",
      footer_links: "Quick Links",
      footer_contact: "Contact",
      footer_follow: "Follow Us",
      wa_btn: "Chat Us",
    },
    id: {
      nav_home: "Beranda",
      nav_about: "Tentang",
      nav_programs: "Program",
      nav_contact: "Kontak",
      hero_sub: "Selamat Datang di TPQ Akhlaqul Qurro'",
      hero_title:
        "Membentuk Generasi dengan <span style='color:#fde047'>Iman & Ilmu</span>",
      hero_desc:
        "Kami membimbing anak-anak dengan nilai Islami, kedisiplinan, dan kecintaan terhadap Al-Qur'an dalam lingkungan belajar yang terstruktur.",
      hero_btn1: "Lihat Program",
      hero_btn2: "Hubungi Kami",
      programs_title: "Program <span style='color:#C8960C'>Kami</span>",
      programs_desc:
        "Program pembelajaran terstruktur untuk membangun iman, disiplin, dan akhlak Islami.",
      program1_title: "Membaca Al-Qur'an",
      program1_desc:
        "Pembelajaran tajwid dan pelafalan yang benar untuk meningkatkan kemampuan membaca Al-Qur'an.",
      program2_title: "Studi Islam",
      program2_desc:
        "Pembelajaran dasar aqidah, fiqh, dan praktik ibadah sehari-hari.",
      program3_title: "Pembinaan Akhlak",
      program3_desc:
        "Menumbuhkan disiplin, rasa hormat, dan nilai moral melalui bimbingan.",
      why_title: "Mengapa <span style='color:#C8960C'>Memilih Kami</span>",
      why_desc:
        "Menggabungkan tradisi, struktur, dan standar pendidikan modern.",
      about_title: "Tentang <span style='color:#C8960C'>Sekolah Kami</span>",
      about_desc1:
        "Kami berkomitmen menciptakan lingkungan Islami yang mendukung pertumbuhan spiritual, intelektual, dan moral.",
      about_desc2:
        "Kurikulum terstruktur kami menggabungkan ilmu Islam klasik dan nilai pendidikan modern.",
      gallery_title: "Fasilitas <span style='color:#C8960C'>Kami</span>",
      gallery_desc:
        "Lingkungan belajar yang aman dan inspiratif bagi setiap siswa.",
      testimonial_title: "Kata <span style='color:#C8960C'>Orang Tua</span>",
      testimonial_desc:
        "Dipercaya oleh keluarga yang mengutamakan pendidikan Islami.",
      faq_title:
        "Pertanyaan yang <span style='color:#C8960C'>Sering Ditanyakan</span>",
      faq_desc: "Jawaban jelas untuk membantu Anda mengambil keputusan.",
      location_title: "Kunjungi <span style='color:#C8960C'>Lokasi Kami</span>",
      location_desc: "Mudah dijangkau dan berada di lingkungan yang aman.",
      cta_title: "Siap Mendaftarkan Anak Anda?",
      cta_desc:
        "Bergabunglah dengan komunitas pembelajaran Islami kami dan bantu anak Anda tumbuh dengan iman, ilmu, dan akhlak yang kuat.",
      cta_btn1: "Daftar Sekarang",
      cta_btn2: "Lihat Program",
      footer_desc:
        "Membangun iman, ilmu, dan akhlak melalui pendidikan Islami terstruktur.",
      footer_links: "Tautan Cepat",
      footer_contact: "Kontak",
      footer_follow: "Ikuti Kami",
      wa_btn: "Hubungi Kami",
    },
  };

  /* ── Set language ── */
  function setLanguage(lang) {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (translations[lang] && translations[lang][key] !== undefined) {
        el.innerHTML = translations[lang][key];
      }
    });
    localStorage.setItem("lang", lang);

    /* Highlight active button — desktop & mobile */
    ["btn-en", "btn-en-m"].forEach(function (id) {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.style.color = lang === "en" ? "#C8960C" : "";
      btn.style.fontWeight = lang === "en" ? "700" : "500";
    });
    ["btn-id", "btn-id-m"].forEach(function (id) {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.style.color = lang === "id" ? "#C8960C" : "";
      btn.style.fontWeight = lang === "id" ? "700" : "500";
    });
  }

  /* ── Attach language button events ── */
  ["btn-en", "btn-en-m"].forEach(function (id) {
    const btn = document.getElementById(id);
    if (btn)
      btn.addEventListener("click", function () {
        setLanguage("en");
      });
  });
  ["btn-id", "btn-id-m"].forEach(function (id) {
    const btn = document.getElementById(id);
    if (btn)
      btn.addEventListener("click", function () {
        setLanguage("id");
      });
  });

  /* ── Init language on load ── */
  const savedLang = localStorage.getItem("lang") || "en";
  setLanguage(savedLang);
})();
