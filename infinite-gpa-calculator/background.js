chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-gpa-calculator') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      chrome.tabs.sendMessage(tabs[0].id, { action: 'TOGGLE_GPA_MODAL' });
    });
  }
});

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
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

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'SAVE_HISTORY') {
    chrome.storage.sync.get(['history'], (data) => {
      const history = data.history || [];
      history.unshift(msg.entry);
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
