// Background script for TRMNL New Tab Display extension

// Constants
const API_URL = "https://usetrmnl.com/api/display";
const DEFAULT_REFRESH_RATE = 60; // seconds

// Initialize when extension is installed or updated
chrome.runtime.onInstalled.addListener(async () => {
  console.log("TRMNL New Tab Display extension installed");

  // Initialize storage with default values if not already set
  const storage = await chrome.storage.local.get([
    "apiKey",
    "lastFetch",
    "currentImage",
    "refreshRate",
    "nextFetch",
    "retryCount",
    "retryAfter",
  ]);

  // Initialize or reset values as needed
  const initialValues = {};

  if (!storage.apiKey) {
    initialValues.apiKey = "";
  }

  if (!storage.refreshRate) {
    initialValues.refreshRate = DEFAULT_REFRESH_RATE;
  }

  if (!storage.lastFetch) {
    initialValues.lastFetch = 0;
  }

  if (!storage.nextFetch) {
    initialValues.nextFetch = 0;
  }

  // Reset retry information
  initialValues.retryCount = 0;
  initialValues.retryAfter = null;

  if (Object.keys(initialValues).length > 0) {
    await chrome.storage.local.set(initialValues);
  }

  // Check if we have a stored image data URL
  if (storage.currentImage && storage.currentImage.url) {
    // No need to validate data URLs as they're stored directly in chrome.storage
    console.log("Found stored image data");
  }

  // Attempt to fetch an image if API key is already set
  if (storage.apiKey) {
    fetchTrmnlImage();
  }

  // Set up alarm for periodic image fetching
  setupRefreshAlarm(storage.refreshRate || DEFAULT_REFRESH_RATE);
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
    fetchTrmnlImage(true)
      .then((result) => {
        if (sendResponse) sendResponse({ success: !!result });
      })
      .catch((err) => {
        console.error("Error during forced refresh:", err);
        if (sendResponse) sendResponse({ success: false, error: err.message });
      });
    return true; // Required for async response
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

// Send the current image to the requester
async function sendCurrentImage(sendResponse) {
  const storage = await chrome.storage.local.get([
    "currentImage",
    "lastFetch",
    "refreshRate",
  ]);
  sendResponse(storage);
}

// Fetch an image from the TRMNL API
async function fetchTrmnlImage(forceRefresh = false) {
  console.log("Fetching TRMNL image");

  const storage = await chrome.storage.local.get([
    "apiKey",
    "lastFetch",
    "refreshRate",
    "nextFetch",
    "retryCount",
    "retryAfter",
  ]);

  const apiKey = storage.apiKey;
  const currentTime = Date.now();

  // Don't proceed if API key is not set
  if (!apiKey) {
    console.log("API key not set, skipping fetch");
    return null;
  }

  // Check if we're in a retry backoff period
  if (storage.retryAfter && currentTime < storage.retryAfter) {
    console.log(
      `In retry backoff period. Next attempt in ${Math.ceil((storage.retryAfter - currentTime) / 1000)}s`,
    );
    return null;
  }

  // Check if it's time to refresh yet, unless we're forcing a refresh
  if (!forceRefresh && storage.nextFetch && currentTime < storage.nextFetch) {
    console.log(
      `Too early to refresh. Next fetch in ${Math.ceil((storage.nextFetch - currentTime) / 1000)}s`,
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

    // Make sure we respect the refresh rate from the API
    let refreshRate = DEFAULT_REFRESH_RATE;
    if (data.refresh_rate && data.refresh_rate > 0) {
      refreshRate = data.refresh_rate;
      console.log(`Using API refresh rate: ${refreshRate} seconds`);
    } else {
      console.log(`Using default refresh rate: ${refreshRate} seconds`);
    }

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

    // Update the refresh alarm if refresh rate changed
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
    return null;
  }
}
