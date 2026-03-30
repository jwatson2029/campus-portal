# Infinite GPA Calculator — Chrome Extension

A **professional-grade, production-ready Chrome Extension (Manifest V3)** that injects seamlessly into [Infinite Campus](https://www.infinitecampus.com/) and instantly calculates your **Unweighted GPA** and **Weighted GPA** from live grades.

---

## ✨ Features

| Feature | Details |
|---|---|
| **Unweighted GPA** | Standard 4.0 scale (A=4.0, B=3.0, C=2.0, D=1.0, F=0.0) |
| **Weighted GPA** | AP +1.0, Honors/Concept & Connect +0.5, auto-detected from course name |
| **Live grade parsing** | Reads `notification__text` elements + grade tables via regex |
| **Deduplication** | Always keeps the most recent Course/Semester Average per class |
| **Keyboard shortcut** | `Ctrl+Shift+G` (Mac: `Cmd+Shift+G`) |
| **Auto-calculate** | Re-parses grades on every page load (toggleable) |
| **MutationObserver** | Button + GPA update automatically when new notifications appear |
| **Sortable table** | Click any column header to sort |
| **Export** | Download as CSV or JSON |
| **Dark mode** | Matches Infinite Campus dark/light theme automatically |
| **Settings page** | Custom GPA scale, custom weighting rules, history viewer |
| **GPA History** | Stores last 50 snapshots in `chrome.storage.sync` |

---

## 🗂 Folder Structure

```
infinite-gpa-calculator/
├── manifest.json        # MV3 manifest
├── content.js           # Main injection + grade parsing + GPA engine
├── inject-button.js     # Standalone nav-bar button helper
├── modal.html           # Popup window HTML
├── modal.js             # Popup window logic
├── modal.css            # All styles (modal + button + dark mode)
├── options.html         # Settings page
├── options.js           # Settings page logic
├── background.js        # Service worker (keyboard shortcut + message routing)
├── icons/
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── README.md
```

---

## 🚀 Installation (Manual / Unpacked)

1. **Download** the latest `infinite-gpa-calculator.zip` from the [GitHub Actions Artifacts](#github-actions-auto-build) section of this repo.
2. **Unzip** the archive anywhere on your computer.
3. Open Chrome and navigate to `chrome://extensions/`.
4. Enable **Developer mode** (top-right toggle).
5. Click **"Load unpacked"** and select the `infinite-gpa-calculator` folder.
6. The extension icon (📊) will appear in your toolbar.

> **Tip:** Pin the extension from the puzzle-piece menu so it's always visible.

---

## ⚙️ GitHub Actions Auto-Build

Every push to `main` (or `copilot/**` branches) automatically:

1. Zips the `infinite-gpa-calculator/` folder.
2. Uploads it as a **workflow artifact** named `infinite-gpa-calculator`.

### How to download the ZIP

1. Go to **Actions** tab of this repository.
2. Click the latest **"Build Infinite GPA Calculator"** workflow run.
3. Scroll to **Artifacts** at the bottom.
4. Click **`infinite-gpa-calculator`** to download the ZIP.
5. Load it in Chrome as described above.

---

## 🎮 Usage

### Opening the Calculator
- Click the **📊 GPA** button in the Infinite Campus nav bar (next to the bell icon).
- **Or** press `Ctrl+Shift+G` (Mac: `Cmd+Shift+G`) on any Infinite Campus page.

### Reading Grades
The extension automatically parses grades from:
1. **Notification dropdown** — looks for `notification__text` elements containing `updated grade of XX (XX.XX%) in [Course]: Course Average`.
2. **Grade tables** — falls back to scanning the grades iframe for percentage values.

### GPA Breakdown Modal
The modal shows:
- **Unweighted GPA** and **Weighted GPA** side-by-side
- A sortable table: Course | Grade % | Letter | UW Points | W Points
- Last updated timestamp
- Export to CSV or JSON

### Settings
Click the **⚙️** gear icon in the modal header, or right-click the extension icon → **Options**.

Options include:
- Toggle auto-calculate on load
- Toggle nav-bar button visibility
- Edit the GPA point scale
- Add/remove custom weighting rules (e.g., "IB" → +0.5)
- View and clear GPA history

---

## 🔧 Supported Domains

The extension activates on all of these patterns:

```
https://campus.forsyth.k12.ga.us/*
https://campus.*.k12.*/*
https://*.infinitecampus.org/*
https://*.infinitecampus.com/*
```

---

## 📐 GPA Scales

### Unweighted (default)
| Range | Letter | Points |
|---|---|---|
| 90–100 | A | 4.0 |
| 80–89 | B | 3.0 |
| 70–79 | C | 2.0 |
| 60–69 | D | 1.0 |
| 0–59 | F | 0.0 |

### Weighted Boosts (auto-detected)
| Keyword in Course Name | Boost |
|---|---|
| AP / Advanced Placement | +1.0 |
| Honors | +0.5 |
| Concept & Connect | +0.5 |

You can add your own rules in Settings → Weighting Rules.

---

## 🐛 Debugging

Open the browser console on any Infinite Campus page and look for `[GPA Calc]` prefixed log messages:

```
[GPA Calc] Initialising on https://campus.forsyth.k12.ga.us/campus/portal/...
[GPA Calc] GPA button injected into nav bar.
[GPA Calc] Parsed 6 courses from notifications.
[GPA Calc] Auto-calculated GPA: 3.667 / 4.000
```

---

## 📦 Building Locally

No build step required — the extension is pure vanilla JavaScript (no bundler needed).

To create a ZIP manually:
```bash
cd infinite-gpa-calculator
zip -r ../infinite-gpa-calculator.zip .
```

---

## 📄 License

MIT — free to use, modify, and distribute.
