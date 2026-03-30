/**
 * inject-button.js
 *
 * Injects the "🧮 GPA" floating button at the top-centre of the page
 * (position: fixed) so it is always visible regardless of the host
 * page's navigation structure.
 */

(function () {
  'use strict';

  const BUTTON_ID = 'infinite-gpa-btn';

  function injectGPAButton(onClickHandler) {
    if (document.getElementById(BUTTON_ID)) return;

    const btn = document.createElement('button');
    btn.id = BUTTON_ID;
    btn.className = 'igpa-nav-btn';
    btn.title = 'Calculate GPA (Ctrl+Shift+G)';
    btn.setAttribute('aria-label', 'Open GPA Calculator');
    btn.innerHTML = `
      <span class="igpa-btn-icon">🧮</span>
      <span class="igpa-btn-label">GPA</span>
    `;

    if (typeof onClickHandler === 'function') {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        onClickHandler(e);
      });
    }

    (document.body || document.documentElement).appendChild(btn);
  }

  // Expose on window for content.js to call if needed
  window.__igpaInjectButton = injectGPAButton;
})();
