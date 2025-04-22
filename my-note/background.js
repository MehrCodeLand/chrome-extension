// Initialize extension
chrome.runtime.onInstalled.addListener(function() {
  console.log('NoteDotMe extension installed');

  // Initialize storage if needed
  chrome.storage.sync.get(['notes', 'tags', 'tasks', 'completedTasks', 'theme'], function(result) {
    // Initialize notes array if it doesn't exist
    if (!result.notes) {
      chrome.storage.sync.set({ notes: [] }, function() {
        console.log('Storage initialized for notes');
      });
    }
    
    // Initialize tags array if it doesn't exist
    if (!result.tags) {
      const defaultTags = [
        { id: 'general', name: 'General', color: 'var(--blue-note)' }
      ];
      chrome.storage.sync.set({ tags: defaultTags }, function() {
        console.log('Storage initialized for tags');
      });
    }
    
    // Initialize tasks arrays if they don't exist
    if (!result.tasks) {
      chrome.storage.sync.set({ tasks: [] }, function() {
        console.log('Storage initialized for tasks');
      });
    }
    
    if (!result.completedTasks) {
      chrome.storage.sync.set({ completedTasks: [] }, function() {
        console.log('Storage initialized for completed tasks');
      });
    }
    
    // Initialize theme if it doesn't exist
    if (!result.theme) {
      chrome.storage.sync.set({ theme: 'light' }, function() {
        console.log('Storage initialized for theme');
      });
    }
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'quickNote') {
    // Handle quick note creation if we implement that feature
    sendResponse({status: 'received'});
  }
});

// Add GitHub information in the console log for attribution
console.log('NoteDotMe Extension created by MehrCodeLand - https://github.com/MehrCodeLand');