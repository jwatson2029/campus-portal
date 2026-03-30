/**
 * content.js — Main content script injected into every Infinite Campus page.
 *
 * Responsibilities:
 *  1. Inject the "🧮 GPA" button into the Infinite Campus navigation bar
 *  2. Parse grades from notifications + grade tables
 *  3. Open / close the GPA modal
 *  4. Keep everything in sync via MutationObserver
 */

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS & HELPERS
═══════════════════════════════════════════════════════════════ */

const LOG = (...args) => console.log('[GPA Calc]', ...args);
const WARN = (...args) => console.warn('[GPA Calc]', ...args);

const BUTTON_ID   = 'infinite-gpa-btn';
const MODAL_ID    = 'infinite-gpa-modal';
const OVERLAY_ID  = 'infinite-gpa-overlay';

/* ═══════════════════════════════════════════════════════════════
   GRADE PARSING ENGINE
═══════════════════════════════════════════════════════════════ */

/**
 * Regex to match:
 *   "James has an updated grade of 82 (81.79%) in Literature & Composition II: Course Average"
 */
const GRADE_REGEX = /updated grade of (\d+(?:\.\d+)?)\s*\((\d+(?:\.\d+)?)%\)\s*in\s+(.+?)(?:\s*:\s*(Course Average|Semester\s+\d+\s+Average|9\s*WEEKS?|Semester Average))?$/i;

/**
 * Regex to match assignment scores (lower priority than course averages):
 *   "James received a score of 100 out of 100 on NoRedInk Practice in Literature & Composition II"
 */
const ASSIGNMENT_REGEX = /received a score of (\d+(?:\.\d+)?)\s+out of\s+(\d+(?:\.\d+)?)\s+on\s+.+?\s+in\s+(.+)$/i;

/**
 * Parse a single notification text node.
 * Returns { courseName, pct, type } or null.
 */
function parseNotificationText(text) {
  if (!text) return null;
  text = text.trim();

  const gm = GRADE_REGEX.exec(text);
  if (gm) {
    return {
      courseName: gm[3].trim(),
      pct: parseFloat(gm[2]),
      rawGrade: parseFloat(gm[1]),
      type: gm[4] ? gm[4].trim() : 'Course Average',
      source: 'notification-average'
    };
  }

  const am = ASSIGNMENT_REGEX.exec(text);
  if (am) {
    const score = parseFloat(am[1]);
    const total = parseFloat(am[2]);
    return {
      courseName: am[3].trim(),
      pct: total > 0 ? Math.round((score / total) * 10000) / 100 : 0,
      rawGrade: score,
      type: 'Assignment',
      source: 'notification-assignment'
    };
  }

  return null;
}

/**
 * Collect grades from all notification elements on the page.
 * Deduplicates by course name — keeps Course Average over Assignment when both exist.
 */
function parseGradesFromNotifications() {
  const courseMap = new Map(); // courseName → gradeEntry

  const notifEls = document.querySelectorAll(
    '.notification__text, [class*="notification"] a, [class*="notification"] span'
  );

  notifEls.forEach((el) => {
    const text = el.textContent || el.innerText || '';
    const entry = parseNotificationText(text);
    if (!entry) return;

    const key = entry.courseName.toLowerCase();
    const existing = courseMap.get(key);

    // Priority: Course/Semester average > assignment score
    if (!existing) {
      courseMap.set(key, entry);
    } else if (
      existing.source === 'notification-assignment' &&
      entry.source === 'notification-average'
    ) {
      courseMap.set(key, entry); // upgrade to average
    }
    // If existing is already an average, keep it (first = most recent in DOM order)
  });

  return Array.from(courseMap.values());
}

/**
 * Fallback: try to extract grades from the grades iframe / table.
 * Looks for percentage text near course name text.
 */
function parseGradesFromTable() {
  const courses = [];
  const frames = [document, ...Array.from(document.querySelectorAll('iframe')).map(f => {
    try { return f.contentDocument; } catch (_) { return null; }
  }).filter(Boolean)];

  frames.forEach(doc => {
    // Look for rows that contain both a course name and a percentage
    const rows = doc.querySelectorAll('tr, .course-row, [class*="grade-row"]');
    rows.forEach(row => {
      const text = row.textContent || '';
      const pctMatch = /(\d+(?:\.\d+)?)\s*%/.exec(text);
      if (!pctMatch) return;

      // Try to extract a course name from the first cell
      const cells = row.querySelectorAll('td, th, [class*="course"], [class*="name"]');
      if (cells.length === 0) return;
      const courseName = cells[0].textContent.trim();
      if (!courseName || courseName.length < 3) return;

      const pct = parseFloat(pctMatch[1]);
      if (pct < 0 || pct > 110) return; // sanity check

      courses.push({
        courseName,
        pct,
        rawGrade: pct,
        type: 'Table',
        source: 'table'
      });
    });
  });

  return courses;
}

