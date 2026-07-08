/* =========================================================================
   Rozepsáno — main.js
   Bez závislostí. Vanilla JS, progresivní vylepšení.
   ========================================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header stín ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobilní menu ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Formuláře (post zdarma + odběr) ---------- */
  /*
    Odesílání: nakonfigurujte FORM_ENDPOINT (Formspark / Formspree / Resend proxy).
    Dokud je prázdné, formulář jen simuluje úspěch (pro lokální náhled).
    [DOPLNIT] endpoint níže.
  */
  var FORM_ENDPOINT = ""; // např. "https://submit-form.com/XXXXXXXX"

  document.querySelectorAll("form[data-form]").forEach(function (form) {
    var successEl = form.parentElement.querySelector(".form-success");
    var errorEl = form.querySelector(".form-error");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot: pokud je vyplněný, tiše "uspěj" a nic neposílej.
      var hp = form.querySelector('input[name="website"]');
      if (hp && hp.value) { showSuccess(); return; }

      if (errorEl) errorEl.classList.remove("is-visible");
      var submitBtn = form.querySelector('button[type="submit"]');
      var origText = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Odesílám…"; }

      var done = function (ok) {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = origText; }
        if (ok) { showSuccess(); }
        else if (errorEl) { errorEl.classList.add("is-visible"); }
      };

      if (!FORM_ENDPOINT) {
        // Lokální náhled bez backendu.
        setTimeout(function () { done(true); }, 500);
        return;
      }

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      })
        .then(function (r) { done(r.ok); })
        .catch(function () { done(false); });

      function showSuccess() {
        if (successEl) {
          form.style.display = "none";
          successEl.classList.add("is-visible");
          successEl.setAttribute("tabindex", "-1");
          successEl.focus();
        }
      }
    });
  });

  /* ---------- Rok v patičce ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
