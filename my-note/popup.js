document.addEventListener('DOMContentLoaded', function() {
  console.log('NoteDotMe popup loaded');
  
  // DOM Elements - Notes
  const addBtn = document.getElementById('add-btn');
  const addTagBtn = document.getElementById('add-tag-btn');
  const addForm = document.getElementById('add-form');
  const addTagForm = document.getElementById('add-tag-form');
  const editForm = document.getElementById('edit-form');
  const notesContainer = document.getElementById('notes-container');
  const notesList = document.getElementById('notes-list');
  const noNotes = document.getElementById('no-notes');
  const saveNoteBtn = document.getElementById('save-note-btn');
  const saveTagBtn = document.getElementById('save-tag-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const cancelTagBtn = document.getElementById('cancel-tag-btn');
  const updateNoteBtn = document.getElementById('update-note-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const noteTitleInput = document.getElementById('note-title');
  const noteContentInput = document.getElementById('note-content');
  const noteTagSelect = document.getElementById('note-tag');
  const tagNameInput = document.getElementById('tag-name');
  const editTitleInput = document.getElementById('edit-title');
  const editContentInput = document.getElementById('edit-content');
  const editTagSelect = document.getElementById('edit-tag');
  const editIdInput = document.getElementById('edit-id');
  const tagFilter = document.getElementById('tag-filter');
  
  // DOM Elements - Tasks
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskManager = document.getElementById('task-manager');
  const taskTitleInput = document.getElementById('task-title');
  const saveTaskBtn = document.getElementById('save-task-btn');
  const tasksList = document.getElementById('tasks-list');
  const completedTasksList = document.getElementById('completed-tasks-list');
  const noTasks = document.getElementById('no-tasks');
  const noCompletedTasks = document.getElementById('no-completed-tasks');
  
  // DOM Elements - Timer
  const timerBtn = document.getElementById('timer-btn');
  const timerContainer = document.getElementById('timer-container');
  const startTimerBtn = document.getElementById('start-timer-btn');
  const stopTimerBtn = document.getElementById('stop-timer-btn');
  const resetTimerBtn = document.getElementById('reset-timer-btn');
  const hoursDisplay = document.getElementById('hours');
  const minutesDisplay = document.getElementById('minutes');
  const secondsDisplay = document.getElementById('seconds');
  
  // DOM Elements - Theme
  const toggleThemeBtn = document.getElementById('toggle-theme-btn');

  // Timer variables
  let timerInterval;
  let timerRunning = false;
  let timerSeconds = 0;
  let timerMinutes = 0;
  let timerHours = 0;

  // Initialize storage and load data
  initializeStorage(function() {
    loadTags(function() {
      loadNotes();
      loadTasks();
    });
    loadTheme();
  });

  // Event Listeners - Notes
  addBtn.addEventListener('click', toggleAddForm);
  addTagBtn.addEventListener('click', toggleAddTagForm);
  saveNoteBtn.addEventListener('click', saveNote);
  saveTagBtn.addEventListener('click', saveTag);
  cancelBtn.addEventListener('click', toggleAddForm);
  cancelTagBtn.addEventListener('click', toggleAddTagForm);
  updateNoteBtn.addEventListener('click', updateNote);
  cancelEditBtn.addEventListener('click', () => {
    editForm.classList.add('hidden');
    notesContainer.classList.remove('hidden');
  });
  
  // Event Listeners - Tasks
  addTaskBtn.addEventListener('click', toggleTaskManager);
  saveTaskBtn.addEventListener('click', saveTask);
  taskTitleInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      saveTask();
    }
  });
  
  // Event Listeners - Timer
  timerBtn.addEventListener('click', toggleTimer);
  startTimerBtn.addEventListener('click', startTimer);
  stopTimerBtn.addEventListener('click', stopTimer);
  resetTimerBtn.addEventListener('click', resetTimer);
  
  // Event Listeners - Theme
  toggleThemeBtn.addEventListener('click', toggleTheme);
  
  // Event Listener - Tag Filter
  tagFilter.addEventListener('change', function() {
    filterNotes();
  });

  // Functions
  function initializeStorage(callback) {
    chrome.storage.sync.get(['notes', 'tags', 'tasks', 'completedTasks', 'theme', 'timerState'], function(result) {
      let updates = {};
      let needsUpdate = false;
      
      // Initialize notes array if it doesn't exist
      if (!result.notes) {
        updates.notes = [];
        needsUpdate = true;
        console.log('Initializing notes array');
      }
      
      // Initialize tags array if it doesn't exist
      if (!result.tags) {
        updates.tags = [
          { id: 'general', name: 'General', color: 'var(--blue-note)' }
        ];
        needsUpdate = true;
        console.log('Initializing tags with default');
      }
      
      // Initialize tasks arrays if they don't exist
      if (!result.tasks) {
        updates.tasks = [];
        needsUpdate = true;
        console.log('Initializing tasks array');
      }
      
      if (!result.completedTasks) {
        updates.completedTasks = [];
        needsUpdate = true;
        console.log('Initializing completed tasks array');
      }
      
      // Initialize theme if it doesn't exist
      if (!result.theme) {
        updates.theme = 'light';
        needsUpdate = true;
        console.log('Initializing theme');
      }
      
      // Initialize timer state if it doesn't exist
      if (!result.timerState) {
        updates.timerState = {
          seconds: 0,
          minutes: 0,
          hours: 0,
          running: false
        };
        needsUpdate = true;
        console.log('Initializing timer state');
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
  
  // Load and apply saved theme
  function loadTheme() {
    chrome.storage.sync.get(['theme'], function(result) {
      const theme = result.theme || 'light';
      applyTheme(theme);
    });
  }
  
  // Toggle between light and dark theme
  function toggleTheme() {
    chrome.storage.sync.get(['theme'], function(result) {
      const currentTheme = result.theme || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      chrome.storage.sync.set({ theme: newTheme }, function() {
        applyTheme(newTheme);
      });
    });
  }
  
  // Apply theme to document and update toggle button
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      toggleThemeBtn.innerHTML = '☀️';
      toggleThemeBtn.title = 'Switch to Light Mode';
    } else {
      document.body.classList.remove('dark-mode');
      toggleThemeBtn.innerHTML = '🌙';
      toggleThemeBtn.title = 'Switch to Dark Mode';
    }
  }

  // Timer Functions
  function toggleTimer() {
    hideAllContainers();
    timerContainer.classList.remove('hidden');
    updateTimerDisplay();
  }
  
  function startTimer() {
    if (!timerRunning) {
      timerRunning = true;
      startTimerBtn.textContent = 'Pause';
      stopTimerBtn.disabled = false;
      
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
        
        updateTimerDisplay();
      }, 1000);
    } else {
      // Pause the timer
      timerRunning = false;
      startTimerBtn.textContent = 'Start';
      clearInterval(timerInterval);
    }
  }
  
  function stopTimer() {
    if (timerRunning) {
      timerRunning = false;
      startTimerBtn.textContent = 'Start';
      clearInterval(timerInterval);
    }
    stopTimerBtn.disabled = true;
  }
  
  function resetTimer() {
    stopTimer();
    timerSeconds = 0;
    timerMinutes = 0;
    timerHours = 0;
    updateTimerDisplay();
  }
  
  function updateTimerDisplay() {
    secondsDisplay.textContent = padZero(timerSeconds);
    minutesDisplay.textContent = padZero(timerMinutes);
    hoursDisplay.textContent = padZero(timerHours);
  }
  
  function padZero(num) {
    return num.toString().padStart(2, '0');
  }

  function toggleTaskManager() {
    hideAllContainers();
    taskManager.classList.remove('hidden');
    taskTitleInput.focus();
    loadTasks();
  }
  
  function loadTasks() {
    chrome.storage.sync.get(['tasks', 'completedTasks'], function(result) {
      const tasks = result.tasks || [];
      const completedTasks = result.completedTasks || [];
      
      console.log('Loaded tasks:', tasks.length);
      console.log('Loaded completed tasks:', completedTasks.length);
      
      // Update UI
      updateTasksUI(tasks, completedTasks);
    });
  }
  
  function updateTasksUI(tasks, completedTasks) {
    // Clear lists
    tasksList.innerHTML = '';
    completedTasksList.innerHTML = '';
    
    // Current tasks
    if (tasks.length === 0) {
      noTasks.style.display = 'block';
    } else {
      noTasks.style.display = 'none';
      tasks.forEach(task => {
        const taskElement = createTaskElement(task, false);
        tasksList.appendChild(taskElement);
      });
    }
    
    // Completed tasks
    if (completedTasks.length === 0) {
      noCompletedTasks.style.display = 'block';
    } else {
      noCompletedTasks.style.display = 'none';
      completedTasks.forEach(task => {
        const taskElement = createTaskElement(task, true);
        completedTasksList.appendChild(taskElement);
      });
    }
  }
  
  function createTaskElement(task, isCompleted) {
    const taskItem = document.createElement('div');
    taskItem.className = isCompleted ? 'task-item task-completed' : 'task-item';
    taskItem.setAttribute('data-id', task.id);
    
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    
    const taskTitle = document.createElement('span');
    taskTitle.className = 'task-title';
    taskTitle.textContent = task.title;
    
    taskContent.appendChild(taskTitle);
    
    const taskActions = document.createElement('div');
    taskActions.className = 'task-actions';
    
    if (!isCompleted) {
      // For current tasks, add done and failed buttons
      const doneBtn = document.createElement('button');
      doneBtn.className = 'task-action-btn task-done-btn';
      doneBtn.innerHTML = '✓';
      doneBtn.title = 'Mark as Done';
      doneBtn.addEventListener('click', () => {
        completeTask(task.id, 'done');
      });
      
      const failedBtn = document.createElement('button');
      failedBtn.className = 'task-action-btn task-failed-btn';
      failedBtn.innerHTML = '✗';
      failedBtn.title = 'Mark as Failed';
      failedBtn.addEventListener('click', () => {
        completeTask(task.id, 'failed');
      });
      
      taskActions.appendChild(doneBtn);
      taskActions.appendChild(failedBtn);
    }
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'task-action-btn task-delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.title = 'Delete';
    deleteBtn.addEventListener('click', () => {
      deleteTask(task.id, isCompleted);
    });
    
    taskActions.appendChild(deleteBtn);
    
    taskItem.appendChild(taskContent);
    taskItem.appendChild(taskActions);
    
    return taskItem;
  }
  
  function saveTask() {
    const title = taskTitleInput.value.trim();
    
    if (!title) {
      alert('Please enter a task title');
      return;
    }
    
    chrome.storage.sync.get(['tasks'], function(result) {
      const tasks = result.tasks || [];
      
      const newTask = {
        id: Date.now().toString(),
        title: title,
        date: new Date().toISOString()
      };
      
      tasks.unshift(newTask); // Add to the beginning of the array
      
      chrome.storage.sync.set({ tasks: tasks }, function() {
        // Clear input and reload tasks
        taskTitleInput.value = '';
        taskTitleInput.focus();
        loadTasks();
      });
    });
  }
  
  function completeTask(id, status) {
    chrome.storage.sync.get(['tasks', 'completedTasks'], function(result) {
      let tasks = result.tasks || [];
      let completedTasks = result.completedTasks || [];
      
      // Find the task to complete
      const index = tasks.findIndex(task => task.id === id);
      if (index !== -1) {
        const task = tasks[index];
        
        // Add status and completion time
        task.status = status;
        task.completedAt = new Date().toISOString();
        
        // Move task from active to completed
        completedTasks.unshift(task);
        tasks.splice(index, 1);
        
        // Update storage
        chrome.storage.sync.set({ 
          tasks: tasks,
          completedTasks: completedTasks 
        }, function() {
          loadTasks();
        });
      }
    });
  }
  
  function deleteTask(id, isCompleted) {
    const storageKey = isCompleted ? 'completedTasks' : 'tasks';
    
    chrome.storage.sync.get([storageKey], function(result) {
      let items = result[storageKey] || [];
      
      // Remove the task
      items = items.filter(item => item.id !== id);
      
      // Update storage
      const update = {};
      update[storageKey] = items;
      
      chrome.storage.sync.set(update, function() {
        loadTasks();
      });
    });
  }
  
  function toggleAddForm() {
    hideAllContainers();
    addForm.classList.remove('hidden');
    noteTitleInput.focus();
  }

  function toggleAddTagForm() {
    hideAllContainers();
    addTagForm.classList.remove('hidden');
    tagNameInput.focus();
  }
  
  function hideAllContainers() {
    // Hide all containers
    notesContainer.classList.add('hidden');
    addForm.classList.add('hidden');
    addTagForm.classList.add('hidden');
    editForm.classList.add('hidden');
    taskManager.classList.add('hidden');
    timerContainer.classList.add('hidden');
  }
  
  function showNotesContainer() {
    hideAllContainers();
    notesContainer.classList.remove('hidden');
  }

  function loadTags(callback) {
    chrome.storage.sync.get(['tags'], function(result) {
      const tags = result.tags || [];
      console.log('Loaded tags:', tags);
      
      // Update tag selects
      updateTagSelects(tags);
      
      if (callback) callback();
    });
  }

  function updateTagSelects(tags) {
    // Clear tag filter select (keeping only "All Tags")
    while (tagFilter.options.length > 1) {
      tagFilter.remove(1);
    }
    
    // Clear note tag selects completely
    noteTagSelect.innerHTML = '';
    editTagSelect.innerHTML = '';
    
    // Add tags to all selects
    tags.forEach(tag => {
      // Add to tag filter
      const filterOption = document.createElement('option');
      filterOption.value = tag.id;
      filterOption.textContent = tag.name;
      tagFilter.appendChild(filterOption);
      
      // Add to note tag select
      const noteOption = document.createElement('option');
      noteOption.value = tag.id;
      noteOption.textContent = tag.name;
      noteTagSelect.appendChild(noteOption);
      
      // Add to edit tag select
      const editOption = document.createElement('option');
      editOption.value = tag.id;
      editOption.textContent = tag.name;
      editTagSelect.appendChild(editOption);
    });
    
    // Set default values
    if (tags.length > 0) {
      noteTagSelect.value = tags[0].id;
      editTagSelect.value = tags[0].id;
    }
  }

  function loadNotes() {
    filterNotes();
  }

  function filterNotes() {
    const selectedTagId = tagFilter.value;
    
    chrome.storage.sync.get(['notes', 'tags'], function(result) {
      const notes = result.notes || [];
      const tags = result.tags || [];
      
      console.log('Filtering notes. Total:', notes.length);
      
      // Filter notes based on selected tag
      let filteredNotes = notes;
      
      if (selectedTagId !== 'all') {
        filteredNotes = notes.filter(note => note.tagId === selectedTagId);
      }
      
      // Update UI
      updateNotesUI(filteredNotes, tags);
    });
  }

  function updateNotesUI(notes, tags) {
    notesList.innerHTML = '';
    
    if (notes.length === 0) {
      noNotes.style.display = 'block';
      return;
    }
    
    noNotes.style.display = 'none';
    
    notes.forEach(note => {
      const noteElement = createNoteElement(note, tags);
      notesList.appendChild(noteElement);
    });
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function createNoteElement(note, tags) {
    const noteItem = document.createElement('div');
    noteItem.className = 'note-item';
    noteItem.setAttribute('data-id', note.id);
    
    // Find tag for this note
    const tag = tags.find(t => t.id === note.tagId) || tags[0];
    
    // Create header container to properly align date and actions
    const noteHeader = document.createElement('div');
    noteHeader.className = 'note-header';
    
    const noteDate = document.createElement('div');
    noteDate.className = 'note-date';
    noteDate.textContent = formatDate(note.date);
    
    const noteActions = document.createElement('div');
    noteActions.className = 'note-actions';
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'action-btn copy-btn';
    copyBtn.innerHTML = '📋';
    copyBtn.title = 'Copy Note';
    copyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyNoteToClipboard(note, tag);
    });
    
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit-btn';
    editBtn.innerHTML = '✏️';
    editBtn.title = 'Edit';
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showEditForm(note);
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.title = 'Delete';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteNote(note.id);
    });
    
    noteActions.appendChild(copyBtn);
    noteActions.appendChild(editBtn);
    noteActions.appendChild(deleteBtn);
    
    // Add date and actions to the header
    noteHeader.appendChild(noteDate);
    noteHeader.appendChild(noteActions);
    
    const noteTitle = document.createElement('div');
    noteTitle.className = 'note-title';
    noteTitle.textContent = note.title;
    
    // Add tag badge if tag exists
    if (tag) {
      const tagBadge = document.createElement('span');
      tagBadge.className = 'tag-badge';
      tagBadge.textContent = tag.name;
      tagBadge.style.backgroundColor = tag.color;
      noteTitle.appendChild(tagBadge);
    }
    
    const noteContent = document.createElement('div');
    noteContent.className = 'note-content';
    noteContent.textContent = note.content;
    
    noteItem.appendChild(noteHeader);
    noteItem.appendChild(noteTitle);
    noteItem.appendChild(noteContent);
    
    return noteItem;
  }

  function copyNoteToClipboard(note, tag) {
    const formattedNote = `Date: ${formatDate(note.date)}
Title: ${note.title}
Note content: ${note.content}
Tag: ${tag ? tag.name : 'None'}`;
    
    navigator.clipboard.writeText(formattedNote)
      .then(() => {
        // Show success feedback
        chrome.action.setBadgeText({ text: "✓" });
        chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
        
        setTimeout(() => {
          chrome.action.setBadgeText({ text: "" });
        }, 2000);
      })
      .catch(err => {
        console.error('Error copying to clipboard:', err);
        alert('Failed to copy note to clipboard');
      });
  }

  function getCurrentUrl(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      callback(tabs[0] ? tabs[0].url : "");
    });
  }

  function saveNote() {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();
    const tagId = noteTagSelect.value;
    
    if (!title || !content) {
      alert('Please enter both title and content');
      return;
    }
    
    getCurrentUrl(function(currentUrl) {
      chrome.storage.sync.get(['notes'], function(result) {
        const notes = result.notes || [];
        const newNote = {
          id: Date.now().toString(),
          title: title,
          content: content,
          tagId: tagId,
          date: new Date().toISOString(),
          url: currentUrl
        };
        
        notes.unshift(newNote);
        
        chrome.storage.sync.set({ notes: notes }, function() {
          showNotesContainer();
          loadNotes();
        });
      });
    });
  }

  function saveTag() {
    const name = tagNameInput.value.trim();
    
    if (!name) {
      alert('Please enter a tag name');
      return;
    }
    
    chrome.storage.sync.get(['tags'], function(result) {
      const tags = result.tags || [];
      
      // Check if tag with same name already exists
      if (tags.some(tag => tag.name.toLowerCase() === name.toLowerCase())) {
        alert('A tag with this name already exists');
        return;
      }
      
      // Generate soft color for the tag
      const colors = [
        'var(--yellow-note)', // Yellow
        'var(--blue-note)',   // Blue
        'var(--green-note)',  // Green
        'var(--pink-note)'    // Pink
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      const newTag = {
        id: Date.now().toString(),
        name: name,
        color: randomColor
      };
      
      tags.push(newTag);
      
      chrome.storage.sync.set({ tags: tags }, function() {
        showNotesContainer();
        loadTags(function() {
          loadNotes();
        });
      });
    });
  }

  function showEditForm(note) {
    editTitleInput.value = note.title;
    editContentInput.value = note.content;
    editTagSelect.value = note.tagId || 'general';
    editIdInput.value = note.id;
    
    hideAllContainers();
    editForm.classList.remove('hidden');
    editTitleInput.focus();
  }

  function updateNote() {
    const id = editIdInput.value;
    const title = editTitleInput.value.trim();
    const content = editContentInput.value.trim();
    const tagId = editTagSelect.value;
    
    if (!title || !content) {
      alert('Please enter both title and content');
      return;
    }
    
    chrome.storage.sync.get(['notes'], function(result) {
      let notes = result.notes || [];
      
      const index = notes.findIndex(note => note.id === id);
      if (index !== -1) {
        // Keep the original URL and date
        const originalUrl = notes[index].url;
        const originalDate = notes[index].date;
        
        notes[index] = {
          id: id,
          title: title,
          content: content,
          tagId: tagId,
          date: originalDate,
          url: originalUrl,
          updatedAt: new Date().toISOString()
        };
        
        chrome.storage.sync.set({ notes: notes }, function() {
          showNotesContainer();
          loadNotes();
        });
      }
    });
  }

  function deleteNote(id) {
    if (confirm('Are you sure you want to delete this note?')) {
      chrome.storage.sync.get(['notes'], function(result) {
        let notes = result.notes || [];
        notes = notes.filter(note => note.id !== id);
        
        chrome.storage.sync.set({ notes: notes }, function() {
          loadNotes();
        });
      });
    }
  }
});