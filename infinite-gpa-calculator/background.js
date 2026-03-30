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
        gpaScale: 'standard'
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
  if (msg.action === 'GET_SETTINGS') {
    chrome.storage.sync.get(['settings'], (data) => {
      sendResponse({ settings: data.settings || {} });
    });
    return true; // async response
  }

  if (msg.action === 'SAVE_SETTINGS') {
    chrome.storage.sync.set({ settings: msg.settings }, () => {
      sendResponse({ ok: true });
    });
    return true;
  }

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
