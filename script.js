// Author: Ajay Singh
// Version: 1.1
// Date: 09-11-2023

const COMMANDS_API_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpgO5dkZtima-Pn9QPveTMsANWp-oMYBwNAc2xU0n-MsMiJKMSFqUP42xWOBZYQiUAoQsbnIysArka/pub?output=csv";

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
  if (DOM_ELEMENTS.toast) {
    const toast = DOM_ELEMENTS.toast;
    toast.classList.remove("show", "hide", "success", "error");
    toast.classList.add(type);
    toast.textContent = message;

    // Show the toast
    setTimeout(() => toast.classList.add("show"), 10);

    // Hide the toast after 2.3 seconds
    setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.add("hide");
    }, 2300);
  }
};

// Mask data wrapped in the configured keyword (default: '##')
const maskSensitiveData = (text) => {
  const regex = new RegExp(
    `${config.passwordMaskingKeyword}([^${config.passwordMaskingKeyword}]+)${config.passwordMaskingKeyword}`,
    "g"
  );
  return text.replace(
    regex,
    `${config.passwordMaskingKeyword}SensitiveData${config.passwordMaskingKeyword}`
  );
};

// Data functions
const fetchData = async (filePath) => {
  try {
    showLoading();
    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.text();
    console.log("Data fetched successfully:", data);

    const workbook = XLSX.read(data, { type: "string" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const items = XLSX.utils.sheet_to_json(sheet, {
      header: ["item", "description"],
    });

    renderData(items);
  } catch (error) {
    console.error("Error fetching data:", error);
    DOM_ELEMENTS.dataDiv.innerHTML = `<p class="error-message">Failed to load data. Error: ${error.message}</p>`;
  } finally {
    hideLoading();
  }
};

const renderData = (items) => {
  DOM_ELEMENTS.dataDiv.innerHTML = "";
  if (items.length === 0) {
    DOM_ELEMENTS.dataDiv.innerHTML = "<p>No data available.</p>";
    return;
  }

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

  const originalItem = removeMasking(item);
  const originalDescription = removeMasking(description);

  const originalHTML = `<p><strong>${maskedItem}</strong> - ${maskedDescription}</p>`;
  dataElement.innerHTML = originalHTML;

  dataElement.dataset.originalItem = originalItem;
  dataElement.dataset.originalDescription = originalDescription;
  dataElement.dataset.originalHTML = originalHTML;

  dataElement.onclick = () => copyToClipboard(originalItem);
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
  navigator.clipboard
    .writeText(text)
    .then(() => showAlert("Copied to clipboard!", "success"))
    .catch((error) => {
      console.error("Failed to copy:", error);
      showAlert("Failed to copy data.", "error");
    });
};

// Filter data based on search input
const filterData = (query) => {
  const searchValue = query.trim().toLowerCase();
  const items = document.querySelectorAll(".data-item");

  items.forEach((item) => {
    const originalItemHTML = item.dataset.originalHTML;
    const originalItem = item.dataset.originalItem;
    const originalDescription = item.dataset.originalDescription;

    const matchesSearch =
      originalItem.toLowerCase().includes(searchValue) ||
      originalDescription.toLowerCase().includes(searchValue);

    if (matchesSearch) {
      item.style.display = "block";
      item.innerHTML = searchValue
        ? highlightText(originalItemHTML, searchValue)
        : originalItemHTML;
    } else {
      item.style.display = "none";
    }
  });
};

// Highlight text logic (same as before)
const highlightText = (text, searchValue) => {
  const regex = new RegExp(`(${searchValue})`, "gi");
  return text.replace(
    regex,
    (match) => `<span class="highlight">${match}</span>`
  );
};

// Event listeners
const addEventListeners = () => {
  DOM_ELEMENTS.searchInput.addEventListener("input", (event) =>
    filterData(event.target.value)
  );
  DOM_ELEMENTS.title.addEventListener("click", () => location.reload(true));

  // New event listener to focus on search input when typing
  document.addEventListener("keydown", (event) => {
    const isCharacterKey = event.key.length === 1;
    if (isCharacterKey && document.activeElement !== DOM_ELEMENTS.searchInput) {
      DOM_ELEMENTS.searchInput.focus();
    }
  });
};

// Initialization function
const initializeApp = async () => {
  await fetch("user_config.json")
    .then((response) => response.json())
    .then((config) => {
      const filePath = config.file_settings?.file_path || COMMANDS_API_URL;
      fetchData(filePath);
    })
    .catch((error) =>
      console.error("Error loading user configuration:", error)
    );
  addEventListeners();
};

initializeApp();