/**
 * Master parse function.
 * Tries notifications first; falls back to table parsing.
 */
function parseAllGrades() {
  const notifGrades = parseGradesFromNotifications();
  if (notifGrades.length > 0) {
    LOG(`Parsed ${notifGrades.length} courses from notifications.`);
    return notifGrades;
  }

  const tableGrades = parseGradesFromTable();
  if (tableGrades.length > 0) {
    LOG(`Parsed ${tableGrades.length} courses from grade table (fallback).`);
    return tableGrades;
  }

  WARN('No grades found on page. Check the Grades tab or open the notifications panel.');
  return [];
}

/* ═══════════════════════════════════════════════════════════════
   GPA CALCULATION ENGINE
═══════════════════════════════════════════════════════════════ */

/** Standard 4.0 unweighted scale */
function pctToUnweightedPoints(pct) {
  if (pct >= 90) return 4.0;
  if (pct >= 80) return 3.0;
  if (pct >= 70) return 2.0;
  if (pct >= 60) return 1.0;
  return 0.0;
}

/** Auto-detect weighting boost for a course name */
function getWeightBoost(courseName) {
  const lower = courseName.toLowerCase();
  if (/\bap\b|advanced placement/i.test(lower)) return 1.0;
  if (/honors|concept\s*&\s*connect|concept and connect/i.test(lower)) return 0.5;
  return 0.0;
}

/** Convert percentage to letter grade */
function pctToLetter(pct) {
  if (pct >= 90) return 'A';
  if (pct >= 80) return 'B';
  if (pct >= 70) return 'C';
  if (pct >= 60) return 'D';
  return 'F';
}

/**
 * Main GPA calculation.
 * Returns { unweighted, weighted, courses }
 */
function calculateGPA(grades) {
  if (grades.length === 0) {
    return { unweighted: null, weighted: null, courses: [] };
  }

  const courses = grades.map(g => {
    const unweightedPts = pctToUnweightedPoints(g.pct);
    const boost = getWeightBoost(g.courseName);
    const weightedPts = unweightedPts > 0 ? Math.min(5.0, unweightedPts + boost) : 0.0; // no boost on F
    return {
      ...g,
      letter: pctToLetter(g.pct),
      unweightedPoints: unweightedPts,
      weightBoost: boost,
      weightedPoints: weightedPts,
      credits: 1
    };
  });

  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);
  const unweighted = courses.reduce((s, c) => s + c.unweightedPoints * c.credits, 0) / totalCredits;
  const weighted   = courses.reduce((s, c) => s + c.weightedPoints  * c.credits, 0) / totalCredits;

  return {
    unweighted: Math.round(unweighted * 1000) / 1000,
    weighted:   Math.round(weighted   * 1000) / 1000,
    courses,
    totalCredits,
    calculatedAt: new Date().toISOString()
  };
}

/* ═══════════════════════════════════════════════════════════════
   MODAL (inline — injected into the page DOM)
═══════════════════════════════════════════════════════════════ */

