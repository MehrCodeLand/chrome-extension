// This content script runs on web pages
console.log('NoteDotMe content script loaded');

// Listen for custom messages
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request && request.action === 'checkExtension') {
    sendResponse({status: 'active', github: 'https://github.com/MehrCodeLand'});
  }
  return true;
});

// Include GitHub information for attribution
console.log('NoteDotMe Extension by MehrCodeLand - https://github.com/MehrCodeLand');