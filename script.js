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

  toast.classList.remove("show", "hide", "success", "error");
  toast.classList.add(type);
  toast.textContent = message;

  setTimeout(() => {
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.add("hide");
    }, 2300);
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

  const maskedItem = maskSensitiveData(item);
  const maskedDescription = maskSensitiveData(description);
  const originalHTML = `<p><strong>${maskedItem}</strong> - ${maskedDescription}</p>`;

  dataElement.innerHTML = originalHTML;
  dataElement.dataset.originalItem = removeMasking(item);
  dataElement.dataset.originalDescription = removeMasking(description);
  dataElement.dataset.originalHTML = originalHTML;
  dataElement.onclick = () => copyToClipboard(dataElement.dataset.originalItem);

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
const copyToClipboard = (text) => {
  if (!text) return showAlert("No text to copy", "error");
  
  navigator.clipboard.writeText(text)
    .then(() => showAlert("Copied to clipboard!", "success"))
    .catch((error) => {
      console.error("Failed to copy:", error);
      showAlert("Failed to copy data. Please try again.", "error");
    });
};

// Update the highlightText function
const highlightText = (text, searchValue) => {
  const regex = new RegExp(`(${searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
};

// Update the filterData function
const filterData = (query) => {
  showLoading();
  try {
    const searchValue = query.trim().toLowerCase();
    const items = document.querySelectorAll(".data-item");

    items.forEach((item) => {
      const originalItem = item.dataset.originalItem.toLowerCase();
      const originalDescription = item.dataset.originalDescription.toLowerCase();
      const matchesSearch = 
        originalItem.includes(searchValue) ||
        originalDescription.includes(searchValue);

      if (matchesSearch) {
        item.style.display = "block";
        // Rebuild the HTML with highlights
        const highlightedItem = highlightText(item.dataset.originalItem, searchValue);
        const highlightedDescription = highlightText(item.dataset.originalDescription, searchValue);
        item.innerHTML = `<p><strong>${highlightedItem}</strong> - ${highlightedDescription}</p>`;
      } else {
        item.style.display = "none";
      }
    });
  } finally {
    hideLoading();
  }
};

// Event listeners
const addEventListeners = () => {
  DOM_ELEMENTS.searchInput.addEventListener("input", (event) => {
    const query = event.target.value;
    if (query.length > 100) return showAlert("Search query too long", "error");
    filterData(query);
  });

  DOM_ELEMENTS.title.addEventListener("click", () => location.reload(true));

  document.addEventListener("keydown", (event) => {
    if (event.key.length === 1 && document.activeElement !== DOM_ELEMENTS.searchInput) {
      DOM_ELEMENTS.searchInput.focus();
    }
  });
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
