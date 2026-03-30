# Infinite GPA Calculator

A Chrome extension that instantly calculates your **Unweighted & Weighted GPA** directly from your [Infinite Campus](https://www.infinitecampus.com/) student portal — no copy-pasting, no manual entry.

---

## Features

- 🧮 **Automatic GPA calculation** from your Infinite Campus grades page
- 📊 **Unweighted (4.0 scale) and Weighted GPA** (boosts for AP & Honors courses)
- ⌨️ **Keyboard shortcut** — `Ctrl+Shift+G` (Mac: `Cmd+Shift+G`) to open the calculator instantly
- 📋 **Per-course breakdown** with letter grades and GPA points
- ⬇️ **Export** your grades as CSV or JSON
- 📈 **GPA history** — tracks snapshots over time
- 🌙 **Dark mode** support

---

## Installation

### From the Chrome Web Store *(coming soon)*

Search for **"Infinite GPA Calculator"** in the [Chrome Web Store](https://chrome.google.com/webstore) and click **Add to Chrome**.

### Manual / Developer Install

1. Download or clone this repository:
   ```
   git clone https://github.com/jwatson2029/campus-portal.git
   ```
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the `infinite-gpa-calculator` folder inside the cloned repo
6. Navigate to your Infinite Campus portal — the **GPA** floating button will appear at the top of the page

---

## Usage

1. Log in to your Infinite Campus student portal
2. Go to any grades page
3. Click the **GPA** floating button at the top of the page (or press `Ctrl+Shift+G`)
4. Your Unweighted and Weighted GPA are calculated instantly

---

## Supported Schools

Any school using **Infinite Campus** — including:
- `*.infinitecampus.org`
- `*.infinitecampus.com`

---

## Privacy

This extension **does not collect, transmit, or store any personal data**. All grade data is processed locally in your browser and never leaves your device. Settings and GPA history are saved using Chrome's built-in `storage.sync` API (synced only to your own Chrome profile).

---

## Contributing

Pull requests are welcome! Please open an issue first to discuss major changes.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

MIT License — see [LICENSE](LICENSE) for details.
