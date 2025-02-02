/* Author: Ajay Singh */
/* Version: 1.1 */
/* Date: 09-11-2023 */

const COMMANDS_API_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpgO5dkZtima-Pn9QPveTMsANWp-oMYBwNAc2xU0n-MsMiJKMSFqUP42xWOBZYQiUAoQsbnIysArka/pub?output=csv";

// Configuration for app settings
const config = {
  passwordMaskingKeyword: "##", // Centralized password masking keyword (can be changed to '**' or any other)
};

// DOM Elements
const DOM_ELEMENTS = {
  dataDiv: document.getElementById("data"),
  searchInput: document.getElementById("searchInput"),
  title: document.getElementById("pageTitle"),
  loadingOverlay: document.querySelector(".loading-overlay"),
  toast: document.getElementById("toast"),
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
const fetchData = async (filePath) => {
  try {
    showLoading();
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.text();
    const workbook = XLSX.read(data, { type: "string" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const items = XLSX.utils.sheet_to_json(sheet, { header: ["item", "description"] });

    renderData(items);
  } catch (error) {
    console.error("Error fetching data:", error);
    DOM_ELEMENTS.dataDiv.innerHTML = `<p class="error-message">Failed to load data. Error: ${error.message}</p>`;
  } finally {
    hideLoading();
  }
};

const renderData = (items) => {
  DOM_ELEMENTS.dataDiv.innerHTML = items.length ? "" : "<p>No data available.</p>";
  const fragment = document.createDocumentFragment();

  items.forEach(({ item, description }) => {
    if (item && description) {
      const dataElement = createDataElement(item, description);
      fragment.appendChild(dataElement);
    }
  });

  DOM_ELEMENTS.dataDiv.appendChild(fragment);
};

const createDataElement = (item, description) => {
  const dataElement = document.createElement("div");
  dataElement.classList.add("data-item");
  
  // Add a container for better layout control
  const contentWrapper = document.createElement("div");
  contentWrapper.classList.add("data-item-content");
  
  const maskedItem = maskSensitiveData(item);
  const maskedDescription = maskSensitiveData(description);
  contentWrapper.innerHTML = `<p><strong class="command-text">${maskedItem}</strong> - ${maskedDescription}</p>`;
  
  // Add copy icon (SVG from Material Icons)
  const copyIcon = document.createElement("div");
  copyIcon.classList.add("copy-icon");
  copyIcon.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
      <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/>
    </svg>
  `;
  copyIcon.onclick = () => copyToClipboard(item, dataElement);
  
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
const copyToClipboard = (text, element) => {
  if (!text) return;

  const cleanedText = removeMasking(text);
  navigator.clipboard.writeText(cleanedText)
    .then(() => {
      // Add the copied class to the item
      element.classList.add("copied");
      // Remove the class after the animation ends
      setTimeout(() => {
        element.classList.remove("copied");
      }, 500); // Match the animation duration
    })
    .catch((error) => {
      console.error("Failed to copy:", error);
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
        item.innerHTML = item.dataset.originalHTML;
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
        // Rebuild the HTML with highlights and masking
        const highlightedItem = highlightText(item.dataset.originalItem, searchValue);
        const highlightedDescription = highlightText(item.dataset.originalDescription, searchValue);
        item.innerHTML = `<p><strong class="command-text">${highlightedItem}</strong> - ${highlightedDescription}</p>`;
      } else {
        item.style.display = "none";
      }
    });
  } finally {
    hideLoading();
  }
};

// Update the event listener
const addEventListeners = () => {
  DOM_ELEMENTS.searchInput.addEventListener("input", (event) => {
    const query = event.target.value;
    
    // Clear search if input is empty
    if (!query.trim()) {
      filterData('');
      return;
    }
    
    if (query.length > 100) {
      showAlert("Search query too long", "error");
      return;
    }
    
    filterData(query);
  });

  // Add keydown listener for initial focus
  document.addEventListener("keydown", (event) => {
    // Only focus if it's a printable character and not already focused
    if (event.key.length === 1 && 
        !['Control', 'Shift', 'Alt', 'Meta'].includes(event.key) &&
        document.activeElement !== DOM_ELEMENTS.searchInput) {
      DOM_ELEMENTS.searchInput.focus();
    }
  });

  DOM_ELEMENTS.title.addEventListener("click", () => location.reload(true));

  // Add event listener for clear search button
  const clearSearch = document.getElementById("clearSearch");
  if (clearSearch) {
    clearSearch.addEventListener("click", () => {
      DOM_ELEMENTS.searchInput.value = ""; // Clear the input
      filterData(""); // Reset the filtered data
      DOM_ELEMENTS.searchInput.focus(); // Keep focus on the input
    });
  }

  const searchInput = DOM_ELEMENTS.searchInput;
  const clearSearchButton = document.getElementById("clearSearch");

  // Initialize cross icon visibility based on search bar's initial state
  if (searchInput && clearSearchButton) {
    if (searchInput.value.trim() === "") {
      clearSearchButton.style.display = "none";
    } else {
      clearSearchButton.style.display = "block";
    }

    // Update cross icon visibility on input
    searchInput.addEventListener("input", () => {
      if (searchInput.value.trim() === "") {
        clearSearchButton.style.display = "none";
      } else {
        clearSearchButton.style.display = "block";
      }
    });
  }
};

// Initialization function
const initializeApp = async () => {
  try {
    const config = await fetch("user_config.json").then(response => response.json());
    const filePath = config.file_settings?.file_path || COMMANDS_API_URL;
    await fetchData(filePath);
  } catch (error) {
    console.error("Error loading user configuration:", error);
    await fetchData(COMMANDS_API_URL);
  }
  addEventListeners();
};

initializeApp();
