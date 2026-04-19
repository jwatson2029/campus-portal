const LOG = (...args) => console.log('[Studently]', ...args);
const WARN = (...args) => console.warn('[Studently]', ...args);

const BUTTON_ID   = 'infinite-gpa-btn';
const MODAL_ID    = 'infinite-gpa-modal';
const OVERLAY_ID  = 'infinite-gpa-overlay';

const GRADE_REGEX = /updated grade of (\d+(?:\.\d+)?)\s*\((\d+(?:\.\d+)?)%\)\s*in\s+(.+?)(?:\s*:\s*(Course Average|Semester\s+\d+\s+Average|9\s*WEEKS?|Semester Average))?$/i;

const ASSIGNMENT_REGEX = /received a score of (\d+(?:\.\d+)?)\s+out of\s+(\d+(?:\.\d+)?)\s+on\s+.+?\s+in\s+(.+)$/i;

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

function parseGradesFromNotifications() {
  const courseMap = new Map(); 

  const notifEls = document.querySelectorAll(
    '.notification__text, [class*="notification"] a, [class*="notification"] span'
  );

  notifEls.forEach((el) => {
    const text = el.textContent || el.innerText || '';
    const entry = parseNotificationText(text);
    if (!entry) return;

    const key = entry.courseName.toLowerCase();
    const existing = courseMap.get(key);

    if (!existing) {
      courseMap.set(key, entry);
    } else if (
      existing.source === 'notification-assignment' &&
      entry.source === 'notification-average'
    ) {
      courseMap.set(key, entry); 
    }
    
  });

  return Array.from(courseMap.values());
}

