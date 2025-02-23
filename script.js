/**
 * @fileoverview Command Management System - Main Client-side Script
 * @author Ajay Singh
 * @version 1.1
 * @created 11-09-2023
 * @updated 19-03-2024
 * 
 * This file contains the client-side functionality for the Command Management System.
 * It handles data fetching, display, search, clipboard operations, and theme management.
 * The system supports sensitive data masking and real-time search filtering.
 */

/* Author: Ajay Singh */
/* Version: 1.1 */
/* Date: 11-09-2023 */

// Configuration constants
const ITEMS_API_URL =
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
 * @param {string} type - The type of alert ('success' or 'error')
 */
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

/**
 * Masks sensitive data in text by replacing content between masking keywords
 * @function maskSensitiveData
 * @param {string} text - The text to process
 * @returns {string} The text with sensitive data masked
 */
const maskSensitiveData = (text) => {
  if (!text) return text;
  
  // Escape special characters in the masking keyword
  const escapedKeyword = config.passwordMaskingKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create regex that matches content between keywords, handling special characters
  const regex = new RegExp(
    `${escapedKeyword}([^]*?)${escapedKeyword}`,
    'g'
  );
  
  return text.replace(
    regex,
    `${config.passwordMaskingKeyword}SensitiveData${config.passwordMaskingKeyword}`
  );
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

  // Add click handler to the entire item
  dataElement.addEventListener("click", (event) => {
    copyToClipboard(item, dataElement, event);
  });

  const contentWrapper = document.createElement("div");
  contentWrapper.classList.add("data-item-content");

  const maskedItem = maskSensitiveData(item);
  const maskedDescription =
    description === "undefined" ? "undefined" : maskSensitiveData(description);
  contentWrapper.innerHTML = `<p><strong class="command-text">${maskedItem}</strong> ${maskedDescription}</p>`;

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

/**
 * Removes masking from sensitive data
 * @function removeMasking
 * @param {string} text - The masked text
 * @returns {string} The unmasked text
 */
const removeMasking = (text) => {
  if (!text) return text;
  
  // Escape special characters in the masking keyword
  const escapedKeyword = config.passwordMaskingKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // Create regex that matches content between keywords, handling special characters
  const regex = new RegExp(
    `${escapedKeyword}([^]*?)${escapedKeyword}`,
    'g'
  );
  
  return text.replace(regex, '$1');
};

/**
 * Copies text to clipboard with visual feedback
 * @function copyToClipboard
 * @param {string} text - The text to copy
 * @param {HTMLElement} element - The element that triggered the copy
 * @param {MouseEvent} event - The click event
 */
const copyToClipboard = (text, element, event) => {
  if (!text) return;

  // Get click position relative to the element
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Set CSS variables for ripple origin
  element.style.setProperty("--mouse-x", `${x}px`);
  element.style.setProperty("--mouse-y", `${y}px`);

  const cleanedText = removeMasking(text);
  navigator.clipboard
    .writeText(cleanedText)
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

/**
 * Highlights search terms in text while preserving sensitive data masking
 * @function highlightText
 * @param {string} text - The text to highlight
 * @param {string} searchTerm - The term to highlight
 * @returns {string} HTML string with highlighted terms
 */
const highlightText = (text, searchTerm) => {
  if (!searchTerm) return text;

  // Mask sensitive data first
  const maskedText = maskSensitiveData(text);

  // Create regex pattern for highlighting
  const regex = new RegExp(
    `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );

  // Split text into parts, only highlight non-sensitive parts
  return maskedText
    .split(/(\[SENSITIVE\])/)
    .map((part) => {
      // Don't highlight the [SENSITIVE] placeholder
      if (part === "[SENSITIVE]") {
        return part;
      }
      // Highlight matches in non-sensitive parts
      return part.replace(regex, '<span class="highlight">$1</span>');
    })
    .join("");
};

/**
 * Performs real-time search filtering on the displayed data
 * @function performSearch
 */
const performSearch = () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const dataItems = document.querySelectorAll(".data-item");

  dataItems.forEach((item) => {
    const command = item.dataset.command.toLowerCase();
    const description = item.dataset.description.toLowerCase();

    // Highlight matches in non-sensitive data
    const commandHTML = highlightText(item.dataset.command, searchTerm);
    const descriptionHTML = highlightText(item.dataset.description, searchTerm);

    // Update content
    item.querySelector("strong").innerHTML = commandHTML;
    item.querySelector("p").innerHTML = descriptionHTML;

    // Show/hide based on match (excluding sensitive data)
    const visibleText = `${command} ${description}`.replace(
      /\[SENSITIVE\]/g,
      ""
    );
    if (visibleText.includes(searchTerm)) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
  });
};

// Update the filterData function
const filterData = (query) => {
  showLoading();
  try {
    const searchValue = query.trim().toLowerCase();

    // Don't highlight if search is empty
    if (!searchValue) {
      // Get fresh entries from storage and display them
      const entries = getEntries();
      displayEntries(entries);
      return;
    }

    const items = document.querySelectorAll(".data-item");
    items.forEach((item) => {
      const originalItem = item.dataset.originalItem.toLowerCase();
      const originalDescription =
        item.dataset.originalDescription.toLowerCase();
      const matchesSearch =
        originalItem.includes(searchValue) ||
        originalDescription.includes(searchValue);

      if (matchesSearch) {
        item.style.display = "block";
        // Update only the content, not the entire item
        const content = item.querySelector(".data-item-content");
        if (content) {
          const highlightedItem = highlightText(
            item.dataset.originalItem,
            searchValue
          );
          const highlightedDescription = highlightText(
            item.dataset.originalDescription,
            searchValue
          );
          content.innerHTML = `<p><strong class="command-text">${highlightedItem}</strong> ${highlightedDescription}</p>`;
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
  // Auto-focus on search when typing, but not when in form inputs or modals
  document.addEventListener("keydown", (event) => {
    const activeElement = document.activeElement;
    const isModalOpen = document.querySelector('.modal.active');
    const isFormInput = activeElement.tagName === 'INPUT' || 
                       activeElement.tagName === 'TEXTAREA' ||
                       activeElement.isContentEditable;
    
    if (
      event.key.length === 1 &&
      !["Control", "Shift", "Alt", "Meta"].includes(event.key) &&
      !isFormInput &&
      !isModalOpen &&
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

  // Add export button click handler
  document.getElementById('exportButton').addEventListener('click', showExportPopup);
  
  // Add import button click handler
  document.getElementById('importButton').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      importConfig(file);
    }
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
  localStorage.setItem('selectedTheme', theme);
};

const loadThemeFromLocalStorage = () => {
  return localStorage.getItem('selectedTheme') || 'd4'; // Default to d4 if no theme saved
};

// Initialize theme selector
const initThemeSelector = () => {
  const themeSelect = document.getElementById("themeSelect");
  if (!themeSelect) return;

  // Add theme options
  Object.entries(THEME_NAMES).forEach(([value, name]) => {
    const option = document.createElement("option");
    option.value = value;
    // Remove (Dark), (Light), and don't add the theme code
    option.textContent = name.replace(/ \(Dark\)| \(Light\)/g, "");
    themeSelect.appendChild(option);
  });

  // Set initial theme from localStorage
  const savedTheme = loadThemeFromLocalStorage();
  themeSelect.value = savedTheme;
  applyTheme(savedTheme);

  // Handle theme change
  themeSelect.addEventListener("change", (e) => {
    const selectedTheme = e.target.value;
    applyTheme(selectedTheme);
    // Update the theme in user_config.json
    updateUserConfig(selectedTheme);
  });
};

// Update user config with new theme
const updateUserConfig = async (theme) => {
  try {
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

  // Update spinner colors
  const spinner = document.querySelector(".spinner");
  if (spinner) {
    spinner.style.borderColor = `rgba(var(--primary-rgb), 0.2)`;
    spinner.style.borderTopColor = `var(--primary)`;
  }

  // Save theme to localStorage
  saveThemeToLocalStorage(theme);
};

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
  initThemeSelector();
});

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

    const config = await fetch("user_config.json").then((response) =>
      response.json()
    );
    const filePath = config.file_settings?.file_path;

    if (!filePath) {
      throw new Error("No file path specified in config");
    }

    // Apply user name
    applyUserName(config.user_settings?.user_name || "");

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

// Data Management
const STORAGE_KEY = 'compy_data';

/**
 * Entry data structure
 * @typedef {Object} Entry
 * @property {string} id - Unique identifier
 * @property {string} command - The command/text
 * @property {string} description - Description
 * @property {boolean} isSensitive - Whether to mask the data
 * @property {string} category - Optional category
 * @property {string[]} tags - Optional tags
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 */

/**
 * Get all entries from localStorage
 * @returns {Entry[]}
 */
function getEntries() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

/**
 * Save entries to localStorage
 * @param {Entry[]} entries
 */
function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/**
 * Add a new entry
 * @param {Entry} entry
 * @returns {boolean} success
 */
function addEntry(entry) {
    const entries = getEntries();
    
    // Check for duplicates
    if (entries.some(e => e.command === entry.command)) {
        showToast('An entry with this command already exists');
        return false;
    }

    entries.push({
        ...entry,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });
    
    saveEntries(entries);
    displayEntries(entries);
    return true;
}

/**
 * Import entries from CSV
 * @param {string} csvContent
 * @returns {Entry[]}
 */
function parseCSV(csvContent) {
    const lines = csvContent.split('\n');
    return lines.slice(1).map(line => {
        const [command, description] = line.split(',').map(s => s.trim());
        const isSensitive = command.startsWith('##') && command.endsWith('##');
        
        return {
            id: crypto.randomUUID(),
            command: command,
            description: description || '',
            isSensitive,
            category: '',
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }).filter(entry => entry.command);
}

/**
 * Display entries in the UI
 * @param {Entry[]} entries
 */
function displayEntries(entries) {
    const dataDiv = document.getElementById('data');
    dataDiv.innerHTML = '';

    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredEntries = entries.filter(entry => {
        const searchString = `${entry.command} ${entry.description} ${entry.category} ${entry.tags.join(' ')}`.toLowerCase();
        return searchString.includes(searchTerm);
    });

    filteredEntries.forEach(entry => {
        const div = document.createElement('div');
        div.className = `data-item${entry.isSensitive ? ' sensitive' : ''}`;
        
        const commandText = entry.isSensitive ? '••••••' : entry.command;
        
        // Create the main content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'data-item-content';
        
        // Add command and description
        contentDiv.innerHTML = `
            <strong>${commandText}</strong>
            <p>${entry.description}</p>
        `;
        
        // Add category if exists
        if (entry.category) {
            const categorySpan = document.createElement('span');
            categorySpan.className = 'category';
            categorySpan.textContent = entry.category;
            contentDiv.appendChild(categorySpan);
        }
        
        // Add tags if they exist
        if (entry.tags && entry.tags.length > 0) {
            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'tags';
            
            entry.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'tag';
                tagSpan.textContent = tag;
                
                // Add click handler for tag filtering
                tagSpan.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent item click
                    const searchInput = document.getElementById('searchInput');
                    searchInput.value = tag;
                    filterData(tag);
                });
                
                tagsDiv.appendChild(tagSpan);
            });
            
            contentDiv.appendChild(tagsDiv);
        }
        
        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-icon';
        copyButton.setAttribute('aria-label', 'Copy to clipboard');
        copyButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/>
            </svg>
        `;

        copyButton.addEventListener('click', (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(entry.command).then(() => {
                div.classList.add('copied');
                setTimeout(() => div.classList.remove('copied'), 2000);
            });
        });

        // Add sensitive data handling
        if (entry.isSensitive) {
            div.addEventListener('click', () => {
                const strong = div.querySelector('strong');
                if (strong.textContent === '••••••') {
                    strong.textContent = entry.command;
                    setTimeout(() => strong.textContent = '••••••', 2000);
                }
            });
        }

        div.appendChild(contentDiv);
        div.appendChild(copyButton);
        dataDiv.appendChild(div);
    });
}

// UI Event Handlers
document.addEventListener('DOMContentLoaded', () => {
    // Initialize search
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => displayEntries(getEntries()));
    
    // Initialize clear search
    const clearSearch = document.getElementById('clearSearch');
    searchInput.addEventListener('input', () => {
        clearSearch.style.display = searchInput.value ? 'flex' : 'none';
    });
    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        clearSearch.style.display = 'none';
        displayEntries(getEntries());
    });

    // Add Entry Form
    const addEntryForm = document.getElementById('addEntryForm');
    addEntryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const entry = {
            command: document.getElementById('commandInput').value,
            description: document.getElementById('descriptionInput').value,
            category: document.getElementById('categoryInput').value,
            tags: document.getElementById('tagsInput').value.split(',').map(t => t.trim()).filter(t => t),
            isSensitive: document.getElementById('isSensitiveInput').checked
        };

        if (addEntry(entry)) {
            closeModal('addEntryModal');
            addEntryForm.reset();
            showToast('Entry added successfully');
        }
    });

    // FAB Button
    document.getElementById('addEntryFab').addEventListener('click', () => {
        openModal('addEntryModal');
    });

    // Import Button
    document.getElementById('importButton').addEventListener('click', () => {
        openModal('importModal');
    });

    // Close Modal Buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal.id);
        });
    });

    // CSV Import
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const filePickerButton = document.getElementById('filePickerButton');
    const previewArea = document.getElementById('previewArea');
    const previewContent = document.getElementById('previewContent');
    let csvData = null;

    // Drag and drop handlers
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        handleFileSelect(e.dataTransfer.files[0]);
    });

    filePickerButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFileSelect(e.target.files[0]);
    });

    function handleFileSelect(file) {
        if (!file || file.type !== 'text/csv') {
            showToast('Please select a valid CSV file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            csvData = e.target.result;
            const entries = parseCSV(csvData);
            
            previewContent.innerHTML = `
                <p>Found ${entries.length} entries</p>
                <ul>
                    ${entries.slice(0, 5).map(entry => `
                        <li>${entry.command} - ${entry.description}</li>
                    `).join('')}
                    ${entries.length > 5 ? '<li>...</li>' : ''}
                </ul>
            `;
            
            dropZone.hidden = true;
            previewArea.hidden = false;
        };
        reader.readAsText(file);
    }

    // Import Confirm Button
    document.getElementById('importConfirm').addEventListener('click', () => {
        if (!csvData) return;
        
        const newEntries = parseCSV(csvData);
        const existingEntries = getEntries();
        
        // Merge entries, avoiding duplicates
        const mergedEntries = [...existingEntries];
        let added = 0;
        
        newEntries.forEach(entry => {
            if (!existingEntries.some(e => e.command === entry.command)) {
                mergedEntries.push(entry);
                added++;
            }
        });
        
        saveEntries(mergedEntries);
        displayEntries(mergedEntries);
        closeModal('importModal');
        showToast(`Imported ${added} new entries`);
        
        // Reset import state
        csvData = null;
        dropZone.hidden = false;
        previewArea.hidden = true;
        fileInput.value = '';
    });

    // Display initial data
    displayEntries(getEntries());
});

