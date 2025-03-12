// JavaScript for the new tab page

document.addEventListener("DOMContentLoaded", initNewTab);

// DOM references
const imageElement = document.getElementById("trmnl-image");
const loadingElement = document.getElementById("loading");
const errorContainer = document.getElementById("error-container");
const infoOverlay = document.getElementById("info-overlay");
const nextRefreshElement = document.getElementById("next-refresh-time");
const refreshButton = document.getElementById("refresh-now");
const settingsButton = document.getElementById("open-settings");
const apiKeyInput = document.getElementById("api-key-input");
const saveApiKeyButton = document.getElementById("save-api-key");

// State
let refreshTimeoutId = null;
let countdownIntervalId = null;

// Initialize the new tab page
async function initNewTab() {
  setupEventListeners();
  await loadImage();

  // Show info overlay when hovering on the bottom of the screen
  // document.addEventListener("mousemove", (e) => {
  //   if (e.clientY > window.innerHeight - 100) {
  //     infoOverlay.classList.remove("hidden");
  //   } else {
  //     infoOverlay.classList.add("hidden");
  //   }
  // });
}

// Set up event listeners
function setupEventListeners() {
  // Refresh now button
  refreshButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "forceRefresh" }, () => {
      loadImage();
    });
  });

  // Settings button
  settingsButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openOptions" });
    // Alternatively, open the popup
    if (chrome.action && chrome.action.openPopup) {
      chrome.action.openPopup();
    }
  });

  // Save API key button
  saveApiKeyButton.addEventListener("click", saveApiKey);
  apiKeyInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      saveApiKey();
    }
  });

  // Listen for image updates from background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "imageUpdated") {
      console.log("Received image update notification");
      loadImage();
      // Always call sendResponse in message listeners
      if (sendResponse) sendResponse({ received: true });
    }
    // Return true if sendResponse will be called asynchronously
    return false;
  });
}

// Load the image from storage
async function loadImage() {
  loadingElement.classList.remove("hidden");

  chrome.runtime.sendMessage({ action: "getCurrentImage" }, (response) => {
    if (!response || !response.currentImage) {
      showApiKeyPrompt();
      return;
    }

    // Hide error container if it was showing
    errorContainer.classList.add("hidden");

    // Display the image
    // The image is now stored as a data URL
    imageElement.src = response.currentImage.url;
    imageElement.onload = () => {
      loadingElement.classList.add("hidden");
      imageElement.classList.remove("hidden");
    };

    // Handle loading errors
    imageElement.onerror = () => {
      console.error("Error loading image data URL");
      loadingElement.textContent = "Error loading image";
      // Request a fresh image
      chrome.runtime.sendMessage({ action: "forceRefresh" });
    };

    // Update next refresh info
    updateRefreshTimer(response.nextFetch);
  });
}

// Save the API key
function saveApiKey() {
  const apiKey = apiKeyInput.value.trim();
  if (apiKey) {
    chrome.runtime.sendMessage(
      {
        action: "saveApiKey",
        apiKey: apiKey,
      },
      () => {
        // Clear input and refresh the display
        apiKeyInput.value = "";
        errorContainer.classList.add("hidden");
        loadImage();
      },
    );
  }
}

// Show the API key prompt
function showApiKeyPrompt() {
  loadingElement.classList.add("hidden");
  imageElement.classList.add("hidden");
  errorContainer.classList.remove("hidden");
}

// Update the refresh countdown timer
function updateRefreshTimer(nextFetchTimestamp) {
  if (!nextFetchTimestamp) {
    nextRefreshElement.textContent = "Unknown";
    return;
  }

  // Clear existing timeouts and intervals
  if (refreshTimeoutId) clearTimeout(refreshTimeoutId);
  if (countdownIntervalId) clearInterval(countdownIntervalId);

  // Set timeout to load image at refresh time
  const now = Date.now();
  const timeToRefresh = Math.max(0, nextFetchTimestamp - now);

  if (timeToRefresh > 0) {
    // Add a small buffer (2 seconds) to ensure the background has time to fetch
    refreshTimeoutId = setTimeout(() => {
      // Check if the image has been updated in background
      chrome.runtime.sendMessage({ action: "getCurrentImage" }, (response) => {
        const currentTime = Date.now();
        // Only reload if the last fetch time is recent (within last 10 seconds)
        if (
          response &&
          response.lastFetch &&
          currentTime - response.lastFetch < 10000
        ) {
          loadImage();
        } else {
          // If not updated recently, the background refresh might have failed
          // Request a refresh and then load the image
          chrome.runtime.sendMessage({ action: "forceRefresh" }, () => {
            setTimeout(loadImage, 2000);
          });
        }
      });
    }, timeToRefresh);

    // Update countdown display
    updateCountdown(nextFetchTimestamp);
    countdownIntervalId = setInterval(() => {
      updateCountdown(nextFetchTimestamp);
    }, 1000);
  }
}

// Update the countdown display
function updateCountdown(nextFetchTimestamp) {
  const now = Date.now();
  const timeRemaining = Math.max(0, nextFetchTimestamp - now);

  if (timeRemaining <= 0) {
    nextRefreshElement.textContent = "Now";
    if (countdownIntervalId) {
      clearInterval(countdownIntervalId);
    }
    return;
  }

  // Format the time remaining
  const seconds = Math.floor((timeRemaining / 1000) % 60);
  const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));

  nextRefreshElement.textContent = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

// Helper to pad numbers with leading zeros
function padZero(num) {
  return num.toString().padStart(2, "0");
}