function parseGradesFromTable() {
  const courses = [];
  const frames = [document, ...Array.from(document.querySelectorAll('iframe')).map(f => {
    try { return f.contentDocument; } catch (_) { return null; }
  }).filter(Boolean)];

  frames.forEach(doc => {
    
    const rows = doc.querySelectorAll('tr, .course-row, [class*="grade-row"]');
    rows.forEach(row => {
      const text = row.textContent || '';
      const pctMatch = /(\d+(?:\.\d+)?)\s*%/.exec(text);
      if (!pctMatch) return;

      const cells = row.querySelectorAll('td, th, [class*="course"], [class*="name"]');
      if (cells.length === 0) return;
      const courseName = cells[0].textContent.trim();
      if (!courseName || courseName.length < 3) return;

      const pct = parseFloat(pctMatch[1]);
      if (pct < 0 || pct > 110) return; 

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

function pctToUnweightedPoints(pct) {
  if (pct >= 90) return 4.0;
  if (pct >= 80) return 3.0;
  if (pct >= 70) return 2.0;
  if (pct >= 60) return 1.0;
  return 0.0;
}

function getWeightBoost(courseName) {
  const lower = courseName.toLowerCase();
  if (/\bap\b|advanced placement/i.test(lower)) return 1.0;
  if (/honors|concept\s*&\s*connect|concept and connect/i.test(lower)) return 0.5;
  return 0.0;
}

function pctToLetter(pct) {
  if (pct >= 90) return 'A';
  if (pct >= 80) return 'B';
  if (pct >= 70) return 'C';
  if (pct >= 60) return 'D';
  return 'F';
}

function calculateGPA(grades) {
  if (grades.length === 0) {
    return { unweighted: null, weighted: null, courses: [] };
  }

  const courses = grades.map(g => {
    const unweightedPts = pctToUnweightedPoints(g.pct);
    const boost = getWeightBoost(g.courseName);
    const weightedPts = unweightedPts > 0 ? Math.min(5.0, unweightedPts + boost) : 0.0; 
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

function buildCourseRowHTML(c) {
  return `
        <tr>
          <td class="igpa-course-name">
            <button class="igpa-course-select" data-course="${escapeAttr(c.courseName)}" data-pct="${c.pct.toFixed(2)}">${escapeHTML(c.courseName)}</button>
          </td>
          <td class="igpa-pct-cell">
            <div class="igpa-pct-bar-wrap">
              <span class="igpa-pct-label">${c.pct.toFixed(2)}%</span>
              <div class="igpa-pct-bar-bg">
                <div class="igpa-pct-bar grade-${c.letter}" style="width:${Math.min(c.pct, 100).toFixed(1)}%"></div>
              </div>
            </div>
          </td>
          <td><span class="igpa-letter igpa-letter-${c.letter}">${c.letter}</span></td>
          <td>${c.unweightedPoints.toFixed(1)}</td>
          <td>${c.weightedPoints.toFixed(1)}${c.weightBoost > 0 ? `<sup class="igpa-boost">+${c.weightBoost}</sup>` : ''}</td>
        </tr>`;
}

function buildModalHTML(result) {
  const { unweighted, weighted, courses, totalCredits, calculatedAt } = result;

  const noGrades = !courses || courses.length === 0;
  const ts = calculatedAt ? new Date(calculatedAt).toLocaleString() : '—';
  const isMac = navigator.platform?.toUpperCase().indexOf('MAC') >= 0;
  const shortcutKey = isMac ? '⌘⇧G' : 'Ctrl+Shift+G';

  const rowsHTML = noGrades
    ? `<tr><td colspan="5" class="igpa-empty">No grades found yet — check your Grades tab.</td></tr>`
    : courses.map(c => buildCourseRowHTML(c)).join('');

  return `
<div id="${OVERLAY_ID}" class="igpa-overlay" role="dialog" aria-modal="true" aria-label="Studently GPA Calculator">
  <div id="${MODAL_ID}" class="igpa-modal" tabindex="-1">
    <div class="igpa-modal-header">
      <div class="igpa-header-left">
        <div class="igpa-logo" aria-hidden="true">🧮</div>
        <div>
          <div class="igpa-title">Studently</div>
          <div class="igpa-title-sub">Infinite Campus grade tracker</div>
        </div>
      </div>
      <div class="igpa-header-right">
        <button id="igpa-refresh-btn" class="igpa-icon-btn" title="Refresh grades" aria-label="Refresh grades">↻</button>
        <button id="igpa-close-btn" class="igpa-icon-btn igpa-close" title="Close" aria-label="Close">✕</button>
      </div>
    </div>

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

    <div class="igpa-toolbar">
      <span class="igpa-ts">🕐 Last updated: ${ts}</span>
      <div class="igpa-toolbar-actions">
        <button id="igpa-export-csv"  class="igpa-btn igpa-btn-secondary igpa-btn-sm">⬇ CSV</button>
        <button id="igpa-export-json" class="igpa-btn igpa-btn-secondary igpa-btn-sm">⬇ JSON</button>
      </div>
    </div>

    <div class="igpa-table-wrap">
      <table class="igpa-table" id="igpa-course-table">
        <thead>
          <tr>
            <th data-col="courseName">Course <span class="igpa-sort-icon">↕</span></th>
            <th data-col="pct">Grade <span class="igpa-sort-icon">↕</span></th>
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
    ${buildWhatIfPanelHTML()}

    <div class="igpa-footer">
      <span>Studently</span>
      <span>·</span>
      <span>Press <kbd>${shortcutKey}</kbd> to toggle</span>
    </div>
  </div>
</div>`;
}

function buildWhatIfPanelHTML() {
  if (!_whatIfState.selectedCourseName) {
    return `
      <div id="igpa-whatif-panel" class="igpa-settings-panel">
        <div class="igpa-settings-title">What-If Calculator</div>
        <div class="igpa-empty">Click a class row above to simulate a score.</div>
      </div>
    `;
  }

  return `
    <div id="igpa-whatif-panel" class="igpa-settings-panel">
      <div class="igpa-settings-title">What-If Calculator: ${escapeHTML(_whatIfState.selectedCourseName)}</div>
      <div class="igpa-weight-row">
        <select id="igpa-whatif-category" class="igpa-input igpa-input-sm">
          <option value="formative">Formative</option>
          <option value="summative">Summative</option>
        </select>
        <input id="igpa-whatif-score" class="igpa-input igpa-input-sm" type="number" min="0" step="0.01" value="90" />
        <input id="igpa-whatif-max" class="igpa-input igpa-input-sm" type="number" min="1" step="0.01" value="100" />
        <button id="igpa-whatif-reset" class="igpa-btn igpa-btn-secondary igpa-btn-sm">Reset</button>
      </div>
      <div id="igpa-whatif-results" class="igpa-whatif-results">
        <div>Current: ${_whatIfState.selectedCourseBasePct.toFixed(2)}%</div>
        <div>New: ${_whatIfState.selectedCourseBasePct.toFixed(2)}%</div>
        <div class="igpa-delta-neutral">+0.00%</div>
      </div>
    </div>
  `;
}

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
let _whatIfState = {
  selectedCourseName: null,
  selectedCourseBasePct: null
};

function escapeAttr(str) {
  return escapeHTML(str).replace(/'/g, '&#39;');
}

function deriveClassDetailData(courseName, basePct) {
  const assignments = [];
  const escapedCourse = courseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const notifs = document.querySelectorAll('.notification__text, [class*="notification"] a, [class*="notification"] span');
  notifs.forEach((el) => {
    const text = (el.textContent || '').trim();
    if (!text || !new RegExp(`\\bin\\s+${escapedCourse}\\b`, 'i').test(text)) return;
    const am = ASSIGNMENT_REGEX.exec(text);
    if (!am) return;
    assignments.push({
      name: text,
      score: parseFloat(am[1]),
      max: parseFloat(am[2])
    });
  });

  const categories = { formative: [], summative: [] };
  assignments.forEach((a) => {
    const isSummative = /test|exam|summative|benchmark|final|midterm|unit/i.test(a.name);
    categories[isSummative ? 'summative' : 'formative'].push(a);
  });
  if (!categories.formative.length && assignments.length) categories.formative = [...assignments];

  return {
    className: courseName,
    currentGrade: basePct,
    categories,
    weights: { formative: 0.4, summative: 0.6 }
  };
}

function calculateCategoryAverage(category) {
  if (!category || !category.length) return 0;
  const earned = category.reduce((s, a) => s + a.score, 0);
  const total = category.reduce((s, a) => s + a.max, 0);
  return total > 0 ? earned / total : 0;
}

function calculateWeightedClassGrade(data) {
  const formativeAvg = calculateCategoryAverage(data.categories.formative);
  const summativeAvg = calculateCategoryAverage(data.categories.summative);
  const weighted = (formativeAvg * data.weights.formative) + (summativeAvg * data.weights.summative);
  return Math.round(weighted * 10000) / 100;
}

function simulateGrade(originalData, category, score, maxScore) {
  const cloned = JSON.parse(JSON.stringify(originalData));
  cloned.categories[category].push({ name: 'Simulated', score, max: maxScore });
  const newCategoryAverage = Math.round(calculateCategoryAverage(cloned.categories[category]) * 10000) / 100;
  const newOverallGrade = calculateWeightedClassGrade(cloned);
  const difference = Math.round((newOverallGrade - originalData.currentGrade) * 100) / 100;
  return { newCategoryAverage, newOverallGrade, difference };
}

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
      tbody.innerHTML = sorted.map(c => buildCourseRowHTML(c)).join('');
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
  bindWhatIfEvents();

  // Keyboard close
  document.addEventListener('keydown', handleKeyDown);
}

function updateWhatIfResults() {
  if (!_whatIfState.selectedCourseName) return;
  const category = document.getElementById('igpa-whatif-category')?.value || 'formative';
  const score = parseFloat(document.getElementById('igpa-whatif-score')?.value || '0');
  const max = parseFloat(document.getElementById('igpa-whatif-max')?.value || '0');
  if (!(score >= 0) || !(max > 0)) return;

  const classData = deriveClassDetailData(_whatIfState.selectedCourseName, _whatIfState.selectedCourseBasePct);
  const sim = simulateGrade(classData, category, score, max);
  const sign = sim.difference > 0 ? '+' : '';
  const deltaClass = sim.difference > 0 ? 'igpa-delta-positive' : sim.difference < 0 ? 'igpa-delta-negative' : 'igpa-delta-neutral';
  const results = document.getElementById('igpa-whatif-results');
  if (!results) return;
  results.innerHTML = `
    <div>Current: ${classData.currentGrade.toFixed(2)}%</div>
    <div>New: ${sim.newOverallGrade.toFixed(2)}%</div>
    <div class="${deltaClass}">${sign}${sim.difference.toFixed(2)}%</div>
  `;
}

function bindWhatIfEvents() {
  document.querySelectorAll('.igpa-course-select').forEach((btn) => {
    btn.addEventListener('click', () => {
      _whatIfState.selectedCourseName = btn.dataset.course || null;
      _whatIfState.selectedCourseBasePct = parseFloat(btn.dataset.pct || '0');
      const panel = document.getElementById('igpa-whatif-panel');
      if (panel) panel.outerHTML = buildWhatIfPanelHTML();
      bindWhatIfEvents();
      updateWhatIfResults();
    });
  });

  ['igpa-whatif-category', 'igpa-whatif-score', 'igpa-whatif-max'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', updateWhatIfResults);
  });

  document.getElementById('igpa-whatif-reset')?.addEventListener('click', () => {
    const category = document.getElementById('igpa-whatif-category');
    const score = document.getElementById('igpa-whatif-score');
    const max = document.getElementById('igpa-whatif-max');
    if (category) category.value = 'formative';
    if (score) score.value = '90';
    if (max) max.value = '100';
    updateWhatIfResults();
  });
}

function handleKeyDown(e) {
  if (e.key === 'Escape') closeModal();
}

/* ═══════════════════════════════════════════════════════════════
   FLOATING BUTTON (fixed top-centre of page)
═══════════════════════════════════════════════════════════════ */

/**
 * Inject the "🧮 GPA" floating button at the top of the page.
 * Delegates to the __igpaInjectButton helper exposed by inject-button.js,
 * which is loaded before this script.
 */
function injectFloatingButton() {
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
    LOG('GPA button injected.');
  }
}

/* ═══════════════════════════════════════════════════════════════
   MUTATION OBSERVER + POLLING FALLBACK
═══════════════════════════════════════════════════════════════ */

let _observer = null;

function startObserver() {
  if (_observer) return;
  _observer = new MutationObserver(() => {
    // Re-inject floating GPA button if it was removed from the DOM
    if (!document.getElementById(BUTTON_ID)) injectFloatingButton();

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

function init() {
  LOG('Initialising on', location.href);

  // Inject floating GPA button (waits for body to be ready)
  if (document.body) {
    injectFloatingButton();
  } else {
    document.addEventListener('DOMContentLoaded', injectFloatingButton, { once: true });
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
