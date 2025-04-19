document.addEventListener('DOMContentLoaded', function() {
    console.log('Popup loaded');
    
    // DOM Elements
    const addBtn = document.getElementById('add-btn');
    const addForm = document.getElementById('add-form');
    const editForm = document.getElementById('edit-form');
    const linksList = document.getElementById('links-list');
    const noLinks = document.getElementById('no-links');
    const saveLinkBtn = document.getElementById('save-link-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const updateLinkBtn = document.getElementById('update-link-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const linkNameInput = document.getElementById('link-name');
    const linkUrlInput = document.getElementById('link-url');
    const editNameInput = document.getElementById('edit-name');
    const editUrlInput = document.getElementById('edit-url');
    const editIdInput = document.getElementById('edit-id');
    const searchInput = document.getElementById('search');
  
    // Initialize storage if needed
    chrome.storage.sync.get(['links'], function(result) {
      if (!result.links) {
        chrome.storage.sync.set({ links: [] }, function() {
          console.log('Initialized empty links array');
          loadLinks();
        });
      } else {
        console.log('Found existing links: ', result.links.length);
        loadLinks();
      }
    });
  
    // Event Listeners
    addBtn.addEventListener('click', toggleAddForm);
    saveLinkBtn.addEventListener('click', saveLink);
    cancelBtn.addEventListener('click', toggleAddForm);
    updateLinkBtn.addEventListener('click', updateLink);
    cancelEditBtn.addEventListener('click', () => {
      editForm.classList.add('hidden');
    });
    searchInput.addEventListener('input', searchLinks);
  
    // Functions
    function toggleAddForm() {
      addForm.classList.toggle('hidden');
      if (!addForm.classList.contains('hidden')) {
        linkNameInput.focus();
      } else {
        // Clear form
        linkNameInput.value = '';
        linkUrlInput.value = '';
      }
    }
  
    function loadLinks(searchTerm = '') {
      chrome.storage.sync.get(['links'], function(result) {
        const links = result.links || [];
        linksList.innerHTML = '';
        
        if (links.length === 0) {
          noLinks.classList.remove('hidden');
          return;
        }
        
        noLinks.classList.add('hidden');
        
        const filteredLinks = searchTerm 
          ? links.filter(link => 
              link.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              link.url.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : links;
        
        if (filteredLinks.length === 0) {
          linksList.innerHTML = '<div class="no-links">No matching links found.</div>';
          return;
        }
        
        filteredLinks.forEach(link => {
          const linkElement = createLinkElement(link);
          linksList.appendChild(linkElement);
        });
      });
    }
  
    function createLinkElement(link) {
      const linkItem = document.createElement('div');
      linkItem.className = 'link-item';
      linkItem.setAttribute('data-id', link.id);
      
      const linkInfo = document.createElement('div');
      linkInfo.className = 'link-info';
      
      const linkName = document.createElement('div');
      linkName.className = 'link-name';
      linkName.textContent = link.name;
      
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
          date: new Date().toISOString()
        };
        
        links.unshift(newLink);
        
        chrome.storage.sync.set({ links: links }, function() {
          toggleAddForm();
          loadLinks();
        });
      });
    }
  
    function showEditForm(link) {
      editNameInput.value = link.name;
      editUrlInput.value = link.url;
      editIdInput.value = link.id;
      editForm.classList.remove('hidden');
      addForm.classList.add('hidden');
      editNameInput.focus();
    }
  
    function updateLink() {
      const id = editIdInput.value;
      const name = editNameInput.value.trim();
      let url = editUrlInput.value.trim();
      
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
          links[index].updatedAt = new Date().toISOString();
          
          chrome.storage.sync.set({ links: links }, function() {
            editForm.classList.add('hidden');
            loadLinks(searchInput.value.trim());
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
            loadLinks(searchInput.value.trim());
          });
        });
      }
    }
  
    function searchLinks() {
      const searchTerm = searchInput.value.trim();
      loadLinks(searchTerm);
    }
  });