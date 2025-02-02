/* Author: Ajay Singh */
/* Version: 1.1.1 */
/* Date: 09-11-2023 */

// Configuration constants
const COMMANDS_API_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpgO5dkZtima-Pn9QPveTMsANWp-oMYBwNAc2xU0n-MsMiJKMSFqUP42xWOBZYQiUAoQsbnIysArka/pub?output=csv";

// Configuration for app settings
const config = {
  passwordMaskingKeyword: "##", // Centralized password masking keyword (can be changed to '**' or any other)
};

// DOM Elements cache
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

// Utility functions
const showLoading = () => {
  document.body.classList.add("loading");
  if (DOM_ELEMENTS.loadingOverlay) {
    DOM_ELEMENTS.loadingOverlay.style.display = "flex";
  }
};

const hideLoading = () => {
  document.body.classList.remove("loading");
  if (DOM_ELEMENTS.loadingOverlay) {
    DOM_ELEMENTS.loadingOverlay.style.display = "none";
  }
};

const showAlert = (message, type) => {
  const toast = DOM_ELEMENTS.toast;
  if (!toast) return;

  // Remove existing classes
  toast.classList.remove("show", "hide", "success", "error");

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

// Mask data wrapped in the configured keyword (default: '##')
const maskSensitiveData = (text) => {
  const regex = new RegExp(
    `${config.passwordMaskingKeyword}([^${config.passwordMaskingKeyword}]+)${config.passwordMaskingKeyword}`,
    "g"
  );
  return text.replace(regex, `${config.passwordMaskingKeyword}SensitiveData${config.passwordMaskingKeyword}`);
};

// Data functions
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

const displayData = (data) => {
  const dataDiv = DOM_ELEMENTS.dataDiv;
  if (!dataDiv) return;

  // Clear existing content
  dataDiv.innerHTML = '';

  // Create and append new data items
  data.forEach(item => {
    if (item && item.command) {
      const dataElement = createDataElement(item.command, item.description);
      dataDiv.appendChild(dataElement);
    }
  });
};

const createDataElement = (item, description) => {
  const dataElement = document.createElement("div");
  dataElement.classList.add("data-item");
  
  // Add click handler to the entire item
  dataElement.addEventListener('click', (event) => {
    copyToClipboard(item, dataElement, event);
  });

  const contentWrapper = document.createElement("div");
  contentWrapper.classList.add("data-item-content");
  
  const maskedItem = maskSensitiveData(item);
  const maskedDescription = description === "undefined" ? "undefined" : maskSensitiveData(description);
  contentWrapper.innerHTML = `<p><strong class="command-text">${maskedItem}</strong> - ${maskedDescription}</p>`;
  
  // Add copy icon
  const copyIcon = document.createElement("div");
  copyIcon.classList.add("copy-icon");
  copyIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
      <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/>
    </svg>
  `;
  
  dataElement.appendChild(contentWrapper);
  dataElement.appendChild(copyIcon);
  dataElement.dataset.originalItem = item;
  dataElement.dataset.originalDescription = description;
  dataElement.dataset.originalHTML = contentWrapper.innerHTML;
  
  return dataElement;
};

// Remove the masking (i.e., get the original item and description)
const removeMasking = (text) => {
  const regex = new RegExp(
    `${config.passwordMaskingKeyword}([^${config.passwordMaskingKeyword}]+)${config.passwordMaskingKeyword}`,
    "g"
  );
  return text.replace(regex, "$1");
};

// Copy to clipboard
const copyToClipboard = (text, element, event) => {
  if (!text) return;

  // Get click position relative to the element
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Set CSS variables for ripple origin
  element.style.setProperty('--mouse-x', `${x}px`);
  element.style.setProperty('--mouse-y', `${y}px`);

  const cleanedText = removeMasking(text);
  navigator.clipboard.writeText(cleanedText)
    .then(() => {
      // Add the copied class to trigger the ripple animation
      element.classList.add("copied");
      // Remove the class after the animation ends
      setTimeout(() => {
        element.classList.remove("copied");
      }, 600);
    })
    .catch((error) => {
      console.error("Failed to copy:", error);
      showAlert("Failed to copy to clipboard. Please try again.", "error");
    });
};

// Update the highlightText function
const highlightText = (text, searchValue) => {
  // Don't highlight if search is empty
  if (!searchValue.trim()) return maskSensitiveData(text);
  
  // Escape special characters and handle multiple spaces
  const escapedSearch = searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*');
  const regex = new RegExp(`(${escapedSearch})`, 'gi');
  
  // Mask sensitive data first, then highlight
  const maskedText = maskSensitiveData(text);
  return maskedText.replace(regex, (match) => {
    // Preserve existing strong tags
    if (match.startsWith('<strong') && match.endsWith('</strong>')) {
      return match.replace(/(<strong[^>]*>)(.*?)(<\/strong>)/, 
        `$1<span class="highlight">$2</span>$3`);
    }
    return `<span class="highlight">${match}</span>`;
  });
};

// Update the filterData function
const filterData = (query) => {
  showLoading();
  try {
    const searchValue = query.trim().toLowerCase();
    
    // Don't highlight if search is empty
    if (!searchValue) {
      document.querySelectorAll(".data-item").forEach(item => {
        item.style.display = "block";
        // Restore original content while preserving event listeners
        item.querySelector('.data-item-content').innerHTML = item.dataset.originalHTML;
      });
      return;
    }

    const items = document.querySelectorAll(".data-item");
    items.forEach((item) => {
      const originalItem = item.dataset.originalItem.toLowerCase();
      const originalDescription = item.dataset.originalDescription.toLowerCase();
      const matchesSearch = 
        originalItem.includes(searchValue) ||
        originalDescription.includes(searchValue);

      if (matchesSearch) {
        item.style.display = "block";
        // Update only the content, not the entire item
        const content = item.querySelector('.data-item-content');
        if (content) {
          const highlightedItem = highlightText(item.dataset.originalItem, searchValue);
          const highlightedDescription = highlightText(item.dataset.originalDescription, searchValue);
          content.innerHTML = `<p><strong class="command-text">${highlightedItem}</strong> - ${highlightedDescription}</p>`;
        }
      } else {
        item.style.display = "none";
      }
    });
  } finally {
    hideLoading();
  }
};

// Clean up and optimize event listeners
const addEventListeners = () => {
  // Auto-focus on search when typing
  document.addEventListener("keydown", (event) => {
    if (event.key.length === 1 && 
        !['Control', 'Shift', 'Alt', 'Meta'].includes(event.key) &&
        document.activeElement !== DOM_ELEMENTS.searchInput) {
      DOM_ELEMENTS.searchInput.focus();
    }
  });

  // Search input handling
  DOM_ELEMENTS.searchInput?.addEventListener('input', (e) => {
    const searchValue = e.target.value;
    filterData(searchValue);
    DOM_ELEMENTS.clearSearch.style.display = searchValue ? "block" : "none";
  });

  // Clear search handling
  DOM_ELEMENTS.clearSearch?.addEventListener('click', () => {
    DOM_ELEMENTS.searchInput.value = "";
    filterData("");
    DOM_ELEMENTS.clearSearch.style.display = "none";
    DOM_ELEMENTS.searchInput.focus();
  });

  // Refresh functionality
  DOM_ELEMENTS.title.addEventListener("click", () => {
    window.location.href = window.location.href.split('?')[0] + '?t=' + Date.now();
    window.location.reload(true);
  });
};

// Theme names mapped from themes.css comments
const THEME_NAMES = {
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
  l11: "Lavender Mist (Light)"
};

// Helper functions for cookies
const setCookie = (name, value, days = 365) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

// Save data to a local file
const saveToFile = async (data, fileName) => {
  try {
    // Request permission to save the file
    const handle = await window.showSaveFilePicker({
      suggestedName: fileName,
      types: [{
        description: 'Text Files',
        accept: {'text/plain': ['.txt']},
      }],
    });

    // Create a writable stream
    const writable = await handle.createWritable();
    await writable.write(data);
    await writable.close();

    console.log('File saved successfully');
  } catch (error) {
    console.error('Error saving file:', error);
  }
};

// Example usage
const saveThemeToFile = async (theme) => {
  const data = JSON.stringify({ theme }, null, 2);
  await saveToFile(data, 'theme_config.txt');
};

// Update theme
const updateTheme = async (theme) => {
  try {
    // Save theme to localStorage
    localStorage.setItem('theme', theme);
    // Apply the theme
    applyTheme(theme);

    // Update theme in user_config.json
    const response = await fetch("user_config.json");
    const config = await response.json();
    config.user_settings.theme = theme;

    // Save updated config
    await fetch("user_config.json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    });
  } catch (error) {
    console.error("Error updating theme:", error);
    showAlert("Failed to update theme. Please try again.", "error");
  }
};

// Initialize theme selector
const initThemeSelector = (initialTheme) => {
  const themeSelect = document.getElementById("themeSelect");
  if (!themeSelect) return;

  // Add theme options
  Object.entries(THEME_NAMES).forEach(([value, name]) => {
    const option = document.createElement("option");
    option.value = value;
    // Remove (Dark) and (Light) from the name but keep the theme code
    option.textContent = `${name.replace(/ \(Dark\)| \(Light\)/g, '')} (${value})`;
    themeSelect.appendChild(option);
  });

  // Set current theme from localStorage or config
  const savedTheme = localStorage.getItem('theme') || initialTheme;
  themeSelect.value = savedTheme;

  // Handle theme change
  themeSelect.addEventListener("change", (e) => {
    const selectedTheme = e.target.value;
    if (selectedTheme) {
      // Save the selected theme to localStorage
      localStorage.setItem('theme', selectedTheme);
      // Apply the theme immediately
      applyTheme(selectedTheme);
    }
  });
};

// Apply theme
const applyTheme = (theme) => {
  // Remove existing theme classes
  document.documentElement.className = 
    document.documentElement.className
      .split(' ')
      .filter(cls => !cls.startsWith('d') && !cls.startsWith('l'))
      .join(' ');

  // Add the correct theme class
  document.documentElement.classList.add(theme);

  // Update spinner colors
  const spinner = document.querySelector('.spinner');
  if (spinner) {
    spinner.style.borderColor = `rgba(var(--primary-rgb), 0.2)`;
    spinner.style.borderTopColor = `var(--primary)`;
  }
};

// Function to apply user name
const applyUserName = (userName) => {
  const pageTitle = document.getElementById("pageTitle");
  if (pageTitle) {
    pageTitle.textContent = userName ? `${userName}'s COMPY` : "COMPY";
  }
};

