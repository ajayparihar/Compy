/**
 * @fileoverview Command Management System - Main Client-side Script
 * @author Ajay Singh
 * @version 1.1
 * @created 11-09-2023
 * @updated 25-02-2025
 * 
 * This file contains the client-side functionality for the Command Management System.
 * It handles data fetching, display, search, clipboard operations, and theme management.
 * The system supports sensitive data masking and real-time search filtering.
 * 
 * WARNING: Future me, don't mess with this code unless absolutely necessary.
 * You'll thank yourself later for these comments when you've forgotten how this works.
 */

// Immediately try to apply the saved theme to prevent flash of unstyled content
(function() {
  try {
    // Try localStorage first
    let savedTheme = localStorage.getItem('selectedTheme');
    
    // If not in localStorage, try cookie
    if (!savedTheme) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; selectedTheme=`);
      if (parts.length === 2) savedTheme = parts.pop().split(";").shift();
    }
    
    // Apply theme if found
    if (savedTheme) {
      document.documentElement.className = document.documentElement.className
        .split(" ")
        .filter((cls) => !cls.startsWith("d") && !cls.startsWith("l"))
        .join(" ");
      document.documentElement.classList.add(savedTheme);
      console.log('Early theme application:', savedTheme);
    }
  } catch (e) {
    console.warn('Error in early theme application:', e);
  }
})();

/* Author: Ajay Singh */
/* Version: 1.1 */
/* Date: 11-09-2023 */

// Configuration constants
const COMMANDS_API_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpgO5dkZtima-Pn9QPveTMsANWp-oMYBwNAc2xU0n-MsMiJKMSFqUP42xWOBZYQiUAoQsbnIysArka/pub?output=csv";

/**
 * Configuration object for the application settings
 * @constant {Object}
 */
const config = {
  passwordMaskingKeyword: "##", // Keyword used to identify and mask sensitive data
};

/**
 * Cache of DOM elements to avoid repeated querySelector calls
 * @constant {Object}
 */
const DOM_ELEMENTS = {
  dataDiv: document.getElementById("data"),
  searchInput: document.getElementById("searchInput"),
  title: document.getElementById("pageTitle"),
  loadingOverlay: document.querySelector(".loading-overlay"),
  toast: document.getElementById("toast"),
  clearSearch: document.getElementById("clearSearch"),
};

// Validate DOM elements
Object.entries(DOM_ELEMENTS).forEach(([key, element]) => {
  if (!element) console.error(`Element not found: ${key}`);
});

/**
 * Shows the loading overlay to indicate background operations
 * @function showLoading
 */
const showLoading = () => {
  document.body.classList.add("loading");
  if (DOM_ELEMENTS.loadingOverlay) {
    DOM_ELEMENTS.loadingOverlay.style.display = "flex";
  }
};

/**
 * Hides the loading overlay when operations are complete
 * @function hideLoading
 */
const hideLoading = () => {
  document.body.classList.remove("loading");
  if (DOM_ELEMENTS.loadingOverlay) {
    DOM_ELEMENTS.loadingOverlay.style.display = "none";
  }
};

/**
 * Displays a toast notification to the user
 * @function showAlert
 * @param {string} message - The message to display
 * @param {string} type - The type of alert ('primary', 'success', or 'error')
 */
const showAlert = (message, type) => {
  const toast = DOM_ELEMENTS.toast;
  if (!toast) return;

  // Remove existing classes
  toast.classList.remove("show", "hide", "success", "error", "primary");

  // Add the appropriate class based on the type
  toast.classList.add(type);

  // Set the message
  toast.textContent = message;

  // Show the toast
  setTimeout(() => {
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.add("hide");
    }, 2300); // Hide after 2.3 seconds
  }, 10);
};

/**
 * Masks sensitive data in text by replacing content between masking keywords
 * @function maskSensitiveData
 * @param {string} text - The text to process
 * @returns {string} The text with sensitive data masked
 */
const maskSensitiveData = (text) => {
  if (!text) return text;
  
  try {
    // Don't use regex for this - it's too error-prone with special characters
    // Instead, manually find and replace the sensitive sections
    const keyword = config.passwordMaskingKeyword;
    let result = '';
    let currentPos = 0;
    
    // Find the first occurrence of the keyword
    let startPos = text.indexOf(keyword, currentPos);
    
    while (startPos !== -1) {
      // Add the text before the keyword
      result += text.substring(currentPos, startPos);
      
      // Find the ending keyword
      const endPos = text.indexOf(keyword, startPos + keyword.length);
      
      if (endPos === -1) {
        // No ending keyword found, just add the rest of the text
        result += text.substring(startPos);
        break;
      }
      
      // Add the masked version
      result += `${keyword}SensitiveData${keyword}`;
      
      // Move past the ending keyword
      currentPos = endPos + keyword.length;
      
      // Find the next occurrence
      startPos = text.indexOf(keyword, currentPos);
    }
    
    // Add any remaining text
    if (currentPos < text.length) {
      result += text.substring(currentPos);
    }
    
    return result;
  } catch (error) {
    console.error("Error in maskSensitiveData:", error);
    return text; // Return original text if there's an error
  }
};

/**
 * Fetches data from the API with a timeout
 * @async
 * @function fetchDataWithTimeout
 * @param {string} url - The URL to fetch data from
 * @param {number} [timeout=10000] - Timeout in milliseconds
 * @returns {Promise<string>} The fetched data
 * @throws {Error} If the fetch fails or times out
 */
const fetchDataWithTimeout = async (url, timeout = 10000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * Displays the data in the DOM
 * @function displayData
 * @param {Array<Object>} data - Array of command objects to display
 */
const displayData = (data) => {
  const dataDiv = DOM_ELEMENTS.dataDiv;
  if (!dataDiv) return;

  // Clear existing content
  dataDiv.innerHTML = "";

  // Create and append new data items
  data.forEach((item) => {
    if (item && item.command) {
      const dataElement = createDataElement(item.command, item.description);
      dataDiv.appendChild(dataElement);
    }
  });
};

/**
 * Creates a DOM element for a single data item
 * @function createDataElement
 * @param {string} item - The command text
 * @param {string} description - The command description
 * @returns {HTMLElement} The created DOM element
 */
const createDataElement = (item, description) => {
  const dataElement = document.createElement("div");
  dataElement.classList.add("data-item");

  // Store original values as data attributes for later reference
  // This is crucial for search functionality and clipboard operations
  // Base64 encode the data to preserve special characters
  dataElement.dataset.originalItem = btoa(unescape(encodeURIComponent(item)));
  dataElement.dataset.originalDescription = btoa(unescape(encodeURIComponent(description || "undefined")));
  
  // Add click handler to the entire item
  dataElement.addEventListener("click", (event) => {
    copyToClipboard(dataElement, event);
  });

  const contentWrapper = document.createElement("div");
  contentWrapper.classList.add("data-item-content");

  // Mask sensitive data
  const maskedItem = maskSensitiveData(item);
  const maskedDescription = 
    description === "undefined" ? "undefined" : maskSensitiveData(description);
  
  // Create the content using DOM methods instead of innerHTML for better security
  const paragraph = document.createElement('p');
  
  // Create and append the command text element
  const strongElement = document.createElement('strong');
  strongElement.className = "command-text";
  strongElement.textContent = maskedItem; // Use textContent instead of innerHTML
  paragraph.appendChild(strongElement);
  
  // Add a space and the description as text
  paragraph.appendChild(document.createTextNode(' '));
  paragraph.appendChild(document.createTextNode(maskedDescription));
  
  // Add the paragraph to the content wrapper
  contentWrapper.appendChild(paragraph);

  // Add copy icon
  const copyIcon = document.createElement("div");
  copyIcon.classList.add("copy-icon");
  copyIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
      <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/>
    </svg>
  `;

  // Add all the elements to the data item container
  dataElement.appendChild(contentWrapper);
  dataElement.appendChild(copyIcon);

  return dataElement;
};

/**
 * Removes masking from sensitive data
 * @function removeMasking
 * @param {string} text - The masked text
 * @returns {string} The unmasked text
 * 
 * This is the opposite of maskSensitiveData - it reveals what was hidden.
 * Like taking off sunglasses at night, but for passwords.
 * Future me: Don't mess with this regex unless you want to spend hours debugging.
 */
const removeMasking = (text) => {
  if (!text) return text;
  
  try {
    // Use the same string-based approach as maskSensitiveData
    const keyword = config.passwordMaskingKeyword;
    const placeholder = `${keyword}SensitiveData${keyword}`;
    
    // Simply return the original text since we're using dataset.originalItem
    // in the copyToClipboard function
    return text;
  } catch (error) {
    console.error("Error in removeMasking:", error);
    return text;
  }
};

/**
 * Copies text to clipboard with visual feedback
 * @function copyToClipboard
 * @param {HTMLElement} element - The element that triggered the copy
 * @param {MouseEvent} event - The click event
 * 
 * This function handles the copy operation and provides visual feedback.
 * It creates that cool ripple effect when you click, because why not make
 * copying to clipboard feel magical? Users love that stuff.
 */
const copyToClipboard = (element, event) => {
  // Get click position relative to the element
  // This is for the ripple effect to start from where the user clicked
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Set CSS variables for ripple origin
  // CSS variables are amazing for this kind of dynamic positioning
  element.style.setProperty("--mouse-x", `${x}px`);
  element.style.setProperty("--mouse-y", `${y}px`);

  try {
    // Get the original text directly from the dataset and decode it
    const encodedText = element.dataset.originalItem;
    const originalText = decodeURIComponent(escape(atob(encodedText)));
    
    navigator.clipboard
      .writeText(originalText)
      .then(() => {
        // Add the copied class to trigger the ripple animation
        // This is what makes the magic happen visually
        element.classList.add("copied");
        // Remove the class after the animation ends
        // Otherwise it would stay in the "copied" state forever
        setTimeout(() => {
          element.classList.remove("copied");
        }, 600);
        
        // Show toast notification when copy is successful
        // Because users need that dopamine hit of confirmation
        showAlert("Copied to clipboard", "primary");
      })
      .catch((error) => {
        console.error("Failed to copy:", error);
        showAlert("Failed to copy to clipboard. Please try again.", "error");
      });
  } catch (error) {
    console.error("Error decoding text:", error);
    showAlert("Failed to copy to clipboard. Please try again.", "error");
  }
};

/**
 * Performs real-time search filtering on the displayed data
 * @function performSearch
 */
const performSearch = () => {
  const searchTerm = DOM_ELEMENTS.searchInput.value.trim().toLowerCase();
  if (!searchTerm) {
    filterData("");
    return;
  }
  
  filterData(searchTerm);
};

// Update the filterData function
const filterData = (query) => {
  showLoading();
  try {
    const searchValue = query.trim().toLowerCase();

    // Helper function to decode base64 data
    const decodeData = (encodedData) => {
      try {
        return decodeURIComponent(escape(atob(encodedData)));
      } catch (error) {
        console.error("Error decoding data:", error);
        return "";
      }
    };

    // Don't highlight if search is empty
    if (!searchValue) {
      document.querySelectorAll(".data-item").forEach((item) => {
        item.style.display = "block";
        
        // Get original values and decode them
        const originalItem = decodeData(item.dataset.originalItem);
        const originalDescription = decodeData(item.dataset.originalDescription);
        
        // Mask sensitive data
        const maskedItem = maskSensitiveData(originalItem);
        const maskedDescription = maskSensitiveData(originalDescription);
        
        // Update content using DOM methods
        const contentWrapper = item.querySelector(".data-item-content");
        contentWrapper.innerHTML = ''; // Clear existing content
        
        const paragraph = document.createElement('p');
        const strongElement = document.createElement('strong');
        strongElement.className = "command-text";
        strongElement.textContent = maskedItem; // Use textContent instead of innerHTML
        
        paragraph.appendChild(strongElement);
        paragraph.appendChild(document.createTextNode(' '));
        paragraph.appendChild(document.createTextNode(maskedDescription));
        contentWrapper.appendChild(paragraph);
      });
      return;
    }

    const items = document.querySelectorAll(".data-item");
    items.forEach((item) => {
      // Get original values and decode them
      const originalItem = decodeData(item.dataset.originalItem).toLowerCase();
      const originalDescription = decodeData(item.dataset.originalDescription).toLowerCase();
      
      const matchesSearch =
        originalItem.includes(searchValue) ||
        originalDescription.includes(searchValue);

      if (matchesSearch) {
        item.style.display = "block";
        
        // Get original values and decode them (non-lowercase version for display)
        const displayItem = decodeData(item.dataset.originalItem);
        const displayDescription = decodeData(item.dataset.originalDescription);
        
        // Mask sensitive data
        const maskedItem = maskSensitiveData(displayItem);
        const maskedDescription = maskSensitiveData(displayDescription);
        
        // Update content using DOM methods
        const contentWrapper = item.querySelector(".data-item-content");
        contentWrapper.innerHTML = ''; // Clear existing content
        
        const paragraph = document.createElement('p');
        const strongElement = document.createElement('strong');
        strongElement.className = "command-text";
        
        // Simple highlighting by splitting and joining with highlight spans
        if (maskedItem.toLowerCase().includes(searchValue)) {
          const parts = maskedItem.split(new RegExp(`(${searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, 'gi'));
          parts.forEach(part => {
            if (part.toLowerCase() === searchValue) {
              const highlight = document.createElement('span');
              highlight.className = 'highlight';
              highlight.textContent = part;
              strongElement.appendChild(highlight);
            } else if (part) {
              strongElement.appendChild(document.createTextNode(part));
            }
          });
        } else {
          strongElement.textContent = maskedItem;
        }
        
        paragraph.appendChild(strongElement);
        paragraph.appendChild(document.createTextNode(' '));
        
        // Highlight description if it contains the search term
        if (maskedDescription.toLowerCase().includes(searchValue)) {
          const parts = maskedDescription.split(new RegExp(`(${searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, 'gi'));
          parts.forEach(part => {
            if (part.toLowerCase() === searchValue) {
              const highlight = document.createElement('span');
              highlight.className = 'highlight';
              highlight.textContent = part;
              paragraph.appendChild(highlight);
            } else if (part) {
              paragraph.appendChild(document.createTextNode(part));
            }
          });
        } else {
          paragraph.appendChild(document.createTextNode(maskedDescription));
        }
        
        contentWrapper.appendChild(paragraph);
      } else {
        item.style.display = "none";
      }
    });
  } catch (error) {
    console.error("Error filtering data:", error);
    showAlert("An error occurred while filtering data.", "error");
  } finally {
    hideLoading();
  }
};

// Clean up and optimize event listeners
const addEventListeners = () => {
  // Auto-focus on search when typing
  document.addEventListener("keydown", (event) => {
    if (
      event.key.length === 1 &&
      !["Control", "Shift", "Alt", "Meta"].includes(event.key) &&
      document.activeElement !== DOM_ELEMENTS.searchInput
    ) {
      DOM_ELEMENTS.searchInput.focus();
    }
  });

  // Search input handling
  DOM_ELEMENTS.searchInput?.addEventListener("input", (e) => {
    const searchValue = e.target.value;
    filterData(searchValue);
    DOM_ELEMENTS.clearSearch.style.display = searchValue ? "block" : "none";
  });

  // Clear search handling
  DOM_ELEMENTS.clearSearch?.addEventListener("click", () => {
    DOM_ELEMENTS.searchInput.value = "";
    filterData("");
    DOM_ELEMENTS.clearSearch.style.display = "none";
    DOM_ELEMENTS.searchInput.focus();
  });

  // Refresh functionality
  DOM_ELEMENTS.title.addEventListener("click", () => {
    window.location.href =
      window.location.href.split("?")[0] + "?t=" + Date.now();
    window.location.reload(true);
  });
};

// Theme names mapped from themes.css comments
// Make THEME_NAMES available globally so it can be used in config.js
window.THEME_NAMES = {
  d1: "Mystic Forest (Dark)",
  d2: "Crimson Night (Dark)",
  d3: "Royal Elegance (Dark)",
  d4: "Galactic Blue (Dark)",
  d5: "Twilight Dream (Dark)",
  d6: "Deep Ocean (Dark)",
  d7: "Cyber Night (Dark)",
  d8: "Molten Core (Dark)",
  d9: "Neon Pulse (Dark)",
  d10: "Toxic Night (Dark)",
  l1: "Sunrise (Light)",
  l2: "Soft Glow (Light)",
  l3: "Floral Breeze (Light)",
  l4: "Ocean Breeze (Light)",
  l5: "Golden Sands (Light)",
  l6: "Mint Grove (Light)",
  l7: "Sky Dusk (Light)",
  l8: "Autumn Leaves (Light)",
  l9: "Citrus Burst (Light)",
  l10: "Rose Petal (Light)",
  l11: "Lavender Mist (Light)",
};

// Helper functions for cookies
const setCookie = (name, value, days = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

// Save data to a local file
const saveToFile = async (data, fileName) => {
  try {
    // Request permission to save the file
    const handle = await window.showSaveFilePicker({
      suggestedName: fileName,
      types: [
        {
          description: "Text Files",
          accept: { "text/plain": [".txt"] },
        },
      ],
    });

    // Create a writable stream
    const writable = await handle.createWritable();
    await writable.write(data);
    await writable.close();

    console.log("File saved successfully");
  } catch (error) {
    console.error("Error saving file:", error);
  }
};

// Example usage
const saveThemeToFile = async (theme) => {
  const data = JSON.stringify({ theme }, null, 2);
  await saveToFile(data, "theme_config.txt");
};

// Theme persistence functions
const saveThemeToLocalStorage = (theme) => {
  try {
    console.log('Saving theme to localStorage:', theme);
    localStorage.setItem('selectedTheme', theme);
    
    // Also save to cookie as a backup
    setCookie('selectedTheme', theme, 365);
    
    // Verify the theme was saved correctly
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme !== theme) {
      console.warn('Theme was not saved correctly to localStorage. Expected:', theme, 'Got:', savedTheme);
    } else {
      console.log('Theme saved successfully to localStorage');
    }
  } catch (error) {
    console.error('Error saving theme to localStorage:', error);
    // Try using a cookie as fallback
    try {
      setCookie('selectedTheme', theme, 365);
      console.log('Theme saved to cookie as fallback');
    } catch (cookieError) {
      console.error('Error saving theme to cookie:', cookieError);
    }
  }
};

/**
 * Loads theme from localStorage - because who wants to pick the same theme every time?
 * @function loadThemeFromLocalStorage
 * @returns {string} The saved theme or default if none found
 */
const loadThemeFromLocalStorage = () => {
  try {
    // Try to get theme from localStorage first
    const savedTheme = localStorage.getItem('selectedTheme');
    console.log('Loading theme from localStorage:', savedTheme);
    
    if (savedTheme) {
      return savedTheme;
    }
    
    // If not in localStorage, try to get from cookie as fallback
    const cookieTheme = getCookie('selectedTheme');
    console.log('Loading theme from cookie fallback:', cookieTheme);
    
    if (cookieTheme) {
      // Save to localStorage for next time
      try {
        localStorage.setItem('selectedTheme', cookieTheme);
      } catch (error) {
        console.warn('Could not save cookie theme to localStorage:', error);
      }
      return cookieTheme;
    }
    
    // Default theme if nothing found
    return 'd4';
  } catch (error) {
    console.error('Error loading theme from storage:', error);
    return 'd4'; // Default to d4 if error
  }
};

/**
 * Initializes the theme selector dropdown with all available themes
 * @function initThemeSelector
 * @description Creates options for each theme and sets up event listeners
 * Note to future self: This is where the magic happens for theme selection.
 * Don't touch this unless you want to spend hours debugging CSS again.
 */
const initThemeSelector = () => {
  const themeSelect = document.getElementById("themeSelect");
  if (!themeSelect) return;

  console.log('Initializing theme selector');

  // Add theme options
  Object.entries(window.THEME_NAMES).forEach(([value, name]) => {
    const option = document.createElement("option");
    option.value = value;
    // Remove (Dark), (Light), and don't add the theme code
    option.textContent = name.replace(/ \(Dark\)| \(Light\)/g, "");
    themeSelect.appendChild(option);
  });

  // Set initial theme from localStorage
  const savedTheme = loadThemeFromLocalStorage();
  console.log('Setting theme selector to saved theme:', savedTheme);
  themeSelect.value = savedTheme;
  
  // Always apply the theme here to ensure it's set correctly
  applyTheme(savedTheme);

  // Handle theme change
  themeSelect.addEventListener("change", (e) => {
    const selectedTheme = e.target.value;
    console.log('Theme changed to:', selectedTheme);
    applyTheme(selectedTheme);
    // Update the theme in user_config.json
    updateUserConfig(selectedTheme);
  });
};

/**
 * Updates the user configuration with the new theme selection
 * @async
 * @function updateUserConfig
 * @param {string} theme - The theme identifier to save
 * @description Fetches current config, updates theme, and saves back to server
 * @throws {Error} If there's an issue updating the config
 * 
 * Note: This is where we persist theme changes to the server.
 * Remember that one time you forgot this and users kept losing their theme? Good times.
 */
const updateUserConfig = async (theme) => {
  try {
    // Always save to localStorage first to ensure theme persistence
    saveThemeToLocalStorage(theme);
    
    // Then try to update the server-side config
    const response = await fetch("user_config.json");
    const config = await response.json();
    config.user_settings.theme = theme;

    await fetch("user_config.json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    });
  } catch (error) {
    console.error("Error updating user config:", error);
    // Even if server update fails, theme is still saved to localStorage
  }
};

/**
 * Applies the selected theme to the document
 * @function applyTheme
 * @param {string} theme - The theme identifier to apply
 * @description Removes existing theme classes and adds the new one
 * 
 * CSS class magic happens here. Don't mess with this unless you want
 * to spend a day figuring out why everything suddenly looks terrible.
 */
window.applyTheme = (theme) => {
  if (!theme) {
    console.warn('No theme provided to applyTheme, using default');
    theme = 'd4'; // Default theme if none provided
  }
  
  console.log('Applying theme:', theme);
  
  // Remove existing theme classes
  document.documentElement.className = document.documentElement.className
    .split(" ")
    .filter((cls) => !cls.startsWith("d") && !cls.startsWith("l"))
    .join(" ");

  // Add new theme class
  document.documentElement.classList.add(theme);

  // Update spinner colors
  const spinner = document.querySelector(".spinner");
  if (spinner) {
    spinner.style.borderColor = `rgba(var(--primary-rgb), 0.2)`;
    spinner.style.borderTopColor = `var(--primary)`;
  }

  // Save theme to localStorage and cookie
  saveThemeToLocalStorage(theme);
  
  // Also update the theme selector if it exists
  const themeSelect = document.getElementById("themeSelect");
  if (themeSelect && themeSelect.value !== theme) {
    themeSelect.value = theme;
  }
};

/**
 * Applies the user's name to the page title
 * @function applyUserName
 * @param {string} userName - The user's name to display
 * @description Updates the page title with the user's name or default
 * 
 * Because everyone likes seeing their name in lights... or at least in the header.
 */
window.applyUserName = (userName) => {
  const pageTitle = document.getElementById("pageTitle");
  if (pageTitle) {
    // Only show "userName's COMPY" if userName exists and is not empty
    pageTitle.textContent = userName && userName.trim() ? `${userName}'s COMPY` : "COMPY";
  }
};

/**
 * Processes the fetched data from CSV/Excel format
 * @function processData
 * @param {string} data - The raw data to process
 * @returns {Array<Object>} Array of command objects
 * @description Converts raw data to structured command objects
 * 
 * This is where we transform the raw data into something useful.
 * Future me: Remember that time you tried to refactor this and broke everything?
 * Let's not do that again. This works. Leave it alone.
 */
const processData = (data) => {
  try {
    const workbook = XLSX.read(data, { type: "string" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const processedData = json
      .map((row) => {
        // Skip empty rows
        if (!row || row.length === 0) return null;

        // Handle single column data
        if (row.length === 1) {
          return { command: row[0], description: "undefined" };
        }
        return { command: row[0], description: row[1] || "undefined" };
      })
      .filter((item) => item !== null); // Remove null entries

    // Store and display the data
    allData = processedData;
    displayData(processedData);
  } catch (error) {
    console.error("Error processing data:", error);
    showAlert("Error processing data. Please check the file format.", "error");
  }
};

// Modify initializeApp to use the new theme management
const initializeApp = async () => {
  try {
    showLoading();

    console.log('Initializing app and loading theme...');
    
    // Load configuration first
    const config = await fetch("user_config.json").then((response) =>
      response.json()
    ).catch(error => {
      console.error("Error loading config:", error);
      return { 
        file_settings: { file_path: "comm.csv" },
        user_settings: { theme: "d4" }
      };
    });
    
    // Initialize theme selector with the saved theme
    initThemeSelector();
    
    // Apply user name from config if it exists
    const userName = config.user_settings?.user_name || "";
    applyUserName(userName);
    
    // Get file path from config
    const filePath = config.file_settings?.file_path;
    if (!filePath) {
      throw new Error("No file path specified in config");
    }

    // Load and process data
    const data = await fetchDataWithTimeout(filePath);
    processData(data);
  } catch (error) {
    console.error("Error loading data:", error);
    showAlert("An unexpected error occurred. Please try again.", "error");
  } finally {
    hideLoading();
  }
  addEventListeners();
};

initializeApp();
