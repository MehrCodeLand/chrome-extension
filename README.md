# WordVault - Chrome Extension

> 🎓 **Save, Practice, and Master Your Vocabulary Journey**

WordVault is a powerful Chrome extension designed to help language learners save, organize, and practice their vocabulary words efficiently. Whether you're learning a new language or expanding your native vocabulary, WordVault makes word learning simple and effective.

![WordVault Logo](icons/icon128.png)

## 🚀 Features

### 📝 **Word Management**
- **Create Words**: Save words with meanings, examples, and language categories
- **Review Words**: Browse your saved vocabulary with search and filter options
- **Edit & Delete**: Modify or remove words as needed
- **Language Organization**: Categorize words by different languages or topics

### 🎯 **Practice System**
- **Interactive Practice Boxes**: 7-day practice tracking system for each word
- **Daily Practice Limits**: Prevents over-practicing (one session per day per word)
- **Progress Visualization**: Visual indicators showing your practice progress
- **Smart Filtering**: Practice words by language or search terms

### 📊 **Storage Management**
- **Dual Storage Options**: 
  - **Sync Storage** (100KB): Syncs across all your devices
  - **Local Storage** (5MB): Unlimited space, device-only storage
- **Smart Storage Monitoring**: Real-time storage usage tracking
- **One-Click Migration**: Easy switching between storage types
- **Storage Optimization**: Compact and clean unused data

### 💾 **Data Management**
- **Backup & Restore**: Export/import your complete word collection
- **Export Words**: Get all your words as plain text (word1 - word2 - word3)
- **Data Integrity**: Safe data handling with error prevention

## 🛠️ Installation

1. **Download the Extension Files**
2. **Enable Developer Mode** in Chrome:
   - Go to `chrome://extensions/`
   - Toggle "Developer mode" in the top right
3. **Load the Extension**:
   - Click "Load unpacked"
   - Select the WordVault folder
4. **Start Using**: Click the WordVault icon in your browser toolbar

## 📖 How to Use WordVault

### Getting Started

1. **Click the WordVault icon** in your Chrome toolbar
2. You'll see the main dashboard with three primary options:
   - **Create**: Add new words
   - **Review**: Browse saved words
   - **Practice**: Study your vocabulary

### 🆕 Creating Your First Word

1. Click **"Create"** from the main menu
2. **Enter the word** (e.g., "Guten Morgen")
3. **Add meaning and examples** in the text area
4. **Select language category** (or create a new one)
5. Click **"Save"** - your word is now stored!

### 📚 Reviewing Your Words

1. Click **"Review"** from the main menu
2. **Search words** using the search box
3. **Filter by language** using the dropdown
4. **Click any word** to see full details, edit, or delete

### 🎯 Practicing Vocabulary

1. Click **"Practice"** from the main menu
2. Each word shows **7 practice boxes**
3. **Click the next empty box** to mark today's practice
4. **One practice per day** - come back tomorrow for the next box!
5. **Track your progress** visually as boxes fill up

### 🏷️ Managing Languages

1. Click **"Add Language"** in the header
2. **Enter language name** (e.g., "German", "Spanish", "Technical Terms")
3. **Save** - now you can categorize words by this language

## 💾 Storage Management Made Simple

WordVault automatically manages your storage, but you have full control when needed.

### Understanding Storage Types

**🔄 Sync Storage (Default)**
- **Capacity**: 100KB (~500 words)
- **Benefits**: Syncs across all your Chrome/Edge devices
- **Best For**: Moderate vocabulary collections that you want everywhere

**💻 Local Storage**
- **Capacity**: 5MB (~25,000 words)
- **Benefits**: Unlimited space for massive collections
- **Best For**: Extensive vocabulary databases on a single device

### When Storage Gets Full

WordVault will automatically warn you when approaching storage limits:

1. **80% Full**: Yellow warning with remaining space info
2. **95% Full**: Red warning suggesting action
3. **100% Full**: Automatic suggestion to switch to Local Storage

### Managing Your Storage

