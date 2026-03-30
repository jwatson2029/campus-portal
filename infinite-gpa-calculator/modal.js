/**
 * modal.js — Script for modal.html (popup window / standalone page).
 *
 * When the extension popup is opened this script:
 *  1. Retrieves the latest cached GPA result from chrome.storage.sync
 *  2. Renders the summary cards + course list
 *  3. Provides buttons to open the full in-page calculator
 */

/* ── Helpers ────────────────────────────────────────────────── */

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Render ─────────────────────────────────────────────────── */

function renderPopup(entry) {
  const uwEl     = document.getElementById('popup-uw');
  const wEl      = document.getElementById('popup-w');
  const courses  = document.getElementById('popup-courses');
  const footer   = document.getElementById('popup-footer');

  if (!entry || !entry.courses || entry.courses.length === 0) {
    if (uwEl) uwEl.textContent = '—';
    if (wEl)  wEl.textContent  = '—';
    if (courses) {
      courses.innerHTML = `<div class="popup-no-grades">
        No grades found yet — visit your Grades tab on Infinite Campus.
      </div>`;
    }
    if (footer) footer.textContent = 'No data available.';
    return;
  }

  if (uwEl) uwEl.textContent = entry.unweighted != null ? entry.unweighted.toFixed(3) : '—';
  if (wEl)  wEl.textContent  = entry.weighted   != null ? entry.weighted.toFixed(3)   : '—';

  if (courses) {
    courses.innerHTML = entry.courses.map(c => `
      <div class="popup-course-row">
        <span class="popup-course-name" title="${escapeHTML(c.courseName)}">${escapeHTML(c.courseName)}</span>
        <div class="popup-course-meta">
          <span style="font-size:12px;color:var(--igpa-text-muted)">${c.pct.toFixed(1)}%</span>
          <span class="igpa-letter igpa-letter-${c.letter}">${c.letter}</span>
        </div>
      </div>
    `).join('');
  }

  if (footer) {
    const ts = entry.calculatedAt
      ? new Date(entry.calculatedAt).toLocaleString()
      : 'Unknown';
    footer.textContent = `Last updated: ${ts} · ${entry.courses.length} course(s)`;
  }
}

/* ── Load data from storage ─────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  // Load history → use most recent entry
  chrome.storage.sync.get(['history'], (data) => {
    const history = data.history || [];
    renderPopup(history[0] || null);
  });

  // Open full calculator by messaging the active tab
  document.getElementById('popup-open-page')?.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      chrome.tabs.sendMessage(tabs[0].id, { action: 'TOGGLE_GPA_MODAL' }, () => {
        // Suppress "no receiving end" error when the active tab is not an IC page
        void chrome.runtime.lastError;
        window.close();
      });
    });
  });
});
