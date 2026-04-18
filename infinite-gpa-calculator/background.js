chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-gpa-calculator') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      chrome.tabs.sendMessage(tabs[0].id, { action: 'TOGGLE_GPA_MODAL' });
    });
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { action: 'TOGGLE_GPA_MODAL' });
});
