/* ════════════════════════════════════════
   TPQ AKHLAQUL QURRO' — main.js
   Khusus index.html

   SECTIONS:
   1. MOBILE MENU  — hamburger, close, auto-hide
   2. ACCORDION    — mobile "Tentang Kami"
   3. NAVBAR       — shadow on scroll
   4. COUNTER      — animasi angka statistik
   5. ACTIVE PAGE  — highlight link aktif mobile
   ════════════════════════════════════════ */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    /* ════════════════════════════════════════
       1. MOBILE MENU
       ════════════════════════════════════════ */

    var menuBtn = document.getElementById("menu-btn");
    var mobileMenu = document.getElementById("mobile-menu");

    if (menuBtn && mobileMenu) {
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

      function handleResize(e) {
        if (!e.matches) return;
        mobileMenu.classList.remove("open");
        menuBtn.classList.remove("menu-open");
        /* Tutup accordion sekalian */
        var accBtn = document.getElementById("acc-btn");
        var accContent = document.getElementById("acc-content");
        if (accBtn) accBtn.classList.remove("open");
        if (accContent) accContent.classList.remove("open");
      }

      mq.addEventListener("change", handleResize);
      handleResize(mq); /* jalankan sekali saat load */
    }

    /* ════════════════════════════════════════
       2. ACCORDION — Mobile "Tentang Kami"
       ════════════════════════════════════════ */

    var accBtn = document.getElementById("acc-btn");
    var accContent = document.getElementById("acc-content");

    if (accBtn && accContent) {
      accBtn.addEventListener("click", function () {
        accBtn.classList.toggle("open");
        accContent.classList.toggle("open");
      });
    }

    /* ════════════════════════════════════════
       3. NAVBAR — shadow on scroll
       ════════════════════════════════════════ */

    var navbar = document.getElementById("navbar");

    if (navbar) {
      window.addEventListener("scroll", function () {
        navbar.classList.toggle("scrolled", window.scrollY > 40);
      });
    }

    /* ════════════════════════════════════════
       4. COUNTER — animasi angka statistik
       ════════════════════════════════════════ */

    document.querySelectorAll(".counter").forEach(function (el) {
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

    /* ════════════════════════════════════════
       5. ACTIVE PAGE — highlight link mobile
       ════════════════════════════════════════ */

    var path = window.location.pathname;

    document.querySelectorAll("#mobile-menu a").forEach(function (link) {
      var href = link.getAttribute("href");
      if (!href) return;

      var isActive = false;

      if (href === "./index.html" || href === "/") {
        isActive = path === "/" || path.endsWith("index.html");
      } else {
        var pageName = href.replace(/.*\//, "").replace(".html", "");
        isActive = pageName !== "" && path.includes(pageName);
      }

      if (isActive) link.classList.add("mobile-active");
    });
  });
})();
