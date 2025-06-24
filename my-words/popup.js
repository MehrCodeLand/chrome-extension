document.addEventListener('DOMContentLoaded', function() {
  console.log('WordVault popup loaded');
  
  // DOM Elements - Home
  const homeContainer = document.getElementById('home-container');
  const createBtn = document.getElementById('create-btn');
  const reviewBtn = document.getElementById('review-btn');
  const practiceBtn = document.getElementById('practice-btn');
  const homeBtn = document.getElementById('home-btn');
  
  // DOM Elements - Create Word
  const createContainer = document.getElementById('create-container');
  const wordInput = document.getElementById('word-input');
  const meaningInput = document.getElementById('meaning-input');
  const languageSelect = document.getElementById('language-select');
  const saveWordBtn = document.getElementById('save-word-btn');
  const cancelWordBtn = document.getElementById('cancel-word-btn');
  
  // DOM Elements - Create Language
  const addLanguageBtn = document.getElementById('add-language-btn');
  const languageContainer = document.getElementById('language-container');
  const languageInput = document.getElementById('language-input');
  const saveLanguageBtn = document.getElementById('save-language-btn');
  const cancelLanguageBtn = document.getElementById('cancel-language-btn');
  
  // DOM Elements - Review Words
  const reviewContainer = document.getElementById('review-container');
  const wordsList = document.getElementById('words-list');
  const noWords = document.getElementById('no-words');
  const searchInput = document.getElementById('search-input');
  const filterLanguage = document.getElementById('filter-language');
  
  // DOM Elements - Word Details
  const wordDetailsContainer = document.getElementById('word-details-container');
  const wordDetailContent = document.getElementById('word-detail-content');
  const editWordBtn = document.getElementById('edit-word-btn');
  const deleteWordBtn = document.getElementById('delete-word-btn');
  const backToReviewBtn = document.getElementById('back-to-review-btn');
  
  // DOM Elements - Edit Word
  const editContainer = document.getElementById('edit-container');
  const editWordInput = document.getElementById('edit-word-input');
  const editMeaningInput = document.getElementById('edit-meaning-input');
  const editLanguageSelect = document.getElementById('edit-language-select');
  const updateWordBtn = document.getElementById('update-word-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const editWordId = document.getElementById('edit-word-id');
  
  // DOM Elements - Practice
  const practiceContainer = document.getElementById('practice-container');
  const practiceWordsList = document.getElementById('practice-words-list');
  const noPracticeWords = document.getElementById('no-practice-words');
  const practiceSearchInput = document.getElementById('practice-search-input');
  const practiceFilterLanguage = document.getElementById('practice-filter-language');
  
  // DOM Elements - Backup & Restore
  const backupBtn = document.getElementById('backup-btn');
  const restoreBtn = document.getElementById('restore-btn');
  const restoreFileInput = document.getElementById('restore-file-input');
  
  // DOM Elements - Get Words
  const getWordsBtn = document.getElementById('get-words-btn');
  
  // DOM Elements - Storage Modal
  const storageManagementBtn = document.getElementById('storage-management-btn');
  const storageModal = document.getElementById('storage-modal');
  const storageCloseBtn = document.getElementById('storage-close-btn');
  const modalCompactBtn = document.getElementById('modal-compact-btn');
  const modalMigrateBtn = document.getElementById('modal-migrate-btn');
  const modalSyncBtn = document.getElementById('modal-sync-btn');
  const storageTypeBadge = document.getElementById('storage-type-badge');
  const storageUsageDisplay = document.getElementById('storage-usage-display');
  const storageUsageFill = document.getElementById('storage-usage-fill');
  const dataSummary = document.getElementById('data-summary');
  const syncExplanation = document.getElementById('sync-explanation');
  
  // Storage Manager Class
  class StorageManager {
    constructor() {
      this.storageType = 'sync';
      this.initialized = false;
    }
    
    async init() {
      return new Promise((resolve) => {
        chrome.storage.sync.get(['usingLocalStorage'], (result) => {
          this.storageType = result.usingLocalStorage ? 'local' : 'sync';
          this.initialized = true;
          console.log('Storage manager initialized, using:', this.storageType);
          resolve();
        });
      });
    }
    
    getStorage() {
      return this.storageType === 'local' ? chrome.storage.local : chrome.storage.sync;
    }
    
    get(keys, callback) {
      this.getStorage().get(keys, callback);
    }
    
    set(items, callback) {
      this.getStorage().set(items, callback);
    }
    
    getBytesInUse(callback) {
      this.getStorage().getBytesInUse(null, callback);
    }
    
    clear(callback) {
      this.getStorage().clear(callback);
    }
  }
  
  // Initialize storage manager
  const storageManager = new StorageManager();
  
  // Initialize storage and load data
  initializeStorage(function() {
    loadLanguages();
  });
  
  // Initialize storage manager
  storageManager.init();
  
  // Event Listeners - Navigation
  createBtn.addEventListener('click', showCreateContainer);
  reviewBtn.addEventListener('click', showReviewContainer);
  practiceBtn.addEventListener('click', showPracticeContainer);
  homeBtn.addEventListener('click', showHomeContainer);
  addLanguageBtn.addEventListener('click', showLanguageContainer);
  
  // Event Listeners - Create Word
  saveWordBtn.addEventListener('click', saveWordWithStorageCheck);
  cancelWordBtn.addEventListener('click', showHomeContainer);
  
  // Add Event Listener for Enter key in meaning input
  meaningInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      saveWordWithStorageCheck();
    }
  });
  
  // Event Listeners - Create Language
  saveLanguageBtn.addEventListener('click', saveLanguage);
  cancelLanguageBtn.addEventListener('click', showHomeContainer);
  
  // Event Listeners - Word Details
  editWordBtn.addEventListener('click', showEditWordForm);
  deleteWordBtn.addEventListener('click', deleteCurrentWord);
  backToReviewBtn.addEventListener('click', showReviewContainer);
  
  // Event Listeners - Edit Word
  updateWordBtn.addEventListener('click', updateWord);
  cancelEditBtn.addEventListener('click', function() {
    showWordDetails(editWordId.value);
  });
  
  // Add Event Listener for Enter key in edit meaning input
  editMeaningInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      updateWord();
    }
  });
  
  // Event Listeners - Search and Filter
  searchInput.addEventListener('input', function() {
    filterWords();
  });
  
  filterLanguage.addEventListener('change', function() {
    filterWords();
  });
  
  practiceSearchInput.addEventListener('input', function() {
    filterPracticeWords();
  });
  
  practiceFilterLanguage.addEventListener('change', function() {
    filterPracticeWords();
  });
  
  // Event Listeners - Backup & Restore
  backupBtn.addEventListener('click', backupData);
  restoreBtn.addEventListener('click', function() {
    restoreFileInput.click();
  });
  restoreFileInput.addEventListener('change', restoreData);
  
  // Event Listeners - Get Words
  getWordsBtn.addEventListener('click', exportWordsAsText);
  
  // Event Listeners - Storage Modal
  if (storageManagementBtn) {
    storageManagementBtn.addEventListener('click', showStorageModal);
  }
  
  if (storageCloseBtn) {
    storageCloseBtn.addEventListener('click', hideStorageModal);
  }
  
  if (storageModal) {
    storageModal.addEventListener('click', function(e) {
      if (e.target === storageModal) {
        hideStorageModal();
      }
    });
  }
  
  if (modalCompactBtn) {
    modalCompactBtn.addEventListener('click', compactStorage);
  }
  
  if (modalMigrateBtn) {
    modalMigrateBtn.addEventListener('click', function() {
      if (storageManager.storageType === 'sync') {
        migrateToLocalStorage();
      } else {
        migrateToSyncStorage();
      }
    });
  }
  
  if (modalSyncBtn) {
    modalSyncBtn.addEventListener('click', migrateToSyncStorage);
  }
  
  // Get Words Export Function
  function exportWordsAsText() {
    storageManager.get(['words'], function(result) {
      const words = result.words || [];
      
      if (words.length === 0) {
        alert('No words found to export. Add some words first!');
        return;
      }
      
      // Extract only the word strings and join with " - "
      const wordsList = words.map(wordObj => wordObj.word.trim()).join(' - ');
      
      // Create a blob with the text content
      const blob = new Blob([wordsList], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      // Create filename with date
      const date = new Date();
      const formattedDate = date.toISOString().split('T')[0];
      const filename = `my_words_${formattedDate}.txt`;
      
      // Create a download link and trigger it
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      console.log(`Words exported: ${words.length} words in text format`);
    });
  }
  
  // Storage quota checking
  function checkStorageQuota() {
    return new Promise((resolve) => {
      storageManager.getBytesInUse((bytesInUse) => {
        const maxBytes = storageManager.storageType === 'sync' ? 102400 : 5242880; // 100KB for sync, 5MB for local
        const usagePercentage = (bytesInUse / maxBytes) * 100;
        
        resolve({
          bytesInUse,
          maxBytes,
          usagePercentage,
          remainingBytes: maxBytes - bytesInUse,
          isNearLimit: usagePercentage > 80,
          isAtLimit: usagePercentage > 95,
          storageType: storageManager.storageType
        });
      });
    });
  }
  
  // Show Storage Modal
  function showStorageModal() {
    updateStorageModalContent();
    storageModal.classList.remove('hidden');
  }
  
  // Hide Storage Modal
  function hideStorageModal() {
    storageModal.classList.add('hidden');
  }
  
  // Update Storage Modal Content
  function updateStorageModalContent() {
    checkStorageQuota().then(info => {
      // Update storage type badge
      storageTypeBadge.className = `storage-type-indicator ${info.storageType}`;
      storageTypeBadge.textContent = info.storageType.toUpperCase();
      
      // Update storage usage display
      storageUsageDisplay.innerHTML = `
        <strong>Used:</strong> ${(info.bytesInUse / 1024).toFixed(1)}KB of ${(info.maxBytes / 1024).toFixed(1)}KB<br>
        <strong>Available:</strong> ${(info.remainingBytes / 1024).toFixed(1)}KB remaining<br>
        <strong>Usage:</strong> ${info.usagePercentage.toFixed(1)}% full
      `;
      
      // Update usage bar
      storageUsageFill.style.width = `${Math.min(info.usagePercentage, 100)}%`;
      storageUsageFill.className = 'storage-usage-fill';
      if (info.isAtLimit) {
        storageUsageFill.classList.add('danger');
      } else if (info.isNearLimit) {
        storageUsageFill.classList.add('warning');
      }
      
      // Update button visibility and text
      if (info.storageType === 'sync') {
        modalMigrateBtn.classList.remove('hidden');
        modalSyncBtn.classList.add('hidden');
        syncExplanation.classList.add('hidden');
        modalMigrateBtn.innerHTML = '📱 Switch to Local Storage';
      } else {
        modalMigrateBtn.classList.add('hidden');
        modalSyncBtn.classList.remove('hidden');
        syncExplanation.classList.remove('hidden');
        modalSyncBtn.innerHTML = '☁️ Switch to Sync Storage';
      }
      
      // Get data summary
      storageManager.get(['words', 'practices', 'languages'], function(result) {
        const words = result.words || [];
        const practices = result.practices || [];
        const languages = result.languages || [];
        
        const totalPractices = practices.reduce((total, practice) => {
          return total + (practice.practices ? practice.practices.length : 0);
        }, 0);
        
        dataSummary.innerHTML = `
          <strong>Words:</strong> ${words.length} saved<br>
          <strong>Languages:</strong> ${languages.length} categories<br>
          <strong>Practice Sessions:</strong> ${totalPractices} completed<br>
          <strong>Estimated Space per Word:</strong> ~200 bytes
        `;
      });
    });
  }
  
  // Enhanced save word function with storage checking
  async function saveWordWithStorageCheck() {
    const word = wordInput.value.trim();
    const meaning = meaningInput.value.trim();
    const languageId = languageSelect.value;
    
    if (!word) {
      alert('Please enter a word');
      return;
    }
    
    if (!meaning) {
      alert('Please enter a meaning');
      return;
    }

    // Check storage quota before saving (only for sync storage)
    if (storageManager.storageType === 'sync') {
      const storageInfo = await checkStorageQuota();
      
      if (storageInfo.isAtLimit) {
        const switchToLocal = confirm(`Storage quota exceeded! You're using ${storageInfo.usagePercentage.toFixed(1)}% of available space.\n\nWould you like to switch to Local Storage (unlimited space)?\n\nClick OK to switch, or Cancel to manage your current words first.`);
        if (switchToLocal) {
          showStorageModal();
        }
        return;
      }
      
      if (storageInfo.isNearLimit) {
        const confirmed = confirm(`Warning: You're using ${storageInfo.usagePercentage.toFixed(1)}% of storage space.\n\nYou have approximately ${Math.floor(storageInfo.remainingBytes / 200)} words remaining.\n\nDo you want to continue?`);
        if (!confirmed) return;
      }
    }

    // Original save logic
    storageManager.get(['words', 'practices'], function(result) {
      const words = result.words || [];
      const practices = result.practices || [];
      
      const newWord = {
        id: Date.now().toString(),
        word: word,
        meaning: meaning,
        languageId: languageId,
        date: new Date().toISOString()
      };
      
      words.unshift(newWord);
      
      const newPractice = {
        wordId: newWord.id,
        practices: []
      };
      
      practices.push(newPractice);
      
      storageManager.set({ 
        words: words,
        practices: practices 
      }, function() {
        if (chrome.runtime.lastError) {
          alert('Error saving word: ' + chrome.runtime.lastError.message);
          return;
        }
        
        wordInput.value = '';
        meaningInput.value = '';
        showReviewContainer();
      });
    });
  }
  
  // Migration to local storage
  function migrateToLocalStorage() {
    const confirmed = confirm('Switch to Local Storage?\n\n✅ Unlimited space (~5MB)\n✅ Store thousands of words\n❌ Data won\'t sync across devices\n\nYour current data will be safely transferred.\n\nContinue?');
    
    if (!confirmed) return;
    
    // Get all sync data
    chrome.storage.sync.get(null, function(syncData) {
      // Save to local storage
      chrome.storage.local.set(syncData, function() {
        if (chrome.runtime.lastError) {
          alert('Migration failed: ' + chrome.runtime.lastError.message);
          return;
        }
        
        // Clear sync storage
        chrome.storage.sync.clear(function() {
          // Set a flag to indicate we're using local storage
          chrome.storage.sync.set({
            usingLocalStorage: true,
            migrationDate: new Date().toISOString()
          }, function() {
            storageManager.storageType = 'local';
            alert('✅ Successfully switched to Local Storage!\n\nYou now have unlimited space for your words.');
            updateStorageModalContent();
          });
        });
      });
    });
  }
  
  // Migration to sync storage
  function migrateToSyncStorage() {
    // First check data size
    chrome.storage.local.get(null, function(localData) {
      delete localData.usingLocalStorage;
      delete localData.migrationDate;
      
      const dataSize = JSON.stringify(localData).length;
      if (dataSize > 95000) { // Leave some buffer
        alert('⚠️ Your data is too large for Sync Storage!\n\nSync Storage limit: 100KB\nYour data size: ~' + Math.round(dataSize/1024) + 'KB\n\nPlease delete some words first, or use backup to save your data.');
        return;
      }
      
      const confirmed = confirm('Switch to Sync Storage?\n\n✅ Syncs across all devices\n✅ Always backed up to cloud\n❌ Limited space (100KB)\n\nYour data will be transferred safely.\n\nContinue?');
      
      if (!confirmed) return;
      
      // Clear sync storage first
      chrome.storage.sync.clear(function() {
        // Save to sync storage
        chrome.storage.sync.set(localData, function() {
          if (chrome.runtime.lastError) {
            alert('Migration failed: ' + chrome.runtime.lastError.message);
            return;
          }
          
          // Clear local storage
          chrome.storage.local.clear(function() {
            storageManager.storageType = 'sync';
            alert('✅ Successfully switched to Sync Storage!\n\nYour words now sync across all devices.');
            updateStorageModalContent();
          });
        });
      });
    });
  }
  
  // Compact storage
  function compactStorage() {
    storageManager.get(['words', 'practices'], function(result) {
      let words = result.words || [];
      let practices = result.practices || [];
      
      const originalSize = JSON.stringify({words, practices}).length;
      
      // Remove orphaned practices
      const wordIds = new Set(words.map(w => w.id));
      const originalPracticesCount = practices.length;
      practices = practices.filter(p => wordIds.has(p.wordId));
      
      // Trim excessive whitespace
      words = words.map(word => ({
        ...word,
        word: word.word.trim(),
        meaning: word.meaning.trim()
      }));
      
      const newSize = JSON.stringify({words, practices}).length;
      const spaceSaved = originalSize - newSize;
      const practicesRemoved = originalPracticesCount - practices.length;
      
      storageManager.set({
        words: words,
        practices: practices
      }, function() {
        alert(`✅ Storage Compacted!\n\n📊 Space saved: ${(spaceSaved/1024).toFixed(1)}KB\n🗑️ Orphaned records removed: ${practicesRemoved}\n\nYour data is now optimized.`);
        updateStorageModalContent();
      });
    });
  }
  
  // Storage and initialization functions
  function initializeStorage(callback) {
    // First check which storage type we're using
    chrome.storage.sync.get(['usingLocalStorage'], function(result) {
      const storage = result.usingLocalStorage ? chrome.storage.local : chrome.storage.sync;
      
      storage.get(['words', 'languages', 'practices'], function(result) {
        let updates = {};
        let needsUpdate = false;
        
        if (!result.words) {
          updates.words = [];
          needsUpdate = true;
          console.log('Initializing words array');
        }
        
        if (!result.languages) {
          updates.languages = [
            { id: 'general', name: 'General' }
          ];
          needsUpdate = true;
          console.log('Initializing languages with default');
        }
        
        if (!result.practices) {
          updates.practices = [];
          needsUpdate = true;
          console.log('Initializing practices array');
        }
        
        if (needsUpdate) {
          storage.set(updates, function() {
            console.log('Storage initialized');
            if (callback) callback();
          });
        } else {
          console.log('Storage already initialized');
          if (callback) callback();
        }
      });
    });
  }
  
  // Words functions
  function loadWords(callback) {
    storageManager.get(['words', 'languages'], function(result) {
      const words = result.words || [];
      const languages = result.languages || [];
      
      if (callback) callback(words, languages);
    });
  }
  
  function filterWords() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedLanguage = filterLanguage.value;
    
    loadWords(function(words, languages) {
      let filteredWords = words;
      
      // Filter by search term
      if (searchTerm) {
        filteredWords = filteredWords.filter(word => 
          word.word.toLowerCase().includes(searchTerm) || 
          word.meaning.toLowerCase().includes(searchTerm)
        );
      }
      
      // Filter by language
      if (selectedLanguage !== 'all') {
        filteredWords = filteredWords.filter(word => word.languageId === selectedLanguage);
      }
      
      // Show only first 5 words if no filters are applied
      if (!searchTerm && selectedLanguage === 'all') {
        filteredWords = filteredWords.slice(0, 5);
      }
      
      updateWordsUI(filteredWords, languages);
    });
  }
  
  function updateWordsUI(words, languages) {
    wordsList.innerHTML = '';
    
    if (words.length === 0) {
      noWords.style.display = 'block';
      return;
    }
    
    noWords.style.display = 'none';
    
    words.forEach(word => {
      const wordElement = createWordElement(word);
      wordsList.appendChild(wordElement);
    });
  }
  
  function createWordElement(word) {
    const wordItem = document.createElement('div');
    wordItem.className = 'word-item';
    wordItem.textContent = word.word;
    wordItem.setAttribute('data-id', word.id);
    
    wordItem.addEventListener('click', function() {
      showWordDetails(word.id);
    });
    
    return wordItem;
  }
  
  function showWordDetails(wordId) {
    storageManager.get(['words', 'languages'], function(result) {
      const words = result.words || [];
      const languages = result.languages || [];
      
      const word = words.find(w => w.id === wordId);
      
      if (!word) {
        alert('Word not found');
        showReviewContainer();
        return;
      }
      
      const language = languages.find(l => l.id === word.languageId) || { name: 'General' };
      
      wordDetailContent.innerHTML = '';
      
      const wordTitle = document.createElement('div');
      wordTitle.className = 'word-title';
      wordTitle.textContent = word.word;
      
      const wordMeaning = document.createElement('div');
      wordMeaning.className = 'word-meaning';
      wordMeaning.textContent = word.meaning;
      
      const wordLanguage = document.createElement('div');
      wordLanguage.className = 'word-language';
      wordLanguage.textContent = `Language: ${language.name}`;
      
      const wordDate = document.createElement('div');
      wordDate.className = 'word-date';
      wordDate.textContent = `Added: ${formatDate(word.date)}`;
      
      wordDetailContent.appendChild(wordTitle);
      wordDetailContent.appendChild(wordMeaning);
      wordDetailContent.appendChild(wordLanguage);
      wordDetailContent.appendChild(wordDate);
      
      // Set the current word ID for edit and delete functions
      editWordBtn.setAttribute('data-id', word.id);
      deleteWordBtn.setAttribute('data-id', word.id);
      
      hideAllContainers();
      wordDetailsContainer.classList.remove('hidden');
    });
  }
  
  function showEditWordForm() {
    const wordId = editWordBtn.getAttribute('data-id');
    
    storageManager.get(['words'], function(result) {
      const words = result.words || [];
      const word = words.find(w => w.id === wordId);
      
      if (!word) {
        alert('Word not found');
        showReviewContainer();
        return;
      }
      
      // Fill edit form with word data
      editWordInput.value = word.word;
      editMeaningInput.value = word.meaning;
      editLanguageSelect.value = word.languageId;
      editWordId.value = word.id;
      
      hideAllContainers();
      editContainer.classList.remove('hidden');
    });
  }
  
  function updateWord() {
    const wordId = editWordId.value;
    const word = editWordInput.value.trim();
    const meaning = editMeaningInput.value.trim();
    const languageId = editLanguageSelect.value;
    
    if (!word) {
      alert('Please enter a word');
      return;
    }
    
    if (!meaning) {
      alert('Please enter a meaning');
      return;
    }
    
    storageManager.get(['words'], function(result) {
      let words = result.words || [];
      
      const index = words.findIndex(w => w.id === wordId);
      if (index !== -1) {
        // Keep the original date, update the word
        const originalDate = words[index].date;
        
        words[index] = {
          id: wordId,
          word: word,
          meaning: meaning,
          languageId: languageId,
          date: originalDate,
          updatedAt: new Date().toISOString()
        };
        
        storageManager.set({ words: words }, function() {
          showWordDetails(wordId);
        });
      }
    });
  }
  
  function deleteCurrentWord() {
    const wordId = deleteWordBtn.getAttribute('data-id');
    
    if (confirm('Are you sure you want to delete this word?')) {
      storageManager.get(['words', 'practices'], function(result) {
        let words = result.words || [];
        let practices = result.practices || [];
        
        // Remove word
        words = words.filter(w => w.id !== wordId);
        
        // Remove associated practice data
        practices = practices.filter(p => p.wordId !== wordId);
        
        storageManager.set({ 
          words: words,
          practices: practices 
        }, function() {
          showReviewContainer();
        });
      });
    }
  }
  
  // Language functions
  function saveLanguage() {
    const name = languageInput.value.trim();
    
    if (!name) {
      alert('Please enter a language name');
      return;
    }
    
    storageManager.get(['languages'], function(result) {
      const languages = result.languages || [];
      
      // Check if language with same name already exists
      if (languages.some(lang => lang.name.toLowerCase() === name.toLowerCase())) {
        alert('A language with this name already exists');
        return;
      }
      
      const newLanguage = {
        id: Date.now().toString(),
        name: name
      };
      
      languages.push(newLanguage);
      
      storageManager.set({ languages: languages }, function() {
        languageInput.value = '';
        loadLanguages();
        showHomeContainer();
      });
    });
  }
  
  function loadLanguages() {
    storageManager.get(['languages'], function(result) {
      const languages = result.languages || [];
      
      // Clear language selects
      clearLanguageSelects();
      
      // Add languages to all selects
      languages.forEach(language => {
        addLanguageToSelects(language);
      });
    });
  }
  
  function clearLanguageSelects() {
    // Clear language select
    languageSelect.innerHTML = '';
    editLanguageSelect.innerHTML = '';
    
    // Clear filter selects (keep "All Languages" option)
    while (filterLanguage.options.length > 1) {
      filterLanguage.remove(1);
    }
    
    while (practiceFilterLanguage.options.length > 1) {
      practiceFilterLanguage.remove(1);
    }
  }
  
  function addLanguageToSelects(language) {
    // Add to language select
    const option1 = document.createElement('option');
    option1.value = language.id;
    option1.textContent = language.name;
    languageSelect.appendChild(option1);
    
    // Add to edit language select
    const option2 = document.createElement('option');
    option2.value = language.id;
    option2.textContent = language.name;
    editLanguageSelect.appendChild(option2);
    
    // Add to filter language select
    const option3 = document.createElement('option');
    option3.value = language.id;
    option3.textContent = language.name;
    filterLanguage.appendChild(option3);
    
    // Add to practice filter language select
    const option4 = document.createElement('option');
    option4.value = language.id;
    option4.textContent = language.name;
    practiceFilterLanguage.appendChild(option4);
  }
  
  // Practice functions
  function loadPracticeWords() {
    storageManager.get(['words', 'languages', 'practices'], function(result) {
      const words = result.words || [];
      const languages = result.languages || [];
      const practices = result.practices || [];
      
      filterPracticeWords(words, languages, practices);
    });
  }
  
  function filterPracticeWords(allWords, allLanguages, allPractices) {
    // If parameters not provided, get from storage
    if (!allWords || !allLanguages || !allPractices) {
      storageManager.get(['words', 'languages', 'practices'], function(result) {
        const words = result.words || [];
        const languages = result.languages || [];
        const practices = result.practices || [];
        
        filterPracticeWords(words, languages, practices);
      });
      return;
    }
    
    const searchTerm = practiceSearchInput.value.toLowerCase();
    const selectedLanguage = practiceFilterLanguage.value;
    
    // Apply filters
    let filteredWords = allWords;
    
    // Filter by search term
    if (searchTerm) {
      filteredWords = filteredWords.filter(word => 
        word.word.toLowerCase().includes(searchTerm) || 
        word.meaning.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by language
    if (selectedLanguage !== 'all') {
      filteredWords = filteredWords.filter(word => word.languageId === selectedLanguage);
    }
    
    updatePracticeUI(filteredWords, allLanguages, allPractices);
  }
  
  function updatePracticeUI(words, languages, practices) {
    practiceWordsList.innerHTML = '';
    
    if (words.length === 0) {
      noPracticeWords.style.display = 'block';
      return;
    }
    
    noPracticeWords.style.display = 'none';
    
    // Get today's date in YYYY-MM-DD format for comparison
    const today = new Date().toISOString().split('T')[0];
    
    words.forEach(word => {
      const practice = practices.find(p => p.wordId === word.id) || { practices: [] };
      const wordElement = createPracticeWordElement(word, practice, today);
      practiceWordsList.appendChild(wordElement);
    });
  }
  
  function createPracticeWordElement(word, practice, today) {
    const wordItem = document.createElement('div');
    wordItem.className = 'practice-word-item';
    
    const wordTitle = document.createElement('div');
    wordTitle.className = 'practice-word-title';
    wordTitle.textContent = word.word;
    
    // Limit the meaning to a reasonable length to keep consistent height
    const wordMeaning = document.createElement('div');
    wordMeaning.className = 'word-meaning';
    
    // Truncate meaning if it's too long - restrict to 80 chars for more consistent sizing
    let meaningText = word.meaning;
    if (meaningText.length > 80) {
      meaningText = meaningText.substring(0, 80) + '...';
    }
    wordMeaning.textContent = meaningText;
    
    const practiceBoxes = document.createElement('div');
    practiceBoxes.className = 'practice-boxes';
    
    // Create 7 practice boxes
    for (let i = 0; i < 7; i++) {
      const box = document.createElement('div');
      box.className = 'practice-box';
      box.setAttribute('data-index', i);
      box.setAttribute('data-word-id', word.id);
      
      // Check if this box is already completed
      const isPracticed = practice.practices && practice.practices.length > i;
      if (isPracticed) {
        box.classList.add('completed');
        box.title = `Practiced on ${formatDate(practice.practices[i])}. Click to undo.`;
        
        // Allow undo for the last completed box
        if (i === practice.practices.length - 1) {
          box.addEventListener('click', function() {
            undoPractice(word.id, i);
          });
          box.style.cursor = 'pointer';
        }
      } else {
        // Only allow clicking the first uncompleted box
        if (i === practice.practices.length) {
          // Check if already practiced today
          const canPracticeToday = !practice.practices.some(date => 
            date.split('T')[0] === today
          );
          
          if (canPracticeToday) {
            box.addEventListener('click', function() {
              markWordAsPracticed(word.id, i);
            });
            box.title = 'Click to mark as practiced today';
            box.style.cursor = 'pointer';
          } else {
            box.title = 'Already practiced today. Come back tomorrow!';
            box.style.cursor = 'not-allowed';
          }
        } else {
          box.title = 'Complete previous practices first';
          box.style.cursor = 'not-allowed';
        }
      }
      
      practiceBoxes.appendChild(box);
    }
    
    wordItem.appendChild(wordTitle);
    wordItem.appendChild(wordMeaning);
    wordItem.appendChild(practiceBoxes);
    
    return wordItem;
  }
  
  function markWordAsPracticed(wordId, practiceIndex) {
    storageManager.get(['practices'], function(result) {
      let practices = result.practices || [];
      
      // Find the practice record for this word
      const index = practices.findIndex(p => p.wordId === wordId);
      
      if (index !== -1) {
        // Add today's date to practices array
        if (!practices[index].practices) {
          practices[index].practices = [];
        }
        
        practices[index].practices.push(new Date().toISOString());
        
        storageManager.set({ practices: practices }, function() {
          // Reload practice UI
          loadPracticeWords();
        });
      }
    });
  }
  
  function undoPractice(wordId, practiceIndex) {
    storageManager.get(['practices'], function(result) {
      let practices = result.practices || [];
      
      // Find the practice record for this word
      const index = practices.findIndex(p => p.wordId === wordId);
      
      if (index !== -1 && practices[index].practices && practices[index].practices.length > 0) {
        // Remove the last practice entry
        practices[index].practices.pop();
        
        storageManager.set({ practices: practices }, function() {
          // Reload practice UI
          loadPracticeWords();
        });
      }
    });
  }
  
  // Backup and Restore functions
  function backupData() {
    storageManager.get(['words', 'languages', 'practices'], function(result) {
      // Create a backup object with metadata
      const backup = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        extension: 'WordVault',
        storageType: storageManager.storageType,
        data: {
          words: result.words || [],
          languages: result.languages || [],
          practices: result.practices || []
        }
      };
      
      // Convert to JSON string
      const backupJSON = JSON.stringify(backup, null, 2);
      
      // Create a blob and download link
      const blob = new Blob([backupJSON], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create filename with date
      const date = new Date();
      const formattedDate = date.toISOString().split('T')[0];
      const filename = `wordvault_backup_${formattedDate}.json`;
      
      // Create a download link and trigger it
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      console.log('Backup created successfully');
    });
  }
  
  function restoreData(event) {
    const file = event.target.files[0];
    
    if (!file) {
      console.log('No file selected');
      return;
    }
    
    // Validate file type
    if (!file.name.endsWith('.json')) {
      alert('Please select a valid JSON backup file');
      restoreFileInput.value = '';
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        console.log('Reading backup file...');
        
        // Parse the backup file
        const backupContent = e.target.result;
        
        if (!backupContent || typeof backupContent !== 'string') {
          throw new Error('Invalid file content - file appears to be empty or corrupted');
        }
        
        const backup = JSON.parse(backupContent);
        console.log('Backup parsed successfully:', backup);
        
        // Enhanced validation of backup structure
        if (!backup || typeof backup !== 'object') {
          throw new Error('Invalid backup file format - not a valid JSON object');
        }
        
        if (!backup.data || typeof backup.data !== 'object') {
          throw new Error('Backup file is missing data section');
        }
        
        // Validate required arrays with fallbacks
        const words = Array.isArray(backup.data.words) ? backup.data.words : [];
        const languages = Array.isArray(backup.data.languages) ? backup.data.languages : [{ id: 'general', name: 'General' }];
        const practices = Array.isArray(backup.data.practices) ? backup.data.practices : [];
        
        console.log('Backup validation passed:', {
          words: words.length,
          languages: languages.length,
          practices: practices.length
        });
        
        // Validate data integrity
        if (words.length > 0) {
          // Check if words have required properties
          const sampleWord = words[0];
          if (!sampleWord.id || !sampleWord.word) {
            throw new Error('Words data appears to be corrupted - missing required fields');
          }
        }
        
        if (languages.length > 0) {
          // Check if languages have required properties
          const sampleLanguage = languages[0];
          if (!sampleLanguage.id || !sampleLanguage.name) {
            throw new Error('Languages data appears to be corrupted - missing required fields');
          }
        }
        
        // Confirm restore action
        const confirmMessage = `This will replace your current data with the backup.\n\nBackup contains:\n• ${words.length} words\n• ${languages.length} languages\n• ${practices.length} practice records\n\nDo you want to continue?`;
        
        if (confirm(confirmMessage)) {
          console.log('User confirmed restore operation');
          
          // Clear existing storage first, then restore
          storageManager.clear(() => {
            if (chrome.runtime.lastError) {
              console.error('Error clearing storage:', chrome.runtime.lastError);
              alert('Error clearing existing data. Please try again.');
              return;
            }
            
            console.log('Storage cleared, restoring data...');
            
            // Restore the data
            storageManager.set({
              words: words,
              languages: languages,
              practices: practices
            }, function() {
              if (chrome.runtime.lastError) {
                console.error('Error restoring data:', chrome.runtime.lastError);
                alert('Error restoring backup data. Please try again.');
                return;
              }
              
              console.log('Backup restored successfully');
              
              // Reload the UI
              loadLanguages();
              alert(`Backup restored successfully!\n\nRestored:\n• ${words.length} words\n• ${languages.length} languages\n• ${practices.length} practice records`);
              showHomeContainer();
            });
          });
        } else {
          console.log('User cancelled restore operation');
        }
        
              } catch (error) {
        console.error('Error parsing/restoring backup:', error);
        alert('Error restoring backup: ' + error.message + '\n\nPlease make sure you selected a valid WordVault backup file.');
      }
      
      // Reset the file input
      restoreFileInput.value = '';
    };
    
    reader.onerror = function(error) {
      console.error('Error reading file:', error);
      alert('Error reading backup file. Please try again with a different file.');
      restoreFileInput.value = '';
    };
    
    // Read the file as text
    reader.readAsText(file, 'UTF-8');
  }
  
  // Utility functions
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  function hideAllContainers() {
    homeContainer.classList.add('hidden');
    createContainer.classList.add('hidden');
    languageContainer.classList.add('hidden');
    reviewContainer.classList.add('hidden');
    wordDetailsContainer.classList.add('hidden');
    editContainer.classList.add('hidden');
    practiceContainer.classList.add('hidden');
  }
  
  function showHomeContainer() {
    hideAllContainers();
    homeContainer.classList.remove('hidden');
  }
  
  function showCreateContainer() {
    hideAllContainers();
    createContainer.classList.remove('hidden');
    wordInput.focus();
  }
  
  function showLanguageContainer() {
    hideAllContainers();
    languageContainer.classList.remove('hidden');
    languageInput.focus();
  }
  
  function showReviewContainer() {
    hideAllContainers();
    reviewContainer.classList.remove('hidden');
    searchInput.value = '';
    filterLanguage.value = 'all';
    filterWords();
  }
  
  function showPracticeContainer() {
    hideAllContainers();
    practiceContainer.classList.remove('hidden');
    practiceSearchInput.value = '';
    practiceFilterLanguage.value = 'all';
    loadPracticeWords();
  }
});