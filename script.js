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

// Theme names mapped from themes.css comments
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

// Immediately try to apply the saved theme to prevent flash of unstyled content
(function() {
  try {
    // Get theme from localStorage
    let savedTheme = localStorage.getItem('selectedTheme');
    console.log('Loading theme from localStorage:', savedTheme);
    
    // If no theme in localStorage, use default
    if (!savedTheme || !window.THEME_NAMES[savedTheme]) {
      savedTheme = 'd4';
      console.log('No valid theme in localStorage, using default:', savedTheme);
    }
    
    // Apply theme if found
    if (savedTheme && savedTheme.trim() !== '') {
      // Remove any existing theme classes
      document.documentElement.className = document.documentElement.className
        .split(" ")
        .filter((cls) => !cls.startsWith("d") && !cls.startsWith("l"))
        .join(" ");
      
      // Add the saved theme class
      document.documentElement.classList.add(savedTheme);
      console.log('Theme applied successfully:', savedTheme);
      
      // Store in localStorage for future use
      try {
        localStorage.setItem('selectedTheme', savedTheme);
      } catch (storageError) {
        console.warn('Could not save theme to localStorage:', storageError);
      }
    }
  } catch (e) {
    console.error('Error in theme application:', e);
    // Fallback to default theme if there's an error
    document.documentElement.classList.add('d4');
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
  dataDiv: document.getElementById("data-container"),
  searchInput: document.getElementById("search-input"),
  title: document.getElementById("pageTitle"),
  loadingOverlay: document.querySelector(".loading-overlay"),
  toast: document.getElementById("toast"),
  clearSearch: document.getElementById("clearSearch"),
  themeSelect: document.getElementById("themeSelect"),
  userDisplay: document.getElementById("user-display"),
  errorMessage: document.querySelector(".error-message"),
  retryButton: document.getElementById("retry-button")
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
      
      // Add the masked version (replace with asterisks)
      result += '*'.repeat(endPos - startPos - keyword.length + 2 * keyword.length);
      
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
 * Removes masking from sensitive data
 * @function removeMasking
 * @param {string} text - The masked text
 * @returns {string} The unmasked text
 */
const removeMasking = (text) => {
  if (!text) return text;
  
  try {
    // Use the same string-based approach as maskSensitiveData
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
      
      // Extract the actual sensitive data between the keywords
      const sensitiveData = text.substring(startPos + keyword.length, endPos);
      
      // Add the actual sensitive data without the masking
      result += sensitiveData;
      
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
    
    // Remove masking before copying
    const unmaskedText = removeMasking(originalText);
    
    navigator.clipboard
      .writeText(unmaskedText)
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
  filterData(searchTerm);
};

/**
 * Filters the displayed data based on search query
 * @function filterData
 * @param {string} query - The search query
 */
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

    // Get all data items
    const items = document.querySelectorAll(".data-item");
    let visibleCount = 0;

    // Hide all items first if there's a search term
    if (searchValue) {
      items.forEach(item => {
        item.style.display = "none";
      });
    }

    items.forEach((item) => {
      // Get original values and decode them
      const originalItem = decodeData(item.dataset.originalItem).toLowerCase();
      const originalDescription = decodeData(item.dataset.originalDescription).toLowerCase();
      
      const matchesSearch = !searchValue || (
        originalItem.includes(searchValue) ||
        originalDescription.includes(searchValue)
      );

      // Update visibility
      item.style.display = matchesSearch ? "block" : "none";
      if (matchesSearch) visibleCount++;

      // Only update content if the item is visible and there's a search term
      if (matchesSearch && searchValue) {
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
      } else if (matchesSearch) {
        // Reset content to original state if no search term
        const contentWrapper = item.querySelector(".data-item-content");
        contentWrapper.innerHTML = ''; // Clear existing content
        
        const paragraph = document.createElement('p');
        const strongElement = document.createElement('strong');
        strongElement.className = "command-text";
        strongElement.textContent = maskSensitiveData(decodeData(item.dataset.originalItem));
        
        paragraph.appendChild(strongElement);
        paragraph.appendChild(document.createTextNode(' '));
        paragraph.appendChild(document.createTextNode(
          maskSensitiveData(decodeData(item.dataset.originalDescription))
        ));
        
        contentWrapper.appendChild(paragraph);
      }
    });

    // Update clear search icon visibility
    if (DOM_ELEMENTS.clearSearch) {
      DOM_ELEMENTS.clearSearch.style.display = searchValue ? "block" : "none";
    }

    // Show no results message if needed
    const noResultsMessage = document.querySelector('.no-results-message');
    if (searchValue && visibleCount === 0) {
      if (!noResultsMessage) {
        const message = document.createElement('div');
        message.className = 'no-results-message';
        message.textContent = 'No matching commands found. Try adjusting your search terms.';
        DOM_ELEMENTS.dataDiv.appendChild(message);
      }
    } else if (noResultsMessage) {
      noResultsMessage.remove();
    }
  } catch (error) {
    console.error("Error filtering data:", error);
    showAlert("An error occurred while filtering data.", "error");
  } finally {
    hideLoading();
  }
};

/**
 * Shows an error message to the user
 * @function showError
 * @param {string} message - The error message to display
 */
const showError = (message) => {
  if (DOM_ELEMENTS.errorMessage) {
    DOM_ELEMENTS.errorMessage.querySelector('p').textContent = message;
    DOM_ELEMENTS.errorMessage.style.display = 'block';
  }
};

/**
 * Hides the error message
 * @function hideError
 */
const hideError = () => {
  if (DOM_ELEMENTS.errorMessage) {
    DOM_ELEMENTS.errorMessage.style.display = 'none';
  }
};

/**
 * Updates the user display with the current username
 * @function updateUserDisplay
 * @param {string} username - The username to display
 */
const updateUserDisplay = (username) => {
  if (DOM_ELEMENTS.userDisplay) {
    DOM_ELEMENTS.userDisplay.textContent = username;
  }
};

// Clean up and optimize event listeners
const addEventListeners = () => {
  // Auto-focus on search only when forward slash is pressed
  document.addEventListener("keydown", (event) => {
    // Check if user pressed the forward slash key to focus search
    if (event.key === "/" && document.activeElement !== DOM_ELEMENTS.searchInput) {
      event.preventDefault(); // Prevent the "/" from being typed
      DOM_ELEMENTS.searchInput.focus();
      return;
    }
  });

  // Add event listeners for search
  if (DOM_ELEMENTS.searchInput) {
    // Add click event listener to focus the search input
    DOM_ELEMENTS.searchInput.addEventListener("click", () => {
      DOM_ELEMENTS.searchInput.focus();
    });

    // Debounce the search to improve performance
    let searchTimeout;
    DOM_ELEMENTS.searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      const searchValue = e.target.value;
      
      // Show/hide clear button immediately
      if (DOM_ELEMENTS.clearSearch) {
        DOM_ELEMENTS.clearSearch.style.display = searchValue ? "block" : "none";
      }
      
      // Debounce the actual search
      searchTimeout = setTimeout(() => {
        filterData(searchValue);
      }, 150); // 150ms delay
    });
  }

  // Add clear search functionality
  if (DOM_ELEMENTS.clearSearch) {
    DOM_ELEMENTS.clearSearch.addEventListener("click", () => {
      DOM_ELEMENTS.searchInput.value = "";
      filterData("");
      DOM_ELEMENTS.clearSearch.style.display = "none";
      DOM_ELEMENTS.searchInput.focus();
    });
  }

  // Refresh functionality
  DOM_ELEMENTS.title.addEventListener("click", () => {
    window.location.href =
      window.location.href.split("?")[0] + "?t=" + Date.now();
    window.location.reload(true);
  });

  // Add retry button event listener
  if (DOM_ELEMENTS.retryButton) {
    DOM_ELEMENTS.retryButton.addEventListener('click', async () => {
      hideError();
      await initializeApp();
    });
  }

  // Add theme selector event listener
  const themeSelect = document.getElementById("themeSelect");
  if (themeSelect) {
    themeSelect.addEventListener("change", (e) => {
      const selectedTheme = e.target.value;
      console.log('Theme changed to:', selectedTheme);
      applyTheme(selectedTheme);
    });
  }
};

