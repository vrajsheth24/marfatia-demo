/* ============================================================
   partials.js — Fetches header.html and footer.html and
   injects them into #site-header and #site-footer placeholders.
   Usage: Add these placeholders to every page:
     <div id="site-header"></div>   <!-- before <main> -->
     <div id="site-footer"></div>   <!-- after </main> -->
   Then include this script BEFORE main.js:
     <script src="js/partials.js"></script>
   ============================================================ */
(function () {
  'use strict';

  // Resolve the base path so fetch works even from subdirectories.
  // We assume partials.js lives at root/js/partials.js and
  // header.html / footer.html live at root/header.html etc.
  var scriptSrc = (document.currentScript && document.currentScript.src) || '';
  var base = scriptSrc.replace(/\/js\/partials\.js.*$/, '/');

  function loadPartial(url, targetId, callback) {
    var el = document.getElementById(targetId);
    if (!el) return;
    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('Failed to load ' + url);
        return r.text();
      })
      .then(function (html) {
        el.outerHTML = html;           // replace placeholder with real markup
        if (typeof callback === 'function') callback();
      })
      .catch(function (e) { console.warn('[partials.js]', e); });
  }

  // Track how many partials have loaded so we fire DOMContentLoaded-style
  // scripts (main.js etc.) only after both are in the DOM.
  var loaded = 0;
  var total = 2;
  function onPartialLoaded() {
    loaded++;
    if (loaded >= total) {
      // Dispatch a custom event so main.js can wait if needed
      document.dispatchEvent(new Event('partials:ready'));
    }
  }

  // Load as early as possible — this script should be in <head> or
  // right after <body> with defer / at top of body.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    loadPartial(base + 'header.html', 'site-header', onPartialLoaded);
    loadPartial(base + 'footer.html', 'site-footer', onPartialLoaded);
  }
})();
