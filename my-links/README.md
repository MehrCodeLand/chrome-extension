# Link Saver Chrome Extension

A clean, feature-rich Chrome extension for saving and organizing links with tags.

## Features

- **Save Links**: Manually add links or use the context menu on any webpage
- **Tag System**: Organize links with customizable tags
- **Filter & Search**: Quickly find your saved links by tag or keyword
- **Clean Interface**: Simple and intuitive UI with soft colors
- **Easy Management**: Edit or delete links with just a few clicks

## How to Use

### Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked" and select the extension directory

### Adding Links

- **Manual**: Click the + button in the extension popup, then enter the link details
- **Context Menu**: Right-click on any link on a webpage and select "Save to Link Saver"

### Managing Tags

1. Click the # button to create a new tag
2. Enter a name for your tag and click "Save"
3. When adding or editing links, select a tag from the dropdown

### Filtering Links

- Use the "Filter by tag" dropdown to show links from a specific tag
- Use the search box to find links by name or URL

## Development

The extension is built with vanilla JavaScript and follows Chrome extension best practices.

### File Structure

```
my-extension/
├── manifest.json
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── popup.html
├── popup.js
├── popup.css
├── content.js
└── background.js
```

## Creator

This extension was created by [MehrCodeLand](https://github.com/MehrCodeLand).