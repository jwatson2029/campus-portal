/**
 * inject-button.js
 *
 * Standalone helper module (also importable independently) that handles
 * only the nav-bar button injection.  content.js imports the logic here
 * inline, but this file can be loaded separately for debugging.
 */

(function () {
  'use strict';

  const BUTTON_ID = 'infinite-gpa-btn';

  const NAV_SELECTORS = [
    '.header-icons',
    '.ic-header__icons',
    '[class*="header"] [class*="icons"]',
    'header nav',
    '.app-header .right',
    '.header .right-section',
    'ic-header-button',
    '#header .icons',
    '.topNav .right'
  ];

  function findNav() {
    for (const sel of NAV_SELECTORS) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function injectGPAButton(onClickHandler) {
    if (document.getElementById(BUTTON_ID)) return;

    const nav = findNav();
    if (!nav) return;

    const btn = document.createElement('button');
    btn.id = BUTTON_ID;
    btn.className = 'header-icon-button igpa-nav-btn';
    btn.title = 'Calculate GPA (Ctrl+Shift+G)';
    btn.setAttribute('aria-label', 'Open GPA Calculator');
    btn.innerHTML = `
      <i class="fa fa-calculator" aria-hidden="true"></i>
      <span class="igpa-btn-label ml-1 text-sm font-medium">GPA</span>
    `;

    if (typeof onClickHandler === 'function') {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        onClickHandler(e);
      });
    }

    const bell = nav.querySelector(
      '[class*="bell"], [class*="notif"], [aria-label*="notification" i]'
    );
    if (bell) {
      nav.insertBefore(btn, bell);
    } else {
      nav.appendChild(btn);
    }
  }

  // Expose on window for content.js to call if needed
  window.__igpaInjectButton = injectGPAButton;
})();
