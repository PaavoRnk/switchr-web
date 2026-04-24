/**
 * language.js — Switchr language detection & routing
 * Loaded on EN pages only (NOT on /es/ pages, NOT on processing.html or results.html)
 */
(function () {
  'use strict';

  var EN_TO_ES = {
    '/index.html':        '/es/index.html',
    '/':                  '/es/index.html',
    '/how-it-works.html': '/es/how-it-works.html',
    '/contact.html':      '/es/contact.html',
    '/sample-report.html':'/es/sample-report.html',
  };

  function getESEquivalent(path) {
    // Blog paths: /blog/... → /es/blog/...
    if (path.startsWith('/blog/')) {
      return '/es' + path;
    }
    return EN_TO_ES[path] || '/es/index.html';
  }

  var stored = localStorage.getItem('sw_lang');

  if (!stored) {
    if (navigator.language && navigator.language.toLowerCase().startsWith('es')) {
      localStorage.setItem('sw_lang', 'es');
      window.location.replace(getESEquivalent(window.location.pathname));
      return;
    } else {
      localStorage.setItem('sw_lang', 'en');
    }
  } else if (stored === 'es') {
    // User prefers Spanish — redirect to ES equivalent
    window.location.replace(getESEquivalent(window.location.pathname));
    return;
  }
  // stored === 'en' → stay on this page

  // Expose language switch function for EN nav toggle
  window.switchLang = function (lang) {
    localStorage.setItem('sw_lang', lang);
    if (lang === 'es') {
      window.location.href = getESEquivalent(window.location.pathname);
    }
    // lang === 'en' → already on EN page, no redirect needed
  };
}());
