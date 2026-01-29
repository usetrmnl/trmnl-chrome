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
  await loadStyles();
  updateStatusInfo();
}

async function loadDevices() {
  // First try to get devices from local storage
  const { devices: storedDevices, environment } =
    await chrome.storage.local.get(["devices", "environment"]);

  let devices = [];

  // If we have devices in storage, use them first
  if (storedDevices && storedDevices.length > 0) {
    console.log("Using devices from local storage");
    devices = storedDevices;
  } else {
    // If no devices in storage, fetch from server
    console.log("No devices in storage, fetching from server");
    const apiUrl =
      environment === "development"
        ? "http://localhost:3000/devices.json"
        : "https://trmnl.com/devices.json";

    try {
      const response = await fetch(apiUrl);
      devices = await response.json();

      // Store devices in local storage for future use
      await chrome.storage.local.set({ devices });
    } catch (error) {
      console.error("Error fetching devices from server:", error);
      // If we can't fetch, ensure devices is at least an empty array
      devices = [];
    }
  }

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
      // Initial logging
      console.log("Device change initiated:", {
        deviceName: selectedDevice.name,
        apiKey: selectedDevice.api_key.substring(0, 8) + "...", // Log partial key for safety
        timestamp: new Date().toISOString(),
      });

      showStatus("Changing device...");

      try {
        // Log pre-update storage state
        const beforeState = await chrome.storage.local.get([
          "selectedDevice",
          "apiKey",
          "retryCount",
          "retryAfter",
          "lastFetch",
        ]);
        console.log("Storage state before update:", beforeState);

        // Update the device in storage
        await chrome.storage.local.set({
          selectedDevice,
          apiKey: selectedDevice.api_key,
          retryCount: 0,
          retryAfter: null,
          lastFetch: 0,
        });

        console.log("Storage updated with new device settings");

        // Verify storage update
        const afterState = await chrome.storage.local.get([
          "selectedDevice",
          "apiKey",
          "retryCount",
          "retryAfter",
          "lastFetch",
        ]);
        console.log("Storage state after update:", afterState);

        // Force refresh with detailed logging
        console.log("Initiating force refresh...");
        chrome.runtime.sendMessage({ action: "forceRefresh" }, (response) => {
          console.log("Force refresh response received:", {
            response,
            timestamp: new Date().toISOString(),
          });

          if (response && response.success) {
            console.log("Device change and refresh successful");
            hideStatus();
          } else {
            console.warn("Initial refresh attempt unsuccessful:", {
              response,
              error: response?.error,
              timestamp: new Date().toISOString(),
            });

            hideStatus();

            // Schedule retry
            console.log("Scheduling retry refresh...");
            setTimeout(() => {
              console.log("Executing retry refresh...");
              chrome.runtime.sendMessage(
                { action: "forceRefresh" },
                (retryResponse) => {
                  console.log("Retry refresh response:", {
                    response: retryResponse,
                    timestamp: new Date().toISOString(),
                  });

                  if (retryResponse && retryResponse.success) {
                    console.log("Retry refresh successful");
                  } else {
                    console.warn("Retry refresh unsuccessful:", {
                      response: retryResponse,
                      error: retryResponse?.error,
                    });
                  }
                },
              );
            }, 1000);
          }
        });
      } catch (error) {
        console.error("Error during device change process:", {
          error,
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        });
        showStatus("Error changing device", true);
      }
    } else {
      console.warn("No device found for selected API key:", {
        selectedApiKey: selectedApiKey
          ? selectedApiKey.substring(0, 8) + "..."
          : "none",
        timestamp: new Date().toISOString(),
      });
    }
  });
}

// Load display styles from storage
async function loadStyles() {
  const setStyle = async (key, value) => {
    const storage = await chrome.storage.local.get(["displayStyles"]);
    const styles = storage.displayStyles || {};
    styles[key] = value;
    await chrome.storage.local.set({ displayStyles: styles });
    await chrome.runtime.sendMessage({ action: "reloadStyles" });

    showStatus("Settings saved");
  }

  const { displayStyles } = await chrome.storage.local.get("displayStyles");

  const uiSelect = document.getElementById("ui-style-select");
  uiSelect.addEventListener("change", async (e) => setStyle("uiStyle", e.target.value));
  uiSelect.value = displayStyles?.uiStyle || "auto";
  
  const screenSelect = document.getElementById("screen-style-select");
  screenSelect.addEventListener("change", async (e) => setStyle("screenStyle", e.target.value));
  screenSelect.value = displayStyles?.screenStyle || "auto-system";

  const dimmingSelect = document.getElementById("dimming-style-select");
  dimmingSelect.addEventListener("change", async (e) => setStyle("dimmingStyle", e.target.value));
  dimmingSelect.value = displayStyles?.dimmingStyle || "until-hover";
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
let statusTimeoutId;
function showStatus(message, isError = false) {
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.style.color = isError ? "#ff5555" : "#55ff55";
  }

  if (statusTimeoutId) {
    clearTimeout(statusTimeoutId);
  }

  if(!isError)
    statusTimeoutId = setTimeout(hideStatus, 3000);
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
