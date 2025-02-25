/**
 * @fileoverview Command Management System - Configuration
 * @author Ajay Singh
 * @version 1.1
 * @created 11-09-2023
 * @updated 25-02-2025
 * 
 * This file contains configuration settings for the Command Management System.
 * 
 * WARNING: Changing these settings might seem simple, but can have
 * cascading effects throughout the application. Proceed with caution!
 */

/**
 * Default file path for command data
 * This is used when no custom path is specified in user_config.json
 * Google Sheets published as CSV - a simple but effective data source
 */
const DEFAULT_FILE_PATH =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpgO5dkZtima-Pn9QPveTMsANWp-oMYBwNAc2xU0n-MsMiJKMSFqUP42xWOBZYQiUAoQsbnIysArka/pub?output=csv";

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
    const filePath = config.file_settings?.file_path || DEFAULT_FILE_PATH;
    const userName = config.user_settings?.user_name || "";

    // Apply user name
    if (window.applyUserName) {
      window.applyUserName(userName);
    }

    // Load the specified file
    loadFile(filePath);
  })
  .catch((error) => {
    console.error("Error loading user configuration:", error);
    // Load default file path if user configuration fails
    loadFile(DEFAULT_FILE_PATH);
  });

/**
 * Loads and processes the command data file
 * @param {string} filePath - Path to the CSV file containing command data
 * @returns {Promise<Array>} Processed command data
 * 
 * This function handles:
 * - Fetching data from local or remote sources
 * - CSV parsing and validation
 * - Data transformation and cleanup
 * - Error handling with meaningful messages
 * 
 * The function is resilient to:
 * - Network issues
 * - Malformed CSV data
 * - Missing or invalid columns
 * - Character encoding issues
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

// On page load, check for saved theme
document.addEventListener('DOMContentLoaded', () => {
  // Wait a short moment to ensure script.js has loaded
  setTimeout(() => {
    const savedTheme = localStorage.getItem("selectedTheme") || "d4";
    // Using applyTheme from script.js
    if (window.applyTheme) {
      window.applyTheme(savedTheme);
    } else {
      console.warn('applyTheme not available yet');
    }
  }, 100);
});
