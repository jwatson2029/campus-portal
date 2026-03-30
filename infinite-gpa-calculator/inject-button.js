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
      <span class="igpa-btn-icon" aria-hidden="true">🧮</span>
      <span class="igpa-btn-label" aria-hidden="true">GPA</span>
    `;

    if (typeof onClickHandler === 'function') {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        onClickHandler(e);
      });
    }

    (document.body || document.documentElement).appendChild(btn);
  }

  window.__igpaInjectButton = injectGPAButton;
})();
