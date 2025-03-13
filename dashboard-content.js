(function () {
  // Check if we're on the dashboard page post-login
  if (window.location.pathname === "/dashboard") {
    // Send message to background script to refresh devices
    chrome.runtime.sendMessage({ action: "refreshDevices" });
  }
})();
