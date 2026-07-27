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
  // Client-side validation (email/phone patterns) and spam mitigation (honeypot + minimum-fill-time
  // check) are handled here. True server-side validation and storage protection require the real
  // backend above to exist first — there is no database yet for invalid data to reach.
  var form = document.querySelector('#contact-form');
  if (form) {
    var loadedAtInput = document.querySelector('#form-loaded-at');
    if (loadedAtInput) { loadedAtInput.value = String(Date.now()); }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot: a field hidden from sighted users via off-screen positioning (not display:none,
      // which some bots detect and skip). Any value here means it was filled by a script, not a person.
      var honeypot = document.querySelector('#company');
      var isLikelySpam = !!(honeypot && honeypot.value.trim() !== '');

      // Minimum-fill-time check: genuine visitors take more than a few seconds to read and complete
      // the form; scripted submissions typically fire almost instantly after the page loads.
      if (!isLikelySpam && loadedAtInput && loadedAtInput.value) {
        var elapsedMs = Date.now() - parseInt(loadedAtInput.value, 10);
        if (elapsedMs < 3000) { isLikelySpam = true; }
      }

      if (isLikelySpam) {
        // Silently drop likely-spam submissions without a visible error, so scripts get no signal
        // about what tripped the check. Nothing is actually sent anywhere yet regardless (see note above).
        form.reset();
        if (loadedAtInput) { loadedAtInput.value = String(Date.now()); }
        return;
      }

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