function buildModalHTML(result) {
  const { unweighted, weighted, courses, totalCredits, calculatedAt } = result;

  const noGrades = !courses || courses.length === 0;
  const ts = calculatedAt ? new Date(calculatedAt).toLocaleString() : '—';

  const rowsHTML = noGrades
    ? `<tr><td colspan="5" class="igpa-empty">No grades found yet — check your Grades tab.</td></tr>`
    : courses.map(c => `
        <tr>
          <td class="igpa-course-name">${escapeHTML(c.courseName)}</td>
          <td>${c.pct.toFixed(2)}%</td>
          <td><span class="igpa-letter igpa-letter-${c.letter}">${c.letter}</span></td>
          <td>${c.unweightedPoints.toFixed(1)}</td>
          <td>${c.weightedPoints.toFixed(1)}${c.weightBoost > 0 ? `<sup class="igpa-boost">+${c.weightBoost}</sup>` : ''}</td>
        </tr>`).join('');

  return `
<div id="${OVERLAY_ID}" class="igpa-overlay" role="dialog" aria-modal="true" aria-label="GPA Calculator">
  <div id="${MODAL_ID}" class="igpa-modal" tabindex="-1">
    <!-- Header -->
    <div class="igpa-modal-header">
      <div class="igpa-header-left">
        <span class="igpa-logo">🧮</span>
        <span class="igpa-title">Infinite GPA Calculator</span>
      </div>
      <div class="igpa-header-right">
        <button id="igpa-close-btn" class="igpa-icon-btn igpa-close" title="Close" aria-label="Close">✕</button>
      </div>
    </div>

    <!-- GPA Summary Cards -->
    <div class="igpa-summary">
      <div class="igpa-card igpa-card-uw">
        <div class="igpa-card-label">Unweighted GPA</div>
        <div class="igpa-card-value">${unweighted !== null ? unweighted.toFixed(3) : '—'}</div>
        <div class="igpa-card-sub">Standard 4.0 scale</div>
      </div>
      <div class="igpa-card igpa-card-w">
        <div class="igpa-card-label">Weighted GPA</div>
        <div class="igpa-card-value">${weighted !== null ? weighted.toFixed(3) : '—'}</div>
        <div class="igpa-card-sub">AP +1.0 · Honors +0.5</div>
      </div>
      <div class="igpa-card igpa-card-info">
        <div class="igpa-card-label">Courses</div>
        <div class="igpa-card-value">${courses ? courses.length : 0}</div>
        <div class="igpa-card-sub">${totalCredits || 0} total credit(s)</div>
      </div>
    </div>

    <!-- Timestamp + Refresh -->
    <div class="igpa-toolbar">
      <span class="igpa-ts">Last updated: ${ts}</span>
      <div class="igpa-toolbar-actions">
        <button id="igpa-refresh-btn" class="igpa-btn igpa-btn-secondary">🔄 Refresh Grades</button>
        <button id="igpa-export-csv"  class="igpa-btn igpa-btn-secondary">⬇ CSV</button>
        <button id="igpa-export-json" class="igpa-btn igpa-btn-secondary">⬇ JSON</button>
      </div>
    </div>

    <!-- Course Table -->
    <div class="igpa-table-wrap">
      <table class="igpa-table" id="igpa-course-table">
        <thead>
          <tr>
            <th data-col="courseName">Course <span class="igpa-sort-icon">↕</span></th>
            <th data-col="pct">Grade % <span class="igpa-sort-icon">↕</span></th>
            <th data-col="letter">Letter</th>
            <th data-col="unweightedPoints">UW Pts <span class="igpa-sort-icon">↕</span></th>
            <th data-col="weightedPoints">W Pts <span class="igpa-sort-icon">↕</span></th>
          </tr>
        </thead>
        <tbody id="igpa-tbody">
          ${rowsHTML}
        </tbody>
      </table>
    </div>

    <div class="igpa-footer">
      Infinite GPA Calculator · Press <kbd>Ctrl+Shift+G</kbd> to toggle
    </div>
  </div>
</div>`;
}

/** Simple HTML escaper */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ═══════════════════════════════════════════════════════════════
   EXPORT HELPERS
═══════════════════════════════════════════════════════════════ */

function exportCSV(courses) {
  const header = 'Course,Grade %,Letter,Unweighted Points,Weighted Points,Boost\n';
  const rows = courses.map(c =>
    `"${c.courseName}",${c.pct.toFixed(2)},${c.letter},${c.unweightedPoints},${c.weightedPoints},${c.weightBoost}`
  ).join('\n');
  downloadBlob(header + rows, 'gpa-export.csv', 'text/csv');
}

function exportJSON(result) {
  downloadBlob(JSON.stringify(result, null, 2), 'gpa-export.json', 'application/json');
}

function downloadBlob(content, filename, mime) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: mime }));
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ═══════════════════════════════════════════════════════════════
   TABLE SORTING
═══════════════════════════════════════════════════════════════ */

let _sortState = { col: null, dir: 1 };

