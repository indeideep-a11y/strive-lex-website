// Strive Lex — shared behavior
document.addEventListener('DOMContentLoaded', function () {

  // ===== Mandatory entry disclaimer =====
  // Draft wording pending review by a qualified Indian legal professional.
  // Consent is remembered in this browser for 24 hours so it does not
  // reappear on every page during the same visit.
  (function () {
    var STORAGE_KEY = 'strivelex_disclaimer_ack';
    var VALID_HOURS = 24;
    var overlay = document.querySelector('#disclaimer-overlay');
    var exitOverlay = document.querySelector('#disclaimer-exit');
    var agreeBtn = document.querySelector('#disclaimer-agree');
    var disagreeBtn = document.querySelector('#disclaimer-disagree');
    var reconsiderBtn = document.querySelector('#disclaimer-reconsider');
    if (!overlay) return; // page has no disclaimer markup

    function hasValidConsent() {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;
        var savedAt = parseInt(raw, 10);
        if (isNaN(savedAt)) return false;
        var hoursElapsed = (Date.now() - savedAt) / (1000 * 60 * 60);
        return hoursElapsed >= 0 && hoursElapsed < VALID_HOURS;
      } catch (err) {
        // localStorage unavailable (private browsing, etc.) — fail safe by showing the notice
        return false;
      }
    }

    function lockScroll() { document.body.classList.add('disclaimer-locked'); }
    function unlockScroll() { document.body.classList.remove('disclaimer-locked'); }

    function showAgreeOverlay() {
      exitOverlay.style.display = 'none';
      overlay.style.display = 'flex';
      lockScroll();
    }

    if (hasValidConsent()) {
      overlay.style.display = 'none';
      unlockScroll();
    } else {
      overlay.style.display = 'flex';
      lockScroll();
    }

    if (agreeBtn) {
      agreeBtn.addEventListener('click', function () {
        try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch (err) {}
        overlay.style.display = 'none';
        unlockScroll();
      });
    }

    if (disagreeBtn) {
      disagreeBtn.addEventListener('click', function () {
        overlay.style.display = 'none';
        if (exitOverlay) exitOverlay.style.display = 'flex';
        lockScroll();
      });
    }

    if (reconsiderBtn) {
      reconsiderBtn.addEventListener('click', showAgreeOverlay);
    }
  })();

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  // Contact form: front-end only demo submission.
  // Replace this handler with a real backend/email service (e.g. Formspree, Netlify Forms, your own API) before going live.
  var form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = document.querySelector('#form-success');
      if (note) {
        note.style.display = 'block';
        form.reset();
      }
    });
  }

  // Highlight active nav link based on current page
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav.main-nav a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === path) link.classList.add('active');
  });
});