/**
 * Updates the theme selection
 * @async
 * @function updateUserConfig
 * @param {string} theme - The theme identifier to save
 * @description Saves theme to localStorage
 * @throws {Error} If there's an issue saving to localStorage
 */
const updateUserConfig = async (theme) => {
  try {
    // Update theme
    if (theme) {
      // Remove any existing theme classes
      document.documentElement.className = document.documentElement.className
        .split(" ")
        .filter((cls) => !cls.startsWith("d") && !cls.startsWith("l"))
        .join(" ");
      
      // Add the new theme class
      document.documentElement.classList.add(theme);
      
      // Store in localStorage
      localStorage.setItem('selectedTheme', theme);
      
      // Update the theme selector
      const themeSelect = document.getElementById("themeSelect");
      if (themeSelect) {
        themeSelect.value = theme;
      }
    }
  } catch (error) {
    console.error('Error updating user config:', error);
    showAlert('Failed to update settings', 'error');
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
  if (!theme || theme.trim() === '') {
    console.warn('No theme provided to applyTheme, using default');
    theme = 'd4'; // Default theme if none provided
  }
  
  // Validate that the theme exists in our theme list
  if (window.THEME_NAMES && !window.THEME_NAMES[theme]) {
    console.warn('Theme not found in theme list, using default:', theme);
    theme = 'd4';
  }
  
  console.log('Applying theme:', theme);
  
  // Remove existing theme classes
  document.documentElement.className = document.documentElement.className
    .split(" ")
    .filter((cls) => !cls.startsWith("d") && !cls.startsWith("l"))
    .join(" ");

  // Add new theme class
  document.documentElement.classList.add(theme);
  
  // Update theme selector if it exists
  const themeSelect = document.getElementById("themeSelect");
  if (themeSelect) {
    themeSelect.value = theme;
  }
  
  // Always save the theme to localStorage when it's applied
  const saveSuccess = updateUserConfig(theme);
  if (!saveSuccess) {
    console.warn('Failed to save theme to storage, theme may not persist on refresh');
  }
  
  // Update spinner colors
  const spinner = document.querySelector(".spinner");
  if (spinner) {
    spinner.style.borderColor = `rgba(var(--primary-rgb), 0.2)`;
    spinner.style.borderTopColor = `var(--primary)`;
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
    // For test data, use a simulated response
    if (url.includes('test_data.csv')) {
      clearTimeout(timeoutId);
      return 'TEST_COMMAND,Test Description\nTEST_COMMAND_2,Another Test Description';
    }

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
};

/**
 * Processes the fetched data from CSV/Excel format
 * @function processData
 * @param {string} data - The raw data to process
 * @returns {Array<Object>} Array of command objects
 */
const processData = (data) => {
  try {
    // Check if data is in CSV format
    if (data.includes(',')) {
      // Simple CSV parsing for test data
      const rows = data.split('\n').map(row => row.split(','));
      const processedData = rows.map(row => ({
        command: row[0],
        description: row[1] || 'undefined'
      }));
      displayData(processedData);
      return;
    }

    // Process Excel data
    const workbook = XLSX.read(data, { type: "string" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const processedData = json
      .map((row) => {
        if (!row || row.length === 0) return null;
        return {
          command: row[0],
          description: row[1] || "undefined"
        };
      })
      .filter((item) => item !== null);

    displayData(processedData);
  } catch (error) {
    console.error("Error processing data:", error);
    showAlert("Error processing data. Please check the file format.", "error");
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
  dataElement.classList.add("command-item", "data-item");

  // Store original values as data attributes for later reference
  const encodedItem = btoa(unescape(encodeURIComponent(item)));
  const encodedDescription = btoa(unescape(encodeURIComponent(description || "undefined")));
  
  dataElement.dataset.originalItem = encodedItem;
  dataElement.dataset.originalDescription = encodedDescription;
  
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
  strongElement.textContent = maskedItem;
  paragraph.appendChild(strongElement);
  
  // Add a space and the description as text
  paragraph.appendChild(document.createTextNode(' '));
  const descriptionSpan = document.createElement('span');
  descriptionSpan.className = "command-description";
  descriptionSpan.textContent = maskedDescription;
  paragraph.appendChild(descriptionSpan);
  
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

  // Add data attributes for sensitive data
  if (item.includes(config.passwordMaskingKeyword)) {
    dataElement.dataset.hasSensitiveData = 'true';
    dataElement.dataset.original = item; // Store the original text for unmasking
  }

  return dataElement;
};

/**
 * Initializes the application
 * @async
 * @function initializeApp
 */
const initializeApp = async () => {
  try {
    showLoading();
    hideError();

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const testUser = urlParams.get('testUser');
    const testTheme = urlParams.get('testTheme');
    const simulateError = urlParams.get('simulateError');
    const customFilePath = urlParams.get('filePath');

    // Handle simulated errors for testing
    if (simulateError === 'missingFile') {
      throw new Error('Could not load data file');
    }

    if (simulateError === 'temporaryError') {
      showError('Could not load data file');
      return;
    }

    // Update user display if test user is provided
    if (testUser) {
      updateUserDisplay(testUser);
    }

    // Apply test theme if provided
    if (testTheme) {
      await updateUserConfig(testTheme);
    }

    // Load configuration
    const config = await fetch("user_config.json").then((response) =>
      response.json()
    ).catch(error => {
      console.warn("Error loading config:", error);
      return { 
        file_settings: { file_path: customFilePath || "comm.csv" },
        user_settings: { user_name: "" }
      };
    });
    
    // Get file path from config or URL parameter
    const filePath = customFilePath || config.file_settings?.file_path || COMMANDS_API_URL;
    if (!filePath) {
      throw new Error("No file path specified");
    }

    // Load and process data
    const data = await fetchDataWithTimeout(filePath);
    processData(data);

    // Initialize theme
    const savedTheme = localStorage.getItem('selectedTheme') || 'd4';
    applyTheme(savedTheme);
    
    // Apply user name
    const userName = config.user_settings?.user_name || "";
    applyUserName(userName);
  } catch (error) {
    console.error('Error initializing app:', error);
    showError(error.message || 'An error occurred while loading the application');
  } finally {
    hideLoading();
  }
  addEventListeners();
};

initializeApp();
