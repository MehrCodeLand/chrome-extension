// This content script runs on web pages
console.log('Link Saver content script loaded');
// s
// We're keeping this simple since direct clipboard access is restricted.
// The main functionality for saving links will be through the context menu
// which is handled by the background script.

// Listen for custom messages that may be sent from the webpage
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request && request.action === 'checkExtension') {
    sendResponse({status: 'active', github: 'https://github.com/MehrCodeLand'});
  }
  return true;
});

// Include GitHub information for attribution
console.log('Link Saver Extension by MehrCodeLand - https://github.com/MehrCodeLand');