document.addEventListener('DOMContentLoaded', function() {
  console.log('Popup loaded');
  
  // DOM Elements
  const addBtn = document.getElementById('add-btn');
  const addTagBtn = document.getElementById('add-tag-btn');
  const addForm = document.getElementById('add-form');
  const addTagForm = document.getElementById('add-tag-form');
  const editForm = document.getElementById('edit-form');
  const linksList = document.getElementById('links-list');
  const noLinks = document.getElementById('no-links');
  const saveLinkBtn = document.getElementById('save-link-btn');
  const saveTagBtn = document.getElementById('save-tag-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const cancelTagBtn = document.getElementById('cancel-tag-btn');
  const updateLinkBtn = document.getElementById('update-link-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const linkNameInput = document.getElementById('link-name');
  const linkUrlInput = document.getElementById('link-url');
  const linkTagSelect = document.getElementById('link-tag');
  const tagNameInput = document.getElementById('tag-name');
  const editNameInput = document.getElementById('edit-name');
  const editUrlInput = document.getElementById('edit-url');
  const editTagSelect = document.getElementById('edit-tag');
  const editIdInput = document.getElementById('edit-id');
  const searchInput = document.getElementById('search');
  const tagFilter = document.getElementById('tag-filter');

  // Initialize storage and load data
  initializeStorage(function() {
    loadTags(function() {
      loadLinks();
    });
  });

  // Event Listeners
  addBtn.addEventListener('click', toggleAddForm);
  addTagBtn.addEventListener('click', toggleAddTagForm);
  saveLinkBtn.addEventListener('click', saveLink);
  saveTagBtn.addEventListener('click', saveTag);
  cancelBtn.addEventListener('click', toggleAddForm);
  cancelTagBtn.addEventListener('click', toggleAddTagForm);
  updateLinkBtn.addEventListener('click', updateLink);
  cancelEditBtn.addEventListener('click', () => {
    editForm.classList.add('hidden');
  });
  searchInput.addEventListener('input', function() {
    filterLinks();
  });
  tagFilter.addEventListener('change', function() {
    filterLinks();
  });

  // Functions
  function initializeStorage(callback) {
    chrome.storage.sync.get(['links', 'tags'], function(result) {
      let updates = {};
      let needsUpdate = false;
      
      // Initialize links array if it doesn't exist
      if (!result.links) {
        updates.links = [];
        needsUpdate = true;
        console.log('Initializing links array');
      }
      
      // Initialize tags array if it doesn't exist
      if (!result.tags) {
        updates.tags = [
          { id: 'general', name: 'General', color: '#a5c8e1' }
        ];
        needsUpdate = true;
        console.log('Initializing tags with default');
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

  function toggleAddForm() {
    // Hide tag form if visible
    addTagForm.classList.add('hidden');
    editForm.classList.add('hidden');
    
    // Toggle add link form
    addForm.classList.toggle('hidden');
    if (!addForm.classList.contains('hidden')) {
      linkNameInput.focus();
    } else {
      // Clear form
      linkNameInput.value = '';
      linkUrlInput.value = '';
      linkTagSelect.value = 'general';
    }
  }

  function toggleAddTagForm() {
    // Hide other forms if visible
    addForm.classList.add('hidden');
    editForm.classList.add('hidden');
    
    // Toggle add tag form
    addTagForm.classList.toggle('hidden');
    if (!addTagForm.classList.contains('hidden')) {
      tagNameInput.focus();
    } else {
      // Clear form
      tagNameInput.value = '';
    }
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
    
    // Clear link tag selects completely
    linkTagSelect.innerHTML = '';
    editTagSelect.innerHTML = '';
    
    // Add tags to all selects
    tags.forEach(tag => {
      // Add to tag filter
      const filterOption = document.createElement('option');
      filterOption.value = tag.id;
      filterOption.textContent = tag.name;
      tagFilter.appendChild(filterOption);
      
      // Add to link tag select
      const linkOption = document.createElement('option');
      linkOption.value = tag.id;
      linkOption.textContent = tag.name;
      linkTagSelect.appendChild(linkOption);
      
      // Add to edit tag select
      const editOption = document.createElement('option');
      editOption.value = tag.id;
      editOption.textContent = tag.name;
      editTagSelect.appendChild(editOption);
    });
    
    // Set default values
    if (tags.length > 0) {
      linkTagSelect.value = tags[0].id;
      editTagSelect.value = tags[0].id;
    }
  }

  function loadLinks() {
    filterLinks();
  }

  function filterLinks() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedTagId = tagFilter.value;
    
    chrome.storage.sync.get(['links', 'tags'], function(result) {
      const links = result.links || [];
      const tags = result.tags || [];
      
      console.log('Filtering links. Total:', links.length);
      console.log('Search term:', searchTerm);
      console.log('Selected tag:', selectedTagId);
      
      // Filter links based on search term and selected tag
      let filteredLinks = links.filter(link => {
        const matchesSearch = searchTerm === '' || 
                             link.name.toLowerCase().includes(searchTerm) || 
                             link.url.toLowerCase().includes(searchTerm);
        const matchesTag = selectedTagId === 'all' || link.tagId === selectedTagId;
        
        return matchesSearch && matchesTag;
      });
      
      console.log('Filtered links:', filteredLinks.length);
      
      // Update UI
      updateLinksUI(filteredLinks, tags);
    });
  }

  function updateLinksUI(links, tags) {
    linksList.innerHTML = '';
    
    if (links.length === 0) {
      noLinks.style.display = 'block';
      return;
    }
    
    noLinks.style.display = 'none';
    
    links.forEach(link => {
      const linkElement = createLinkElement(link, tags);
      linksList.appendChild(linkElement);
    });
  }

  function createLinkElement(link, tags) {
    const linkItem = document.createElement('div');
    linkItem.className = 'link-item';
    linkItem.setAttribute('data-id', link.id);
    
    const linkInfo = document.createElement('div');
    linkInfo.className = 'link-info';
    
    const linkName = document.createElement('div');
    linkName.className = 'link-name';
    linkName.textContent = link.name;
    
    // Find tag for this link
    const tag = tags.find(t => t.id === link.tagId) || tags[0];
    
    // Add tag badge if tag exists
    if (tag) {
      const tagBadge = document.createElement('span');
      tagBadge.className = 'tag-badge';
      tagBadge.textContent = tag.name;
      tagBadge.style.backgroundColor = tag.color || '#f3d7ca';
      linkName.appendChild(tagBadge);
    }
    
    const linkUrl = document.createElement('div');
    linkUrl.className = 'link-url';
    linkUrl.textContent = link.url;
    
    // When clicking on the link info, open the link in a new tab
    linkInfo.addEventListener('click', () => {
      chrome.tabs.create({ url: link.url });
    });
    
    linkInfo.appendChild(linkName);
    linkInfo.appendChild(linkUrl);
    
    const linkActions = document.createElement('div');
    linkActions.className = 'link-actions';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'action-btn edit-btn';
    editBtn.innerHTML = '✏️';
    editBtn.title = 'Edit';
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showEditForm(link);
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'action-btn delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.title = 'Delete';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteLink(link.id);
    });
    
    linkActions.appendChild(editBtn);
    linkActions.appendChild(deleteBtn);
    
    linkItem.appendChild(linkInfo);
    linkItem.appendChild(linkActions);
    
    return linkItem;
  }

  function saveLink() {
    const name = linkNameInput.value.trim();
    let url = linkUrlInput.value.trim();
    const tagId = linkTagSelect.value;
    
    if (!name || !url) {
      alert('Please enter both name and URL');
      return;
    }
    
    // Add http:// if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    chrome.storage.sync.get(['links'], function(result) {
      const links = result.links || [];
      const newLink = {
        id: Date.now().toString(),
        name: name,
        url: url,
        tagId: tagId,
        date: new Date().toISOString()
      };
      
      links.unshift(newLink);
      
      chrome.storage.sync.set({ links: links }, function() {
        toggleAddForm();
        filterLinks();
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
      
      // Generate random soft color
      const colors = [
        '#a5c8e1', // Blue
        '#f3d7ca', // Peach
        '#c3e1a5', // Green
        '#d5a5e1', // Purple
        '#e1cfa5', // Tan
        '#a5e1cf', // Teal
        '#e1a5a5', // Pink
        '#a5a5e1'  // Lavender
      ];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      const newTag = {
        id: Date.now().toString(),
        name: name,
        color: randomColor
      };
      
      tags.push(newTag);
      
      chrome.storage.sync.set({ tags: tags }, function() {
        toggleAddTagForm();
        loadTags(function() {
          filterLinks();
        });
      });
    });
  }

  function showEditForm(link) {
    editNameInput.value = link.name;
    editUrlInput.value = link.url;
    editTagSelect.value = link.tagId || 'general';
    editIdInput.value = link.id;
    
    addForm.classList.add('hidden');
    addTagForm.classList.add('hidden');
    editForm.classList.remove('hidden');
    
    editNameInput.focus();
  }

  function updateLink() {
    const id = editIdInput.value;
    const name = editNameInput.value.trim();
    let url = editUrlInput.value.trim();
    const tagId = editTagSelect.value;
    
    if (!name || !url) {
      alert('Please enter both name and URL');
      return;
    }
    
    // Add http:// if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    chrome.storage.sync.get(['links'], function(result) {
      let links = result.links || [];
      
      const index = links.findIndex(link => link.id === id);
      if (index !== -1) {
        links[index].name = name;
        links[index].url = url;
        links[index].tagId = tagId;
        links[index].updatedAt = new Date().toISOString();
        
        chrome.storage.sync.set({ links: links }, function() {
          editForm.classList.add('hidden');
          filterLinks();
        });
      }
    });
  }

  function deleteLink(id) {
    if (confirm('Are you sure you want to delete this link?')) {
      chrome.storage.sync.get(['links'], function(result) {
        let links = result.links || [];
        links = links.filter(link => link.id !== id);
        
        chrome.storage.sync.set({ links: links }, function() {
          filterLinks();
        });
      });
    }
  }
});