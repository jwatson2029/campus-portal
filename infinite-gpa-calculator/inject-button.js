(function () {
  'use strict';

  const BUTTON_ID = 'infinite-gpa-btn';

  function injectGPAButton(onClickHandler) {
    if (document.getElementById(BUTTON_ID)) return;

    const iconSrc =
      typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL
        ? chrome.runtime.getURL('icons/icon-48.png')
        : '';

    const btn = document.createElement('button');
    btn.id = BUTTON_ID;
    btn.className = 'igpa-nav-btn';
    btn.title = 'Studently — toggle (⌘⇧G / Ctrl+Shift+G)';
    btn.setAttribute('aria-label', 'Open Studently');
    btn.innerHTML = `
      <span class="igpa-btn-icon" aria-hidden="true"><img src="${iconSrc}" alt="" width="18" height="18" class="igpa-btn-icon-img" /></span>
      <span class="igpa-btn-label" aria-hidden="true">My GPA</span>
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
