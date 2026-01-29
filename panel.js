// panel.js
async function updateEnvironmentDisplay() {
  try {
    const result = await chrome.storage.local.get(["environment"]);
    const env = result.environment || "not set";
    document.getElementById("currentEnv").textContent =
      `Current Environment: ${env}`;
  } catch (error) {
    console.error("Error updating display:", error);
  }
}

async function setDevelopmentEnvironment() {
  try {
    await chrome.storage.local.set({ environment: "development" });
    console.log("Set to development environment (localhost:3000)");
    await updateEnvironmentDisplay();
  } catch (error) {
    console.error("Error setting development:", error);
  }
}

async function setProductionEnvironment() {
  try {
    await chrome.storage.local.set({ environment: "production" });
    console.log("Set to production environment (trmnl.com)");
    await updateEnvironmentDisplay();
  } catch (error) {
    console.error("Error setting production:", error);
  }
}

// Add event listeners when the document is loaded
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("devButton")
    .addEventListener("click", setDevelopmentEnvironment);
  document
    .getElementById("prodButton")
    .addEventListener("click", setProductionEnvironment);

  // Initialize display
  updateEnvironmentDisplay();
});