function attachTableSorting(courses) {
  const ths = document.querySelectorAll('#igpa-course-table thead th[data-col]');
  ths.forEach(th => {
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      if (_sortState.col === col) {
        _sortState.dir *= -1;
      } else {
        _sortState.col = col;
        _sortState.dir = 1;
      }
      const sorted = [...courses].sort((a, b) => {
        const av = a[col], bv = b[col];
        if (typeof av === 'string') return _sortState.dir * av.localeCompare(bv);
        return _sortState.dir * (av - bv);
      });
      const tbody = document.getElementById('igpa-tbody');
      if (!tbody) return;
      tbody.innerHTML = sorted.map(c => `
        <tr>
          <td class="igpa-course-name">${escapeHTML(c.courseName)}</td>
          <td>${c.pct.toFixed(2)}%</td>
          <td><span class="igpa-letter igpa-letter-${c.letter}">${c.letter}</span></td>
          <td>${c.unweightedPoints.toFixed(1)}</td>
          <td>${c.weightedPoints.toFixed(1)}${c.weightBoost > 0 ? `<sup class="igpa-boost">+${c.weightBoost}</sup>` : ''}</td>
        </tr>`).join('');
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   MODAL LIFECYCLE
═══════════════════════════════════════════════════════════════ */

let _lastResult = null;

function openModal() {
  if (document.getElementById(OVERLAY_ID)) {
    document.getElementById(OVERLAY_ID).style.display = 'flex';
    return;
  }

  const grades  = parseAllGrades();
  _lastResult   = calculateGPA(grades);

  const wrapper = document.createElement('div');
  wrapper.innerHTML = buildModalHTML(_lastResult);
  document.body.appendChild(wrapper.firstElementChild);

  // Save snapshot to history
  chrome.runtime.sendMessage({
    action: 'SAVE_HISTORY',
    entry: { ..._lastResult, url: location.href }
  });

  bindModalEvents(_lastResult);
}

function closeModal() {
  const overlay = document.getElementById(OVERLAY_ID);
  if (overlay) overlay.style.display = 'none';
}

function refreshModal() {
  const overlay = document.getElementById(OVERLAY_ID);
  if (overlay) overlay.remove();
  openModal();
}

function bindModalEvents(result) {
  // Close
  document.getElementById('igpa-close-btn')?.addEventListener('click', closeModal);
  document.getElementById(OVERLAY_ID)?.addEventListener('click', (e) => {
    if (e.target.id === OVERLAY_ID) closeModal();
  });

  // Refresh
  document.getElementById('igpa-refresh-btn')?.addEventListener('click', () => {
    LOG('Manual refresh triggered.');
    refreshModal();
  });

  // Export
  document.getElementById('igpa-export-csv')?.addEventListener('click', () => {
    if (result.courses?.length) exportCSV(result.courses);
  });
  document.getElementById('igpa-export-json')?.addEventListener('click', () => {
    exportJSON(result);
  });

  // Table sorting
  if (result.courses?.length) attachTableSorting(result.courses);

  // Keyboard close
  document.addEventListener('keydown', handleKeyDown);
}

function handleKeyDown(e) {
  if (e.key === 'Escape') closeModal();
}

/* ═══════════════════════════════════════════════════════════════
   NAV-BAR BUTTON (injected into the Infinite Campus header)
═══════════════════════════════════════════════════════════════ */

/**
 * Inject the GPA button into the Infinite Campus navigation bar.
 * Delegates to the __igpaInjectButton helper exposed by inject-button.js,
 * which is loaded before this script.
 */
function injectNavButton() {
  if (typeof window.__igpaInjectButton === 'function') {
    window.__igpaInjectButton((e) => {
      e.stopPropagation();
      const overlay = document.getElementById(OVERLAY_ID);
      if (overlay) {
        overlay.style.display = overlay.style.display === 'none' ? 'flex' : 'none';
      } else {
        openModal();
      }
    });
    LOG('Nav GPA button injected.');
  }
}

/* ═══════════════════════════════════════════════════════════════
   MUTATION OBSERVER + POLLING FALLBACK
═══════════════════════════════════════════════════════════════ */

let _observer = null;

function startObserver() {
  if (_observer) return;
  _observer = new MutationObserver(() => {
    // Re-inject nav button if it was removed from the DOM
    if (!document.getElementById(BUTTON_ID)) injectNavButton();

    // If modal is open, update grades
    const overlay = document.getElementById(OVERLAY_ID);
    if (overlay && overlay.style.display !== 'none') {
      const newGrades = parseAllGrades();
      if (newGrades.length > 0) {
        const newResult = calculateGPA(newGrades);
        // Only refresh if GPA changed meaningfully
        if (_lastResult &&
            Math.abs((newResult.unweighted || 0) - (_lastResult.unweighted || 0)) > 0.001) {
          LOG('New grades detected — recalculating...');
          refreshModal();
        }
      }
    }
  });

  _observer.observe(document.body, { childList: true, subtree: true });
  LOG('MutationObserver started.');
}

/* ═══════════════════════════════════════════════════════════════
   INITIALISATION
═══════════════════════════════════════════════════════════════ */

async function init() {
  LOG('Initialising on', location.href);

  // Inject nav button (waits for body to be ready)
  if (document.body) {
    injectNavButton();
  } else {
    document.addEventListener('DOMContentLoaded', injectNavButton, { once: true });
  }

  // Auto-calculate on page load
  window.addEventListener('load', () => {
    const grades = parseAllGrades();
    if (grades.length > 0) {
      _lastResult = calculateGPA(grades);
      LOG('Auto-calculated GPA:', _lastResult.unweighted, '/', _lastResult.weighted);
    }
  }, { once: true });

  startObserver();
}

// Listen for keyboard shortcut from background.js
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'TOGGLE_GPA_MODAL') {
    const overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
      overlay.style.display = overlay.style.display === 'none' ? 'flex' : 'none';
    } else {
      openModal();
    }
  }
});

// Kick off
init();