// Modal Helpers
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Toast Helper
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

/**
 * Shows the export data popup with options
 * @function showExportPopup
 */
function showExportPopup() {
    const popupHTML = `
        <div id="exportPopup" class="modal">
            <div class="modal-content">
                <h2>Export Options</h2>
                <div class="export-options">
                    <label>
                        <input type="checkbox" id="exportFullProfile"> Full Profile
                        <span class="description">(Includes all settings and preferences)</span>
                    </label>
                    <label>
                        <input type="checkbox" id="exportData"> Data
                        <span class="description">(Includes commands and entries)</span>
                    </label>
                </div>
                <div class="modal-buttons">
                    <button onclick="handleExport()" class="primary-button">Export</button>
                    <button onclick="closeModal('exportPopup')" class="secondary-button">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    // Add popup to body if it doesn't exist
    if (!document.getElementById('exportPopup')) {
        document.body.insertAdjacentHTML('beforeend', popupHTML);
    }
    
    openModal('exportPopup');
}

/**
 * Handles the export based on selected options
 * @function handleExport
 */
async function handleExport() {
    const exportFullProfile = document.getElementById('exportFullProfile').checked;
    const exportData = document.getElementById('exportData').checked;
    
    if (!exportFullProfile && !exportData) {
        showToast('Please select at least one option to export');
        return;
    }
    
    const exportConfig = {
        timestamp: new Date().toISOString(),
        version: '1.0'
    };
    
    if (exportFullProfile) {
        exportConfig.profile = {
            theme: loadThemeFromLocalStorage(),
            userName: localStorage.getItem('userName') || '',
            favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
            settings: JSON.parse(localStorage.getItem('settings') || '{}')
        };
    }
    
    if (exportData) {
        exportConfig.data = {
            entries: getEntries(),
            customCommands: JSON.parse(localStorage.getItem('customCommands') || '[]')
        };
    }
    
    // Create and download the config file
    const blob = new Blob([JSON.stringify(exportConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compy_config_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    closeModal('exportPopup');
    showToast('Configuration exported successfully');
}

/**
 * Imports configuration from a file
 * @function importConfig
 * @param {File} file - The configuration file to import
 */
async function importConfig(file) {
    try {
        const content = await file.text();
        const config = JSON.parse(content);
        
        if (config.profile) {
            // Import profile settings
            if (config.profile.theme) {
                saveThemeToLocalStorage(config.profile.theme);
                applyTheme(config.profile.theme);
            }
            if (config.profile.userName) {
                localStorage.setItem('userName', config.profile.userName);
                applyUserName(config.profile.userName);
            }
            if (config.profile.favorites) {
                localStorage.setItem('favorites', JSON.stringify(config.profile.favorites));
            }
            if (config.profile.settings) {
                localStorage.setItem('settings', JSON.stringify(config.profile.settings));
            }
        }
        
        if (config.data) {
            // Import data
            if (config.data.entries) {
                saveEntries(config.data.entries);
                displayEntries(config.data.entries);
            }
            if (config.data.customCommands) {
                localStorage.setItem('customCommands', JSON.stringify(config.data.customCommands));
            }
        }
        
        showToast('Configuration imported successfully');
    } catch (error) {
        console.error('Error importing configuration:', error);
        showToast('Error importing configuration');
    }
}
