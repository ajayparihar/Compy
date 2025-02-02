/* Author: Ajay Singh */
/* Version: 1.1.1 */
/* Date: 09-11-2023 */

const DEFAULT_FILE_PATH =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpgO5dkZtima-Pn9QPveTMsANWp-oMYBwNAc2xU0n-MsMiJKMSFqUP42xWOBZYQiUAoQsbnIysArka/pub?output=csv";

// Theme configuration and management
const THEME_NAMES = {
  d1: "Mystic Forest (Dark)",
  d2: "Crimson Night (Dark)",
  // ... other themes ...
};

// Fetch user configuration
fetch("user_config.json")
  .then((response) => response.json())
  .then((config) => {
    const filePath = config.file_settings?.file_path || DEFAULT_FILE_PATH;
    const userName = config.user_settings?.user_name || "";
    const displayTheme = config.user_settings?.display_theme || "root";

    // Apply user name and theme
    applyUserName(userName);
    applyTheme(displayTheme);

    // Load the specified file
    loadFile(filePath);
  })
  .catch((error) => {
    console.error("Error loading user configuration:", error);
    // Load default file path if user configuration fails
    loadFile(DEFAULT_FILE_PATH);
  });

// Function to load the specified file
const loadFile = (filePath) => {
  fetch(filePath)
    .then((response) => response.text())
    .then((data) => {
      console.log("File loaded successfully:", data);
      // Process the loaded data as needed
    })
    .catch((error) => console.error("Error loading file:", error));
};

// Function to apply user name
const applyUserName = (userName) => {
  const pageTitle = document.getElementById("pageTitle");
  if (pageTitle) {
    pageTitle.textContent = userName ? `${userName}'s COMPY` : "COMPY";
  }
};

// Theme application logic
const applyTheme = (theme) => {
  // Remove existing theme classes
  document.documentElement.className = document.documentElement.className
    .split(" ")
    .filter((cls) => !cls.startsWith("d") && !cls.startsWith("l"))
    .join(" ");

  // Add new theme class
  document.documentElement.classList.add(theme);
};

// On page load, check for saved theme
const savedTheme = localStorage.getItem("theme") || "d4";
applyTheme(savedTheme);
