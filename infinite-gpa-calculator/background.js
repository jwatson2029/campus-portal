/**
 * background.js — Manifest V3 Service Worker
 * Handles keyboard commands and message routing between the content script and modal.
 */

// ──────────────────────────────────────────────
// Keyboard shortcut: Ctrl/Cmd + Shift + G
// ──────────────────────────────────────────────
chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-gpa-calculator') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      chrome.tabs.sendMessage(tabs[0].id, { action: 'TOGGLE_GPA_MODAL' });
    });
  }
});

// ──────────────────────────────────────────────
// Install / update lifecycle
// ──────────────────────────────────────────────
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    // Seed default settings on first install
    chrome.storage.sync.set({
      settings: {
        autoCalculate: true,
        showButton: true,
        customWeights: [],
        gpaScale: [
          { min: 90, max: 100, letter: 'A', points: 4.0 },
          { min: 80, max: 89,  letter: 'B', points: 3.0 },
          { min: 70, max: 79,  letter: 'C', points: 2.0 },
          { min: 60, max: 69,  letter: 'D', points: 1.0 },
          { min: 0,  max: 59,  letter: 'F', points: 0.0 }
        ]
      },
      history: []
    });
    console.log('[GPA Calc] Extension installed — default settings saved.');
  }
});

// ──────────────────────────────────────────────
// Pass-through messaging (content ↔ modal)
// ──────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'SAVE_HISTORY') {
    chrome.storage.sync.get(['history'], (data) => {
      const history = data.history || [];
      history.unshift(msg.entry);
      // Keep only last 50 snapshots
      chrome.storage.sync.set({ history: history.slice(0, 50) }, () => {
        sendResponse({ ok: true });
      });
    });
    return true;
  }

  if (msg.action === 'GET_HISTORY') {
    chrome.storage.sync.get(['history'], (data) => {
      sendResponse({ history: data.history || [] });
    });
    return true;
  }
});
