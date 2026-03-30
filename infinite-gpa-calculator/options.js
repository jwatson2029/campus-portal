/**
 * options.js — Logic for the settings / options page (options.html).
 *
 * Handles:
 *  - Loading & saving settings via chrome.storage.sync
 *  - Rendering / editing the GPA scale table
 *  - Managing custom weighting rules
 *  - Displaying GPA history
 */

/* ── Default configuration ──────────────────────────────────── */

const DEFAULT_SCALE = [
  { min: 90, max: 100, letter: 'A', points: 4.0 },
  { min: 80, max: 89,  letter: 'B', points: 3.0 },
  { min: 70, max: 79,  letter: 'C', points: 2.0 },
  { min: 60, max: 69,  letter: 'D', points: 1.0 },
  { min: 0,  max: 59,  letter: 'F', points: 0.0 }
];

const DEFAULT_WEIGHTS = [
  { keyword: 'AP',                boost: 1.0 },
  { keyword: 'Advanced Placement', boost: 1.0 },
  { keyword: 'Honors',             boost: 0.5 },
  { keyword: 'Concept & Connect',  boost: 0.5 }
];

const DEFAULT_SETTINGS = {
  autoCalculate:  true,
  showButton:     true,
  customWeights:  DEFAULT_WEIGHTS,
  gpaScale:       DEFAULT_SCALE
};

/* ── State ──────────────────────────────────────────────────── */

let _settings = { ...DEFAULT_SETTINGS };

/* ── Helpers ────────────────────────────────────────────────── */

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showStatus(msg, isError = false) {
  const el = document.getElementById('opt-status');
  if (!el) return;
  el.textContent = msg;
  el.style.color = isError ? 'var(--igpa-f)' : 'var(--igpa-a)';
  setTimeout(() => { el.textContent = ''; }, 3000);
}

/* ── Render helpers ─────────────────────────────────────────── */

function renderScale(scale) {
  const tbody = document.querySelector('#opt-scale-table tbody');
  if (!tbody) return;
  tbody.innerHTML = scale.map((row, i) => `
    <tr>
      <td>${row.min}% – ${row.max}%</td>
      <td><strong>${escapeHTML(row.letter)}</strong></td>
      <td>
        <input
          type="number"
          step="0.5"
          min="0"
          max="5"
          value="${row.points}"
          data-scale-idx="${i}"
          aria-label="GPA points for ${row.letter}"
        />
      </td>
    </tr>
  `).join('');
}

function renderWeightRows(weights) {
  const container = document.getElementById('opt-weight-rows');
  if (!container) return;
  container.innerHTML = weights.map((w, i) => `
    <div class="opt-weight-row">
      <input
        class="igpa-input"
        type="text"
        placeholder="Course keyword"
        value="${escapeHTML(w.keyword)}"
        data-w-idx="${i}"
        data-w-field="keyword"
        aria-label="Weighting keyword ${i + 1}"
      />
      <input
        class="igpa-input igpa-input-sm"
        type="number"
        step="0.5"
        min="0"
        max="2"
        placeholder="Boost"
        value="${w.boost}"
        data-w-idx="${i}"
        data-w-field="boost"
        aria-label="GPA boost for keyword ${i + 1}"
      />
      <button
        class="igpa-btn igpa-btn-sm igpa-btn-danger"
        data-remove-weight="${i}"
        aria-label="Remove rule ${i + 1}"
      >✕</button>
    </div>
  `).join('');
}

function renderHistory(history) {
  const el = document.getElementById('opt-history-list');
  if (!el) return;

  if (!history || history.length === 0) {
    el.innerHTML = `<div style="color:var(--igpa-text-muted);font-size:13px;font-style:italic;">No history yet.</div>`;
    return;
  }

  el.innerHTML = history.map(entry => {
    const ts = entry.calculatedAt
      ? new Date(entry.calculatedAt).toLocaleString()
      : 'Unknown time';
    const uw = entry.unweighted != null ? entry.unweighted.toFixed(3) : '—';
    const w = entry.weighted != null ? entry.weighted.toFixed(3) : '—';
    const n  = entry.courses?.length || 0;
    return `
      <div class="opt-history-item">
        <div>
          <div class="opt-history-ts">${ts}</div>
          <div style="font-size:12px;color:var(--igpa-text-muted)">${n} course(s)</div>
        </div>
        <div class="opt-history-gpas">
          <span style="color:var(--igpa-accent)">UW ${uw}</span>
          &nbsp;·&nbsp;
          <span style="color:var(--igpa-a)">W ${w}</span>
        </div>
      </div>`;
  }).join('');
}