// Process the fetched data
const processData = (data) => {
  try {
    const workbook = XLSX.read(data, { type: "string" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const processedData = json.map(row => {
      // Skip empty rows
      if (!row || row.length === 0) return null;
      
      // Handle single column data
      if (row.length === 1) {
        return { command: row[0], description: "undefined" };
      }
      return { command: row[0], description: row[1] || "undefined" };
    }).filter(item => item !== null); // Remove null entries

    // Store and display the data
    allData = processedData;
    displayData(processedData);
  } catch (error) {
    console.error("Error processing data:", error);
    showAlert("Error processing data. Please check the file format.", "error");
  }
};

// Check for theme changes in config
const checkForThemeChanges = async () => {
  try {
    const response = await fetch("user_config.json");
    const config = await response.json();
    const currentTheme = config.user_settings?.theme;

    // Get the current applied theme
    const appliedTheme = document.documentElement.classList.value.match(/d\d+|l\d+/)?.[0];

    // If the theme has changed, apply the new theme
    if (currentTheme && currentTheme !== appliedTheme) {
      applyTheme(currentTheme);
      const themeSelect = document.getElementById("themeSelect");
      if (themeSelect) {
        themeSelect.value = currentTheme;
      }
    }
  } catch (error) {
    console.error("Error checking for theme changes:", error);
  }
};

// Add to initialization
const initializeApp = async () => {
  try {
    showLoading();

    const config = await fetch("user_config.json").then(response => response.json());
    const filePath = config.file_settings?.file_path;
    
    if (!filePath) {
      throw new Error("No file path specified in config");
    }

    // Apply theme from localStorage or config
    const savedTheme = localStorage.getItem('theme') || config.user_settings?.theme || 'd4';
    applyTheme(savedTheme);
    initThemeSelector(savedTheme); // Initialize with saved theme

    applyUserName(config.user_settings?.user_name || "");

    const data = await fetchDataWithTimeout(filePath);
    processData(data);

    setInterval(checkForThemeChanges, 5000);
  } catch (error) {
    console.error("Error loading data:", error);
    showAlert("An unexpected error occurred. Please try again.", "error");
  } finally {
    hideLoading();
  }
  addEventListeners();
};

initializeApp();
