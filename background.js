// Background script for TRMNL New Tab Display extension

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.environment) {
    console.log("Environment changed:", {
      oldValue: changes.environment.oldValue,
      newValue: changes.environment.newValue,
    });
  }
});

// Constants
const HOSTS = {
  development: "http://localhost:3000",
  production: "https://trmnl.com",
};

const getBaseUrl = async () => {
  const { environment } = await chrome.storage.local.get("environment");
  return HOSTS[environment] || HOSTS.production;
};

const getDevicesUrl = async () => {
  const baseUrl = await getBaseUrl();
  return `${baseUrl}/devices.json`;
};

let API_URL = `${HOSTS.production}/api/current_screen`; // Default to production

const getApiUrl = async () => {
  const baseUrl = await getBaseUrl();
  return `${baseUrl}/api/current_screen`;
};

const getLoginUrl = async () => {
  const baseUrl = await getBaseUrl();
  return `${baseUrl}/login`;
};

const DEFAULT_REFRESH_RATE = 30; // seconds

async function fetchAndStoreDevices() {
  try {
    // First check if we already have stored devices
    const { devices: storedDevices } =
      await chrome.storage.local.get("devices");

    const devicesUrl = await getDevicesUrl();
    const response = await fetch(devicesUrl);

    // Only redirect to login if we have no stored devices AND got a 401/403
    if (
      (response.status === 401 || response.status === 403) &&
      (!storedDevices || storedDevices.length === 0)
    ) {
      const loginUrl = await getLoginUrl();
      // Open login page in a new tab
      chrome.tabs.create({ url: loginUrl });
      return storedDevices || null;
    }

    if (!response.ok) {
      // If we have stored devices, return them instead of failing
      if (storedDevices && storedDevices.length > 0) {
        console.log("Using stored devices due to fetch error");
        return storedDevices;
      }
      throw new Error(`HTTP error: ${response.status}`);
    }

    const devices = await response.json();

    // Always save the newly fetched devices
    await chrome.storage.local.set({ devices });

    // If no device is selected, select the first one
    const { selectedDevice } = await chrome.storage.local.get("selectedDevice");
    if (!selectedDevice && devices.length > 0) {
      await chrome.storage.local.set({ selectedDevice: devices[0] });
    }

    return devices;
  } catch (error) {
    console.error("Error fetching devices:", error);
    // Return stored devices if available
    const { devices: storedDevices } =
      await chrome.storage.local.get("devices");
    return storedDevices || null;
  }
}

// Fetch devices list and get first API key
async function getFirstDeviceApiKey() {
  try {
    // First check if we already have stored devices
    const { devices: storedDevices } =
      await chrome.storage.local.get("devices");

    const devicesUrl = await getDevicesUrl();
    const response = await fetch(devicesUrl);

    // Only redirect to login if we have no stored devices AND got a 401/403
    if (
      (response.status === 401 || response.status === 403) &&
      (!storedDevices || storedDevices.length === 0)
    ) {
      const loginUrl = await getLoginUrl();
      chrome.tabs.create({ url: loginUrl });
      return null;
    }

    if (!response.ok) {
      // If we have stored devices, use them instead of failing
      if (storedDevices && storedDevices.length > 0) {
        console.log("Using stored devices due to fetch error");
        await chrome.storage.local.set({
          selectedDevice: storedDevices[0],
          environment: "production",
        });
        return storedDevices[0].api_key;
      }
      throw new Error(`HTTP error: ${response.status}`);
    }

    const devices = await response.json();
    if (devices && devices.length > 0) {
      // Store the devices
      await chrome.storage.local.set({
        devices,
        selectedDevice: devices[0],
        environment: "production",
      });
      return devices[0].api_key;
    }

    // If no devices found in response but we have stored devices, use those
    if (storedDevices && storedDevices.length > 0) {
      return storedDevices[0].api_key;
    }

    return null;
  } catch (error) {
    console.error("Error fetching devices:", error);
    // Check for stored devices
    const { devices: storedDevices } =
      await chrome.storage.local.get("devices");
    if (storedDevices && storedDevices.length > 0) {
      return storedDevices[0].api_key;
    }
    return null;
  }
}

// Send the current image to the requester
async function sendCurrentImage(sendResponse) {
  const storage = await chrome.storage.local.get([
    "currentImage",
    "lastFetch",
    "refreshRate",
  ]);
  sendResponse(storage);
}

// Initialize when extension is installed or updated
chrome.runtime.onInstalled.addListener(async () => {
  console.log("TRMNL New Tab Display extension installed");

  // Set default environment and get devices
  await chrome.storage.local.set({ environment: "production" });
  API_URL = await getApiUrl();

  const devices = await fetchAndStoreDevices();

  if (devices && devices.length > 0) {
    // Set the first device and its API key
    await chrome.storage.local.set({
      selectedDevice: devices[0],
      lastFetch: 0,
      nextFetch: 0,
      refreshRate: DEFAULT_REFRESH_RATE,
      retryCount: 0,
      retryAfter: null,
    });

    // Attempt to fetch an image with the device's API key
    fetchTrmnlImage();
  }

  // Set up alarm for periodic image fetching
  setupRefreshAlarm(DEFAULT_REFRESH_RATE);
});

