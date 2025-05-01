// Timer variables
let timerInterval;
let timerRunning = false;
let timerSeconds = 0;
let timerMinutes = 0;
let timerHours = 0;
let lastStorageUpdate = 0; // Timestamp of last storage update

// Initialize extension
chrome.runtime.onInstalled.addListener(function() {
  console.log('NoteDotMe extension installed');

  // Initialize storage if needed
  chrome.storage.sync.get(['notes', 'tags', 'tasks', 'completedTasks', 'theme', 'timerState'], function(result) {
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
    
    // Initialize or restore timer state
    if (!result.timerState) {
      chrome.storage.sync.set({ 
        timerState: {
          seconds: 0,
          minutes: 0,
          hours: 0,
          running: false,
          lastUpdate: Date.now() // Add timestamp of last update
        }
      }, function() {
        console.log('Storage initialized for timer state');
      });
    } else {
      // Restore timer state
      timerSeconds = result.timerState.seconds || 0;
      timerMinutes = result.timerState.minutes || 0;
      timerHours = result.timerState.hours || 0;
      timerRunning = result.timerState.running || false;
      lastStorageUpdate = result.timerState.lastUpdate || Date.now();
      
      // If timer was running, restart it
      if (timerRunning) {
        startTimerInterval();
      }
    }
  });
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'quickNote') {
    // Handle quick note creation if we implement that feature
    sendResponse({status: 'received'});
  } else if (request.action === 'timerCommand') {
    handleTimerCommand(request.command);
    sendResponse({status: 'success'});
  } else if (request.action === 'getTimerState') {
    sendResponse({
      seconds: timerSeconds,
      minutes: timerMinutes,
      hours: timerHours,
      running: timerRunning
    });
  }
  return true; // Keep the message channel open for async response
});

// Timer functions
function handleTimerCommand(command) {
  switch (command) {
    case 'start':
      startTimer();
      break;
    case 'stop':
      stopTimer();
      break;
    case 'reset':
      resetTimer();
      break;
  }
}

function startTimer() {
  if (!timerRunning) {
    timerRunning = true;
    startTimerInterval();
    
    // Always update storage on state change (start)
    updateTimerState(true);
    
    // Notify popup if it's open
    chrome.runtime.sendMessage({
      action: 'timerStateChanged',
      state: {
        seconds: timerSeconds,
        minutes: timerMinutes,
        hours: timerHours,
        running: timerRunning
      }
    }).catch(() => {}); // Ignore errors if popup is closed
  }
}

function stopTimer() {
  if (timerRunning) {
    timerRunning = false;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    
    // Always update storage on state change (stop)
    updateTimerState(true);
    
    // Notify popup if it's open
    chrome.runtime.sendMessage({
      action: 'timerStateChanged',
      state: {
        seconds: timerSeconds,
        minutes: timerMinutes,
        hours: timerHours,
        running: timerRunning
      }
    }).catch(() => {}); // Ignore errors if popup is closed
  }
}

function resetTimer() {
  stopTimer();
  timerSeconds = 0;
  timerMinutes = 0;
  timerHours = 0;
  
  // Always update storage on state change (reset)
  updateTimerState(true);
  
  // Notify popup if it's open
  chrome.runtime.sendMessage({
    action: 'timerStateChanged',
    state: {
      seconds: timerSeconds,
      minutes: timerMinutes,
      hours: timerHours,
      running: timerRunning
    }
  }).catch(() => {}); // Ignore errors if popup is closed
}

function startTimerInterval() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  timerInterval = setInterval(function() {
    timerSeconds++;
    
    if (timerSeconds >= 60) {
      timerSeconds = 0;
      timerMinutes++;
      
      if (timerMinutes >= 60) {
        timerMinutes = 0;
        timerHours++;
      }
    }
    
    // Only update storage periodically, not every second
    // Update every 30 seconds or when minutes/hours change
    const shouldUpdateStorage = 
      (Date.now() - lastStorageUpdate > 30000) || // 30 seconds passed
      (timerSeconds === 0); // Minutes or hours just changed
    
    if (shouldUpdateStorage) {
      updateTimerState();
    }
    
    // Notify popup if it's open - always do this every second for UI updates
    chrome.runtime.sendMessage({
      action: 'timerStateChanged',
      state: {
        seconds: timerSeconds,
        minutes: timerMinutes,
        hours: timerHours,
        running: timerRunning
      }
    }).catch(() => {}); // Ignore errors if popup is closed
    
  }, 1000);
}

function updateTimerState(forceUpdate = false) {
  // Only update if we're forcing an update or enough time has passed
  if (forceUpdate || (Date.now() - lastStorageUpdate > 30000)) {
    lastStorageUpdate = Date.now();
    
    chrome.storage.sync.set({
      timerState: {
        seconds: timerSeconds,
        minutes: timerMinutes,
        hours: timerHours,
        running: timerRunning,
        lastUpdate: lastStorageUpdate
      }
    });
  }
}

// Add GitHub information in the console log for attribution
console.log('NoteDotMe Extension created by MehrCodeLand - https://github.com/MehrCodeLand');