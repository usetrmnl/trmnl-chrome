// JavaScript for the popup

document.addEventListener("DOMContentLoaded", initPopup);

// DOM references
let apiKeyInput;
let saveButton;
let refreshButton;
let statusElement;
let lastUpdatedElement;
let nextUpdateElement;
let refreshRateElement;

// Initialize the popup
async function initPopup() {
  // Initialize DOM references
  apiKeyInput = document.getElementById("api-key");
  saveButton = document.getElementById("save-settings");
  refreshButton = document.getElementById("refresh-now");
  statusElement = document.getElementById("status");
  lastUpdatedElement = document.getElementById("last-updated");
  nextUpdateElement = document.getElementById("next-update");
  refreshRateElement = document.getElementById("refresh-rate");

  setupEventListeners();
  await loadSettings();
  await loadDevices();
  updateStatusInfo();
}

async function loadDevices() {
  // Get the current environment
  const { environment } = await chrome.storage.local.get("environment");
  const apiUrl =
    environment === "development"
      ? "http://localhost:3000/devices.json"
      : "https://usetrmnl.com/devices.json";

  try {
    const response = await fetch(apiUrl);
    const devices = await response.json();

    // Store devices in local storage
    await chrome.storage.local.set({ devices });

    const { selectedDevice } = await chrome.storage.local.get("selectedDevice");

    const deviceSelect = document.getElementById("device-select");
    deviceSelect.innerHTML = ""; // Clear existing options

    if (devices && devices.length > 0) {
      devices.forEach((device) => {
        const option = document.createElement("option");
        option.value = device.api_key;
        option.textContent = device.name;
        option.selected =
          selectedDevice && selectedDevice.api_key === device.api_key;
        deviceSelect.appendChild(option);
      });

      // If no device is selected, select the first one
      if (!selectedDevice) {
        await chrome.storage.local.set({
          selectedDevice: devices[0],
          apiKey: devices[0].api_key,
        });
        chrome.runtime.sendMessage({ action: "forceRefresh" });
      }
    } else {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No devices found";
      deviceSelect.appendChild(option);
    }

    // Add change event listener
    deviceSelect.addEventListener("change", async (e) => {
      const selectedApiKey = e.target.value;
      const selectedDevice = devices.find((d) => d.api_key === selectedApiKey);

      if (selectedDevice) {
        // Show status immediately
        showStatus("Changing device...");

        try {
          // Update the device in storage
          await chrome.storage.local.set({
            selectedDevice,
            apiKey: selectedDevice.api_key,
            // Reset any retry information when changing device
            retryCount: 0,
            retryAfter: null,
            // Force a refresh by resetting the lastFetch time
            lastFetch: 0,
          });

          // Force refresh with a callback to verify it worked
          chrome.runtime.sendMessage({ action: "forceRefresh" }, (response) => {
            if (response && response.success) {
              // showStatus("Device changed and image refreshed");
              hideStatus();
            } else {
              hideStatus();
              // showStatus("Device changed but refresh failed, retrying...");
              // Try again after a short delay
              setTimeout(() => {
                chrome.runtime.sendMessage({ action: "forceRefresh" });
              }, 1000);
            }
          });
        } catch (error) {
          console.error("Error changing device:", error);
          showStatus("Error changing device", true);
        }
      }
    });
  } catch (error) {
    console.error("Error loading devices:", error);
    const deviceSelect = document.getElementById("device-select");
    deviceSelect.innerHTML = '<option value="">Error loading devices</option>';
  }
}

// Set up event listeners
function setupEventListeners() {
  // Save button
  if (saveButton) {
    saveButton.addEventListener("click", saveSettings);
  }

  // Refresh button
  if (refreshButton) {
    refreshButton.addEventListener("click", refreshImage);
  }

  // Enter key in input field
  if (apiKeyInput) {
    apiKeyInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        saveSettings();
      }
    });
  }
}

// Load settings from storage
async function loadSettings() {
  const storage = await chrome.storage.local.get(["apiKey"]);

  if (storage.apiKey && apiKeyInput) {
    // Mask the API key for display
    apiKeyInput.value = storage.apiKey;
  }
}

// Save settings to storage
async function saveSettings() {
  const apiKey = apiKeyInput ? apiKeyInput.value.trim() : "";

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

  if (storage.lastFetch && lastUpdatedElement) {
    const lastFetchDate = new Date(storage.lastFetch);
    lastUpdatedElement.textContent = `Last updated: ${formatDateTime(lastFetchDate)}`;
  }

  // Check if we're in a retry backoff period
  if (
    storage.retryAfter &&
    Date.now() < storage.retryAfter &&
    nextUpdateElement
  ) {
    const retryDate = new Date(storage.retryAfter);
    nextUpdateElement.textContent = `Retry after: ${formatDateTime(retryDate)}`;

    // Add retry count if available
    if (storage.retryCount) {
      nextUpdateElement.textContent += ` (attempt ${storage.retryCount})`;
    }
  }
  // Otherwise show the normal next update time
  else if (storage.nextFetch && nextUpdateElement) {
    const nextFetchDate = new Date(storage.nextFetch);
    nextUpdateElement.textContent = `Next update: ${formatDateTime(nextFetchDate)}`;
  }

  if (storage.refreshRate && refreshRateElement) {
    refreshRateElement.textContent = `Refresh rate: ${storage.refreshRate} seconds`;
  }
}

// Show a status message
function showStatus(message, isError = false) {
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.style.color = isError ? "#ff5555" : "#55ff55";
  }
}

// Hide the status message
function hideStatus() {
  if (statusElement) {
    statusElement.textContent = "";
  }
}

// Format date and time
function formatDateTime(date) {
  return date.toLocaleString();
}
