chrome.devtools.panels.create(
  "TRMNL",
  "",
  "/panel.html", // Make sure this path is correct
  function (panel) {
    console.log("panel created");
  },
);
