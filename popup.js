// JavaScript for the popup

document.addEventListener("DOMContentLoaded", initPopup);

// DOM references
const apiKeyInput = document.getElementById("api-key");
const saveButton = document.getElementById("save-settings");
const refreshButton = document.getElementById("refresh-now");
const statusElement = document.getElementById("status");
const lastUpdatedElement = document.getElementById("last-updated");
const nextUpdateElement = document.getElementById("next-update");
const refreshRateElement = document.getElementById("refresh-rate");

// Initialize the popup
async function initPopup() {
  setupEventListeners();
  await loadSettings();
  updateStatusInfo();
}

// Set up event listeners
function setupEventListeners() {
  // Save button
  saveButton.addEventListener("click", saveSettings);

  // Refresh button
  refreshButton.addEventListener("click", refreshImage);

  // Enter key in input field
  apiKeyInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      saveSettings();
    }
  });
}

// Load settings from storage
async function loadSettings() {
  const storage = await chrome.storage.local.get(["apiKey"]);

  if (storage.apiKey) {
    // Mask the API key for display
    apiKeyInput.value = storage.apiKey;
  }
}

// Save settings to storage
async function saveSettings() {
  const apiKey = apiKeyInput.value.trim();

  if (apiKey) {
    await chrome.runtime.sendMessage({
      action: "saveApiKey",
      apiKey: apiKey,
    });

    showStatus("Settings saved");
    setTimeout(hideStatus, 3000);
  } else {
    showStatus("API key cannot be empty", true);
  }
}

// Force an image refresh
function refreshImage() {
  showStatus("Refreshing image...");

  chrome.runtime.sendMessage({ action: "forceRefresh" }, (response) => {
    if (response && response.success) {
      showStatus("Image refreshed successfully");
    } else {
      showStatus("Refresh scheduled (retry in progress)", true);
    }

    setTimeout(() => {
      updateStatusInfo();
      hideStatus();
    }, 3000);
  });
}

// Update the status of last/next refresh
async function updateStatusInfo() {
  const storage = await chrome.storage.local.get([
    "lastFetch",
    "nextFetch",
    "refreshRate",
    "retryCount",
    "retryAfter",
  ]);

  if (storage.lastFetch) {
    const lastFetchDate = new Date(storage.lastFetch);
    lastUpdatedElement.textContent = `Last updated: ${formatDateTime(lastFetchDate)}`;
  }

  // Check if we're in a retry backoff period
  if (storage.retryAfter && Date.now() < storage.retryAfter) {
    const retryDate = new Date(storage.retryAfter);
    nextUpdateElement.textContent = `Retry after: ${formatDateTime(retryDate)}`;

    // Add retry count if available
    if (storage.retryCount) {
      nextUpdateElement.textContent += ` (attempt ${storage.retryCount})`;
    }
  }
  // Otherwise show the normal next update time
  else if (storage.nextFetch) {
    const nextFetchDate = new Date(storage.nextFetch);
    nextUpdateElement.textContent = `Next update: ${formatDateTime(nextFetchDate)}`;
  }

  if (storage.refreshRate) {
    refreshRateElement.textContent = `Refresh rate: ${storage.refreshRate} seconds`;
  }
}

// Show a status message
function showStatus(message, isError = false) {
  statusElement.textContent = message;
  statusElement.style.color = isError ? "#ff5555" : "#55ff55";
}

// Hide the status message
function hideStatus() {
  statusElement.textContent = "";
}

// Format date and time
function formatDateTime(date) {
  return date.toLocaleString();
}
