(function(){
  'use strict';

  var STORAGE_KEY = 'sw_cookie_consent';

  function updateGA(granted){
    if(typeof gtag === 'function'){
      gtag('consent','update',{
        analytics_storage: granted ? 'granted' : 'denied'
      });
    }
  }

  function removeBanner(){
    var b = document.getElementById('sw-cookie-banner');
    if(b){ b.remove(); }
  }

  function accept(){
    localStorage.setItem(STORAGE_KEY,'accepted');
    updateGA(true);
    removeBanner();
  }

  function reject(){
    localStorage.setItem(STORAGE_KEY,'rejected');
    removeBanner();
  }

  function showBanner(){
    var css = '<style>' +
      '#sw-cookie-banner{' +
        'position:fixed;bottom:0;left:0;right:0;z-index:99999;' +
        'background:#0a1a15;border-top:1px solid rgba(37,211,102,0.25);' +
        'padding:16px 24px;display:flex;align-items:center;gap:16px;' +
        'flex-wrap:wrap;justify-content:space-between;' +
        'transform:translateY(100%);transition:transform 0.35s ease;' +
        'font-family:DM Sans,sans-serif;font-size:14px;color:rgba(255,255,255,0.8);' +
        'box-shadow:0 -4px 24px rgba(0,0,0,0.3);' +
      '}' +
      '#sw-cookie-banner.sw-cb-visible{transform:translateY(0)}' +
      '#sw-cookie-banner a{color:#25D366;text-decoration:underline}' +
      '.sw-cb-text{flex:1;min-width:200px}' +
      '.sw-cb-btns{display:flex;gap:10px;flex-shrink:0}' +
      '.sw-cb-reject{' +
        'padding:9px 18px;font-size:13px;font-weight:400;cursor:pointer;' +
        'background:transparent;border:none;color:rgba(255,255,255,0.55);' +
        'font-family:inherit;text-decoration:underline;text-underline-offset:2px' +
      '}' +
      '.sw-cb-reject:hover{color:rgba(255,255,255,0.8)}' +
      '.sw-cb-accept{' +
        'padding:9px 18px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;' +
        'background:#25D366;border:none;color:#0a1a15;' +
        'font-family:inherit;transition:background 0.2s' +
      '}' +
      '.sw-cb-accept:hover{background:#1ebe58}' +
      '@media(max-width:520px){' +
        '#sw-cookie-banner{flex-direction:column;align-items:flex-start;gap:12px}' +
        '.sw-cb-btns{width:100%}' +
        '.sw-cb-accept{flex:1;text-align:center}' +
      '}' +
    '</style>';

    var html = css +
      '<div id="sw-cookie-banner">' +
        '<div class="sw-cb-text">' +
          'We use Google Analytics. No cookies without your consent. ' +
          '<a href="privacy-policy.html">Privacy policy</a>' +
        '</div>' +
        '<div class="sw-cb-btns">' +
          '<button class="sw-cb-reject" id="sw-cb-reject-btn">Reject</button>' +
          '<button class="sw-cb-accept" id="sw-cb-accept-btn">Accept &amp; continue</button>' +
        '</div>' +
      '</div>';

    document.body.insertAdjacentHTML('beforeend', html);

    // Slide up after a short delay
    setTimeout(function(){
      var b = document.getElementById('sw-cookie-banner');
      if(b){ b.classList.add('sw-cb-visible'); }
    }, 120);

    document.getElementById('sw-cb-accept-btn').addEventListener('click', accept);
    document.getElementById('sw-cb-reject-btn').addEventListener('click', reject);
  }

  // Exposed globally so footer "Cookie preferences" link can call it
  window.resetCookieConsent = function(){
    localStorage.removeItem(STORAGE_KEY);
    removeBanner(); // in case somehow already shown
    showBanner();
  };

  // On load: restore consent if already set, otherwise show banner
  function init(){
    var existing = localStorage.getItem(STORAGE_KEY);
    if(existing === 'accepted'){
      updateGA(true);
      return;
    }
    if(existing === 'rejected'){
      return;
    }
    // No decision yet — show banner
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }

  init();
})();
