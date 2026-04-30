/* ════════════════════════════════════════
   TPQ AKHLAQUL QURRO' — main.js
   Khusus index.html
   ════════════════════════════════════════ */

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    /* ── Mobile hamburger ── */
    var menuBtn = document.getElementById("menu-btn");
    var mobileMenu = document.getElementById("mobile-menu");
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener("click", function () {
        mobileMenu.classList.toggle("open");
        menuBtn.classList.toggle("menu-open");
      });
    }

    window.closeMobile = function () {
      if (mobileMenu) {
        mobileMenu.classList.remove("open");
        menuBtn.classList.remove("menu-open");
      }
    };

    /* ── Mobile accordion ── */
    var accBtn = document.getElementById("acc-btn");
    var accContent = document.getElementById("acc-content");
    if (accBtn && accContent) {
      accBtn.addEventListener("click", function () {
        accBtn.classList.toggle("open");
        accContent.classList.toggle("open");
      });
    }

    /* ── Navbar shadow on scroll ── */
    var navbar = document.getElementById("navbar");
    if (navbar) {
      window.addEventListener("scroll", function () {
        navbar.classList.toggle("scrolled", window.scrollY > 40);
      });
    }

    /* ── Counter animasi ── */
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
    /* ── Auto-detect active page mobile menu ── */
    function initMobileActive() {
      var path = window.location.pathname;
      document.querySelectorAll("#mobile-menu a").forEach(function (link) {
        var href = link.getAttribute("href");
        if (!href) return;
        var isActive = false;
        if (href === "./index.html" || href === "/") {
          isActive = path === "/" || path.endsWith("index.html");
        } else {
          var pageName = href.replace(/.*\//, "").replace(".html", "");
          isActive = path.includes(pageName) && pageName !== "";
        }
        if (isActive) link.classList.add("mobile-active");
      });
    }
    initMobileActive();
  });
})();
