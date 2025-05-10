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
  
  // Initialize storage and load data
  initializeStorage(function() {
    loadLanguages();
  });
  
  // Event Listeners - Navigation
  createBtn.addEventListener('click', showCreateContainer);
  reviewBtn.addEventListener('click', showReviewContainer);
  practiceBtn.addEventListener('click', showPracticeContainer);
  homeBtn.addEventListener('click', showHomeContainer);
  addLanguageBtn.addEventListener('click', showLanguageContainer);
  
  // Event Listeners - Create Word
  saveWordBtn.addEventListener('click', saveWord);
  cancelWordBtn.addEventListener('click', showHomeContainer);
  
  // Add Event Listener for Enter key in meaning input
  meaningInput.addEventListener('keydown', function(event) {
    // Check if the key pressed is Enter
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent the default action (new line)
      saveWord(); // Call the save function
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
  
  // Storage and initialization functions
  function initializeStorage(callback) {
    chrome.storage.sync.get(['words', 'languages', 'practices'], function(result) {
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
        chrome.storage.sync.set(updates, function() {
          console.log('Storage initialized');
          if (callback) callback();
        });
      } else {
        console.log('Storage already initialized');
        if (callback) callback();
      }
    });
  }
  
  // Words functions
  function saveWord() {
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
    
    chrome.storage.sync.get(['words', 'practices'], function(result) {
      const words = result.words || [];
      const practices = result.practices || [];
      
      // Create new word object
      const newWord = {
        id: Date.now().toString(),
        word: word,
        meaning: meaning,
        languageId: languageId,
        date: new Date().toISOString()
      };
      
      // Add word to words array
      words.unshift(newWord);
      
      // Create practice record for this word
      const newPractice = {
        wordId: newWord.id,
        practices: [] // Will contain dates when practiced
      };
      
      practices.push(newPractice);
      
      // Save to storage
      chrome.storage.sync.set({ 
        words: words,
        practices: practices 
      }, function() {
        // Clear inputs
        wordInput.value = '';
        meaningInput.value = '';
        
        // Show review container with new word
        showReviewContainer();
      });
    });
  }
  
  function loadWords(callback) {
    chrome.storage.sync.get(['words', 'languages'], function(result) {
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
    chrome.storage.sync.get(['words', 'languages'], function(result) {
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
    
    chrome.storage.sync.get(['words'], function(result) {
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
    
    chrome.storage.sync.get(['words'], function(result) {
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
        
        chrome.storage.sync.set({ words: words }, function() {
          showWordDetails(wordId);
        });
      }
    });
  }
  
  function deleteCurrentWord() {
    const wordId = deleteWordBtn.getAttribute('data-id');
    
    if (confirm('Are you sure you want to delete this word?')) {
      chrome.storage.sync.get(['words', 'practices'], function(result) {
        let words = result.words || [];
        let practices = result.practices || [];
        
        // Remove word
        words = words.filter(w => w.id !== wordId);
        
        // Remove associated practice data
        practices = practices.filter(p => p.wordId !== wordId);
        
        chrome.storage.sync.set({ 
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
    
    chrome.storage.sync.get(['languages'], function(result) {
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
      
      chrome.storage.sync.set({ languages: languages }, function() {
        languageInput.value = '';
        loadLanguages();
        showHomeContainer();
      });
    });
  }
  
  function loadLanguages() {
    chrome.storage.sync.get(['languages'], function(result) {
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
    chrome.storage.sync.get(['words', 'languages', 'practices'], function(result) {
      const words = result.words || [];
      const languages = result.languages || [];
      const practices = result.practices || [];
      
      filterPracticeWords(words, languages, practices);
    });
  }
  
  function filterPracticeWords(allWords, allLanguages, allPractices) {
    // If parameters not provided, get from storage
    if (!allWords || !allLanguages || !allPractices) {
      chrome.storage.sync.get(['words', 'languages', 'practices'], function(result) {
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
    
    // Truncate meaning if it's too long
    let meaningText = word.meaning;
    if (meaningText.length > 100) {
      meaningText = meaningText.substring(0, 100) + '...';
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
    chrome.storage.sync.get(['practices'], function(result) {
      let practices = result.practices || [];
      
      // Find the practice record for this word
      const index = practices.findIndex(p => p.wordId === wordId);
      
      if (index !== -1) {
        // Add today's date to practices array
        if (!practices[index].practices) {
          practices[index].practices = [];
        }
        
        practices[index].practices.push(new Date().toISOString());
        
        chrome.storage.sync.set({ practices: practices }, function() {
          // Reload practice UI
          loadPracticeWords();
        });
      }
    });
  }
  
  function undoPractice(wordId, practiceIndex) {
    chrome.storage.sync.get(['practices'], function(result) {
      let practices = result.practices || [];
      
      // Find the practice record for this word
      const index = practices.findIndex(p => p.wordId === wordId);
      
      if (index !== -1 && practices[index].practices && practices[index].practices.length > 0) {
        // Remove the last practice entry
        practices[index].practices.pop();
        
        chrome.storage.sync.set({ practices: practices }, function() {
          // Reload practice UI
          loadPracticeWords();
        });
      }
    });
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