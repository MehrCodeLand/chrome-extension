// Initialize extension
chrome.runtime.onInstalled.addListener(function() {
  console.log('WordVault extension installed');

  // Initialize storage if needed
  chrome.storage.sync.get(['words', 'languages', 'practices'], function(result) {
    // Initialize words array if it doesn't exist
    if (!result.words) {
      chrome.storage.sync.set({ words: [] }, function() {
        console.log('Storage initialized for words');
      });
    }
    
    // Initialize languages array if it doesn't exist
    if (!result.languages) {
      const defaultLanguages = [
        { id: 'general', name: 'General' }
      ];
      chrome.storage.sync.set({ languages: defaultLanguages }, function() {
        console.log('Storage initialized for languages');
      });
    }
    
    // Initialize practices array if it doesn't exist
    if (!result.practices) {
      chrome.storage.sync.set({ practices: [] }, function() {
        console.log('Storage initialized for practices');
      });
    }
  });
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'checkExtension') {
    sendResponse({status: 'active', github: 'https://github.com/MehrCodeLand'});
  }
  return true; // Keep the message channel open for async response
});

// Add GitHub information in the console log for attribution
console.log('WordVault Extension created by MehrCodeLand - https://github.com/MehrCodeLand');