Click **"📊 Storage"** in the bottom bar to:

- **View usage statistics** and remaining space
- **Switch storage types** with one click
- **Compact storage** to free up space
- **See your data summary** (words, languages, practices)

### 🔧 Storage Actions

**🗜️ Compact Storage**
- Removes orphaned data
- Trims whitespace
- Optimizes storage space
- Safe and reversible

**📱 Switch to Local Storage**
- Moves all data to local storage
- Gives you unlimited space
- Data stays on this device only

**☁️ Switch to Sync Storage**
- Moves data back to sync storage
- Enables cross-device synchronization
- Limited to 100KB capacity

## 🔄 Backup & Restore

### Creating Backups

1. Click **"Backup"** in the header
2. **JSON file downloads automatically** with your complete data
3. **Filename includes date**: `wordvault_backup_2024-12-19.json`
4. **Store safely** - this contains all your words, languages, and progress

### Restoring from Backup

1. Click **"Restore"** in the header
2. **Select your backup file** (.json format)
3. **Confirm the restore** - this replaces current data
4. **All data restored** including practice progress

### Exporting Words Only

Need just the words for studying elsewhere?

1. Click **"📝 Get Words"** in the bottom bar
2. **Text file downloads** with format: `word1 - word2 - word3`
3. **Perfect for flashcard apps** or other study tools

## 🎨 User Interface Guide

### Main Dashboard
- **Clean, intuitive design** with large action buttons
- **Dark theme** optimized for extended use
- **Responsive layout** adapts to different screen sizes

### Navigation
- **Home button** always returns to main dashboard
- **Header buttons** for quick access to key features
- **Bottom bar** for secondary actions (storage, export, GitHub)

### Visual Feedback
- **Practice boxes** show completion status
- **Storage bars** display usage levels
- **Color coding** for warnings and success states

## 🚨 Troubleshooting

### Common Issues

**"Storage quota exceeded" error:**
- Switch to Local Storage for unlimited space
- Or delete unused words to free up sync storage

**Words not syncing across devices:**
- Ensure you're using Sync Storage (not Local)
- Check if you're signed into Chrome on all devices

**Backup/restore not working:**
- Ensure you're selecting valid .json backup files
- Check file isn't corrupted or empty

**Practice boxes not working:**
- You can only practice once per day per word
- Make sure you're clicking the correct (next) empty box

### Getting Help

- **GitHub Repository**: [MehrCodeLand](https://github.com/MehrCodeLand)
- **Check browser console** for detailed error messages
- **Try refreshing** the extension popup if interface issues occur

## 🎯 Best Practices

### Effective Word Learning
1. **Add context** - include example sentences in meanings
2. **Practice daily** - consistency beats intensity
3. **Use categories** - organize by topics or difficulty
4. **Regular backup** - protect your vocabulary investment

### Storage Optimization
1. **Monitor usage** regularly through Storage management
2. **Use Local Storage** for large collections (1000+ words)
3. **Keep Sync Storage** for moderate collections you want on all devices
4. **Compact storage** monthly to maintain performance

### Organization Tips
1. **Create specific languages** (e.g., "Business English", "German A1")
2. **Use search function** to quickly find words
3. **Export word lists** for external study tools
4. **Regular reviews** of saved vocabulary

## 🔧 Technical Requirements

- **Chrome/Edge Browser** (Manifest V3 compatible)
- **Developer mode enabled** for manual installation
- **~360x520px popup space** for optimal experience

## 📄 File Structure

```
WordVault/
├── manifest.json          # Extension configuration
├── icons/                 # Extension icons (16, 48, 128px)
├── popup.html            # Main interface
├── popup.css             # Styling and themes
├── popup.js              # Core functionality
├── background.js         # Service worker
└── content.js            # Content script
```

## 🤝 Contributing

WordVault is created by **MehrCodeLand**. Visit our [GitHub repository](https://github.com/MehrCodeLand) for updates and contributions.

---

**Start building your vocabulary today with WordVault!** 🎓📚

*Happy Learning!* 🌟