// Listen for alarms to trigger image refresh
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "refreshTrmnlImage") {
    fetchTrmnlImage();
  } else if (alarm.name === "retryTrmnlImage") {
    console.log("Retry alarm triggered");
    fetchTrmnlImage();
  }
});

// Listen for messages from popup or new tab page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveApiKey") {
    saveApiKey(request.apiKey)
      .then(() => {
        if (sendResponse) sendResponse({ success: true });
      })
      .catch((err) => {
        console.error("Error saving API key:", err);
        if (sendResponse) sendResponse({ success: false, error: err.message });
      });
    return true; // Required for async response
  } else if (request.action === "getCurrentImage") {
    sendCurrentImage(sendResponse);
    return true; // Required for async response
  } else if (request.action === "forceRefresh") {
    fetchTrmnlImage(true) // Pass true to force a refresh regardless of cache
      .then((result) => {
        if (sendResponse) sendResponse({ success: !!result });
      })
      .catch((err) => {
        console.error("Error during forced refresh:", err);
        if (sendResponse) sendResponse({ success: false, error: err.message });
      });
    return true; // Important for async response
  }

  if (request.action === "refreshDevices") {
    fetchAndStoreDevices()
      .then((devices) => {
        if (devices && devices.length > 0) {
          // Refresh the current image with the new device info
          return fetchTrmnlImage(true);
        }
      })
      .then(() => {
        if (sendResponse) sendResponse({ success: true });
      })
      .catch((error) => {
        console.error("Error refreshing devices:", error);
        if (sendResponse)
          sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  return false; // Not handling this message
});

// Save API key and immediately fetch an image
async function saveApiKey(apiKey) {
  await chrome.storage.local.set({
    apiKey,
    // Reset any retry information when changing API key
    retryCount: 0,
    retryAfter: null,
  });
  console.log("API key saved");

  // Fetch a new image with the updated API key
  return fetchTrmnlImage();
}

// Set up the refresh alarm
function setupRefreshAlarm(seconds) {
  // Clear any existing alarm
  chrome.alarms.clear("refreshTrmnlImage");

  // Create new alarm
  chrome.alarms.create("refreshTrmnlImage", {
    periodInMinutes: seconds / 60, // Convert seconds to minutes
  });

  console.log(`Refresh alarm set for every ${seconds} seconds`);
}

// Handle storage limits for data URLs
// Chrome storage has limits, so we need to be careful with large data URLs
async function checkStorageUsage() {
  // Firefox does not support this method
  if (chrome?.storage?.local?.getBytesInUse) {
    // Get current storage usage
    const storageUsage = await chrome.storage.local.getBytesInUse(null);
    const storageLimit = chrome.storage.local.QUOTA_BYTES || 10485760; // 10MB default

    const percentUsed = (storageUsage / storageLimit) * 100;
    console.log(
      `Storage usage: ${(storageUsage / 1024 / 1024).toFixed(2)}MB / ${(storageLimit / 1024 / 1024).toFixed(2)}MB (${percentUsed.toFixed(2)}%)`,
    );

    // If we're using more than 80% of our quota, we might want to clean up old images
    return percentUsed > 80;
  }
  return false; // Assume no storage limits if method is not available
}

let fetchInProgress = false;

// Fetch an image from the TRMNL API
async function fetchTrmnlImage(forceRefresh = false) {
  console.log("Fetching TRMNL image");

  // Prevent concurrent fetches
  if (fetchInProgress) {
    console.log("Fetch already in progress, skipping");
    return null;
  }

  fetchInProgress = true;

  // Get the current API URL and initialize environment if needed
  const environment = await chrome.storage.local.get("environment");
  if (!environment.environment) {
    await chrome.storage.local.set({ environment: "production" });
  }
  API_URL = await getApiUrl();

  console.log("Fetching TRMNL image");

  const storage = await chrome.storage.local.get([
    "selectedDevice",
    "lastFetch",
    "refreshRate",
    "nextFetch",
    "retryCount",
    "retryAfter",
    "currentImage",
  ]);

  const apiKey = storage.selectedDevice?.api_key;

  const currentTime = Date.now();

  // If no API key, try to get one from devices first
  if (!apiKey) {
    console.log("No API key set, attempting to fetch from devices");
    const deviceApiKey = await getFirstDeviceApiKey();
    if (deviceApiKey) {
      await saveApiKey(deviceApiKey);
      return fetchTrmnlImage(true);
    }
    console.log("Could not get API key from devices, skipping fetch");
    return null;
  }

  // Check if we're in a retry backoff period
  if (storage.retryAfter && currentTime < storage.retryAfter) {
    console.log(
      `In retry backoff period. Next attempt in ${Math.ceil((storage.retryAfter - currentTime) / 1000)}s`,
    );
    return null;
  }

  try {
    const response = await fetch(API_URL, {
      headers: {
        "access-token": apiKey,
        "Cache-Control": "no-cache", // Prevent browser caching
      },
    });

    // Handle unauthorized (redirect to login only if we have no devices)
    if (response.status === 401 || response.status === 403) {
      const { devices } = await chrome.storage.local.get("devices");
      if (!devices || devices.length === 0) {
        const loginUrl = await getLoginUrl();
        chrome.tabs.create({ url: loginUrl });
        fetchInProgress = false;
        return null;
      } else {
        console.log(
          "API key unauthorized, but have stored devices. Will retry with another key.",
        );
        // Could implement logic here to try the next device
      }
    }

    // Handle rate limiting (429)
    if (response.status === 429) {
      console.warn("Rate limited by the API (429)");

      // Get retry delay from header or use exponential backoff
      let retryAfter = 0;
      if (response.headers.has("Retry-After")) {
        // Server specified retry time in seconds
        retryAfter = parseInt(response.headers.get("Retry-After")) * 1000;
      } else {
        // Calculate exponential backoff
        const retryCount = (storage.retryCount || 0) + 1;
        // Base delay of 60 seconds with exponential increase and some randomness
        retryAfter = Math.min(
          60000 * Math.pow(1.5, retryCount - 1) + Math.random() * 10000,
          3600000,
        );

        await chrome.storage.local.set({ retryCount: retryCount });
      }

      console.log(`Setting retry after ${retryAfter / 1000} seconds`);
      const retryTime = currentTime + retryAfter;
      await chrome.storage.local.set({ retryAfter: retryTime });

      // Schedule a retry
      chrome.alarms.create("retryTrmnlImage", {
        when: retryTime,
      });

      fetchInProgress = false;
      return null;
    }

    // Reset retry count on successful requests
    if (storage.retryCount > 0) {
      await chrome.storage.local.set({ retryCount: 0, retryAfter: null });
    }

    if (!response.ok) {
      throw new Error(
        `HTTP error: ${response.status} - ${response.statusText}`,
      );
    }

    const data = await response.json();
    console.log("TRMNL API response:", data);

    // Use fixed 30 second refresh rate
    const refreshRate = DEFAULT_REFRESH_RATE;
    console.log(`Using fixed refresh rate: ${refreshRate} seconds`);

    // Check if the image URL has changed
    const currentImageData = storage.currentImage || {};
    if (!forceRefresh && currentImageData.originalUrl === data.image_url) {
      console.log("Image has not changed, updating refresh time only");

      // Update just the next fetch time without downloading the image again
      const nextFetch = currentTime + refreshRate * 1000;
      await chrome.storage.local.set({
        refreshRate: refreshRate,
        nextFetch: nextFetch,
        lastFetch: currentTime,
        // Reset any retry information
        retryCount: 0,
        retryAfter: null,
      });

      // Update the refresh alarm if needed
      if (refreshRate !== storage.refreshRate) {
        setupRefreshAlarm(refreshRate);
      }

      fetchInProgress = false;
      return currentImageData.url;
    }

    // Get the image as a blob
    const imageResponse = await fetch(data.image_url, {
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }

    // Instead of using Blob URLs (which aren't supported in service workers),
    // convert the image to a base64 data URL or store the raw data
    const imageBlob = await imageResponse.blob();

    // Create a FileReader to convert the blob to a data URL
    const imageDataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });

    // Store the new image and update timestamps
    const nextFetch = currentTime + refreshRate * 1000;

    // Check storage usage before storing potentially large data URL
    const isStorageLimited = await checkStorageUsage();

    // If storage is limited, we might want to compress the image or handle differently
    // For now, we'll just log a warning and continue
    if (isStorageLimited) {
      console.warn(
        "Storage usage is high - consider implementing image compression",
      );
    }

    await chrome.storage.local.set({
      currentImage: {
        url: imageDataUrl,
        originalUrl: data.image_url,
        filename: data.filename || "display.jpg",
        timestamp: currentTime,
      },
      lastFetch: currentTime,
      refreshRate: refreshRate,
      nextFetch: nextFetch,
    });

    // Update the refresh alarm if needed
    if (refreshRate !== storage.refreshRate) {
      setupRefreshAlarm(refreshRate);
    }

    // Notify any open tabs that a new image is available
    try {
      chrome.runtime.sendMessage({ action: "imageUpdated" }).catch(() => {
        // This is normal if no listeners are active
        console.log("No active listeners for imageUpdated message");
      });
    } catch (e) {
      // Ignore message sending errors, which are expected if no tabs are open
    }

    setTimeout(() => {
      fetchInProgress = false;
    }, 1000);

    return imageDataUrl;
  } catch (error) {
    console.error("Error fetching TRMNL image:", error);

    // Schedule a retry with backoff
    const retryCount = (storage.retryCount || 0) + 1;
    const retryDelay = Math.min(60000 * Math.pow(2, retryCount - 1), 3600000); // Max 1 hour
    const retryTime = currentTime + retryDelay;

    await chrome.storage.local.set({
      retryCount: retryCount,
      retryAfter: retryTime,
    });

    chrome.alarms.create("retryTrmnlImage", {
      when: retryTime,
    });

    console.log(`Scheduled retry in ${retryDelay / 1000} seconds`);
    fetchInProgress = false;

    return null;
  }
}
