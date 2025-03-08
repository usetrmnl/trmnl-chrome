# TRMNL Chrome Extension

A Chrome extension that displays images from TRMNL's API in your new tab page with automatic refresh functionality.

## Features

- Displays TRMNL images in new tab pages
- Automatic image refresh at configurable intervals
- Manual refresh option
- Countdown timer showing time until next refresh
- Info overlay with controls on hover
- Settings popup for API key management
- Error handling and retry logic for failed API requests
- API key storage

## Installation

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Setup

1. Get your TRMNL API key from [TRMNL website]
2. Click the TRMNL extension icon in Chrome to open settings
3. Enter your API key and click Save
4. Open a new tab to start seeing TRMNL images

## Usage

- Open a new tab to see the current TRMNL image
- Hover near the bottom of the screen to show controls
- Click "Refresh Now" to manually fetch a new image
- Click "Settings" to update your API key or check status
- The countdown timer shows when the next automatic refresh will occur

## Development

The extension is built with:

- Vanilla JavaScript
- Chrome Extension APIs
- HTML/CSS
- TRMNL API integration

Key files:
- `manifest.json` - Extension configuration
- `newtab.js/.html` - New tab page implementation
- `popup.js/.html` - Settings popup implementation
- `background.js` - Background service worker
- `styles.css` - Styling for new tab and popup

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
