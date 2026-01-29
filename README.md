# TRMNL Chrome Extension

A Chrome extension that displays images from TRMNL's API in your new tab page with automatic refresh functionality. **Note**: requires a TRMNL account with a physical device or [BYOD](https://shop.trmnl.com/products/byod) license.

## Features

- Displays TRMNL images in new tab pages
- Automatic image refresh
- Ability to select which device to display (if you have multiple devices)

## Installation

Google Chrome:

1. Clone this repository (`git clone git@github.com:usetrmnl/trmnl-chrome.git`)
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

Firefox:

1. Clone this repository (`git clone git@github.com:usetrmnl/trmnl-chrome.git`)
2. Open Firefox and navigate to `about:addons`
3. Click the gear cog icon in the top right corner and select "Debug add-ons"
4. Click "Load Temporary Add-on..." and select the `manifest.json` file inside the extension directory

## Setup

1. You will be prompted to login to your TRMNL account (if you haven't already)
2. Open a new tab and the current screen on your device will be displayed

## Usage

- Open a new tab to see the current TRMNL image

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
- `background.js` - Background service worker for core functionality
- `dashboard-content.js` - Content script that runs on the dashboard page
- `devtools.js` - DevTools panel integration
- `panel.js/.html` - DevTools panel implementation
- `styles.css` - Styling for new tab and popup

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