/* ── Collect current form values ─────────────────────────────── */

function collectSettings() {
  // Toggles
  _settings.autoCalculate = document.getElementById('opt-auto-calc')?.checked ?? true;
  _settings.showButton    = document.getElementById('opt-show-btn')?.checked  ?? true;

  // GPA scale
  const scaleInputs = document.querySelectorAll('#opt-scale-table input[data-scale-idx]');
  scaleInputs.forEach(input => {
    const idx = parseInt(input.dataset.scaleIdx, 10);
    if (_settings.gpaScale[idx] !== undefined) {
      _settings.gpaScale[idx].points = parseFloat(input.value) || 0;
    }
  });

  // Custom weights
  const rows = document.querySelectorAll('.opt-weight-row');
  _settings.customWeights = [];
  rows.forEach(row => {
    const kw = row.querySelector('[data-w-field="keyword"]')?.value.trim();
    const bv = parseFloat(row.querySelector('[data-w-field="boost"]')?.value || 0);
    if (kw) _settings.customWeights.push({ keyword: kw, boost: bv });
  });

  return _settings;
}

/* ── DOM ready ───────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  // Load settings
  chrome.storage.sync.get(['settings', 'history'], (data) => {
    _settings = Object.assign({}, DEFAULT_SETTINGS, data.settings || {});
    if (!_settings.gpaScale || _settings.gpaScale.length === 0) {
      _settings.gpaScale = DEFAULT_SCALE;
    }
    if (!_settings.customWeights) {
      _settings.customWeights = DEFAULT_WEIGHTS;
    }

    // Populate form
    const autoCalcEl = document.getElementById('opt-auto-calc');
    const showBtnEl  = document.getElementById('opt-show-btn');
    if (autoCalcEl) autoCalcEl.checked = _settings.autoCalculate !== false;
    if (showBtnEl)  showBtnEl.checked  = _settings.showButton    !== false;

    renderScale(_settings.gpaScale);
    renderWeightRows(_settings.customWeights);
    renderHistory(data.history || []);
  });

  /* ── Save button ────────────────────────────────────────────── */
  document.getElementById('opt-save')?.addEventListener('click', () => {
    collectSettings();
    chrome.storage.sync.set({ settings: _settings }, () => {
      showStatus('✓ Settings saved!');
    });
  });

  /* ── Reset button ───────────────────────────────────────────── */
  document.getElementById('opt-reset')?.addEventListener('click', () => {
    if (!confirm('Reset all settings to defaults?')) return;
    _settings = { ...DEFAULT_SETTINGS };
    const autoCalcEl = document.getElementById('opt-auto-calc');
    const showBtnEl  = document.getElementById('opt-show-btn');
    if (autoCalcEl) autoCalcEl.checked = true;
    if (showBtnEl)  showBtnEl.checked  = true;
    renderScale(DEFAULT_SCALE);
    renderWeightRows(DEFAULT_WEIGHTS);
    chrome.storage.sync.set({ settings: _settings }, () => {
      showStatus('✓ Reset to defaults!');
    });
  });

  /* ── Add weight rule ────────────────────────────────────────── */
  document.getElementById('opt-add-weight')?.addEventListener('click', () => {
    _settings.customWeights = _settings.customWeights || [];
    _settings.customWeights.push({ keyword: '', boost: 0.5 });
    renderWeightRows(_settings.customWeights);
  });

  /* ── Remove weight rule (delegated) ─────────────────────────── */
  document.getElementById('opt-weight-rows')?.addEventListener('click', (e) => {
    const idx = e.target.dataset.removeWeight;
    if (idx !== undefined) {
      _settings.customWeights.splice(parseInt(idx, 10), 1);
      renderWeightRows(_settings.customWeights);
    }
  });

  /* ── Clear history ───────────────────────────────────────────── */
  document.getElementById('opt-clear-history')?.addEventListener('click', () => {
    if (!confirm('Clear all GPA history?')) return;
    chrome.storage.sync.set({ history: [] }, () => {
      renderHistory([]);
      showStatus('✓ History cleared.');
    });
  });
});
