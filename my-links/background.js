// Initialize extension
chrome.runtime.onInstalled.addListener(function() {
    console.log('Link Saver extension installed');
    
    // Create context menu item
    try {
      chrome.contextMenus.create({
        id: "saveLink",
        title: "Save to Link Saver",
        contexts: ["link"]
      });
      console.log('Context menu created');
    } catch (error) {
      console.error('Error creating context menu:', error);
    }
  
    // Initialize storage if needed
    chrome.storage.sync.get(['links'], function(result) {
      if (!result.links) {
        chrome.storage.sync.set({ links: [] }, function() {
          console.log('Storage initialized');
        });
      } else {
        console.log('Storage already initialized');
      }
    });
  });
  
  // Handle context menu clicks
  chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "saveLink") {
      saveLink(info.linkUrl, tab);
    }
  });
  
  // Listen for messages from content script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'saveLink') {
      saveLink(request.url, sender.tab);
    }
  });
  
  // Function to save links
  function saveLink(url, tab) {
    if (!url) return;
    
    // Get domain name to use as default link name
    let domainName = "";
    try {
      const urlObj = new URL(url);
      domainName = urlObj.hostname.replace('www.', '');
    } catch (e) {
      domainName = "Saved Link";
    }
    
    // Get current links from storage
    chrome.storage.sync.get(['links'], function(result) {
      const links = result.links || [];
      
      // Check if the URL already exists
      const exists = links.some(link => link.url === url);
      if (exists) {
        // Show notification that link already exists
        chrome.action.setBadgeText({ text: "!" });
        chrome.action.setBadgeBackgroundColor({ color: "#e15241" });
        
        setTimeout(() => {
          chrome.action.setBadgeText({ text: "" });
        }, 3000);
        
        return;
      }
      
      // Create new link object
      const newLink = {
        id: Date.now().toString(),
        name: domainName,
        url: url,
        date: new Date().toISOString()
      };
      
      // Add new link to the beginning of the array
      links.unshift(newLink);
      
      // Save updated links
      chrome.storage.sync.set({ links: links }, function() {
        // Show success notification
        chrome.action.setBadgeText({ text: "✓" });
        chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
        
        setTimeout(() => {
          chrome.action.setBadgeText({ text: "" });
        }, 2000);
      });
    });
  }