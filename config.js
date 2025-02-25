/**
 * @fileoverview Command Management System - Configuration
 * @author Ajay Singh
 * @version 1.1
 * @created 11-09-2023
 * @updated 25-02-2025
 * 
 * This file contains configuration settings and theme management
 * for the Command Management System.
 * 
 * WARNING: Changing these settings might seem simple, but can have
 * cascading effects throughout the application. Proceed with caution!
 * Future me: Remember when you "fixed" that one config value and 
 * everything broke for a week? Yeah, let's not do that again.
 */

/**
 * Default file path for command data
 * This is used when no custom path is specified in user_config.json
 * Google Sheets published as CSV - a simple but effective data source
 */
const DEFAULT_FILE_PATH =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpgO5dkZtima-Pn9QPveTMsANWp-oMYBwNAc2xU0n-MsMiJKMSFqUP42xWOBZYQiUAoQsbnIysArka/pub?output=csv";

/**
 * Theme configuration and display names
 * Each theme has a code (key) and a display name (value)
 * The naming convention is:
 * - d# for dark themes
 * - l# for light themes
 * 
 * These names show up in the theme selector dropdown.
 * Future me: Adding a new theme? Don't forget to add the CSS in themes.css too!
 * 
 * Note: THEME_NAMES is now defined in script.js and attached to the window object
 * to avoid duplicate declarations.
 */
// Access THEME_NAMES from window object (defined in script.js)
// const THEME_NAMES = { ... };

/**
 * Fetch and apply user configuration
 * This is where we load user preferences and apply them to the UI
 * If the fetch fails, we fall back to defaults - because users
 * should never see a broken UI, even if their config is missing.
 */
fetch("user_config.json")
  .then((response) => response.json())
  .then((config) => {
    // Extract settings with fallbacks to defaults
    // This is defensive programming at its finest
    const filePath = config.file_settings?.file_path || DEFAULT_FILE_PATH;
    const userName = config.user_settings?.user_name || "";
    const displayTheme = config.user_settings?.display_theme || "root";

    // Apply user name and theme
    // Using applyUserName from script.js
    if (window.applyUserName) {
      window.applyUserName(userName);
    }
    // Using applyTheme from script.js
    if (window.applyTheme) {
      window.applyTheme(displayTheme);
    }

    // Load the specified file
    loadFile(filePath);
  })
  .catch((error) => {
    console.error("Error loading user configuration:", error);
    // Load default file path if user configuration fails
    // Because something is better than nothing
    loadFile(DEFAULT_FILE_PATH);
  });

/**
 * Function to load the specified file
 * @param {string} filePath - Path to the data file
 * 
 * This function fetches the data file and processes it.
 * It's separated from the config loading to keep concerns separate.
 * Future me: If you're debugging data loading issues, start here!
 */
const loadFile = (filePath) => {
  fetch(filePath)
    .then((response) => response.text())
    .then((data) => {
      console.log("File loaded successfully:", data);
      // Process the loaded data as needed
    })
    .catch((error) => console.error("Error loading file:", error));
};

/**
 * Function to apply user name to the page title
 * @param {string} userName - The user's name
 * 
 * A small touch that makes the app feel more personal.
 * Users love seeing their name in the title!
 * 
 * Note: This function is now defined in script.js to avoid duplicate declarations.
 */
// const applyUserName = (userName) => {
//   const pageTitle = document.getElementById("pageTitle");
//   if (pageTitle) {
//     pageTitle.textContent = userName ? `${userName}'s COMPY` : "COMPY";
//   }
// };

/**
 * Theme application logic
 * @param {string} theme - Theme identifier to apply
 * 
 * This function handles the actual theme application to the document.
 * It works by adding a class to the root element, which CSS variables
 * then use to determine the color scheme.
 * 
 * Simple but powerful - one class change affects the entire application.
 * 
 * Note: This function is now defined in script.js to avoid duplicate declarations.
 */
// const applyTheme = (theme) => {
//   // Remove existing theme classes
//   document.documentElement.className = document.documentElement.className
//     .split(" ")
//     .filter((cls) => !cls.startsWith("d") && !cls.startsWith("l"))
//     .join(" ");

//   // Add new theme class
//   document.documentElement.classList.add(theme);
// };

// On page load, check for saved theme
// This ensures we apply the theme immediately on page load
// to avoid that annoying flash of default theme
const savedTheme = localStorage.getItem("theme") || "d4";
// Using applyTheme from script.js
if (window.applyTheme) {
  window.applyTheme(savedTheme);
}
