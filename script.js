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
  commandsDiv: document.getElementById("commands"),
  searchInput: document.getElementById("searchInput"),
  title: document.querySelector("h1"),
  toast: document.getElementById("toast"),
  loadingOverlay: document.querySelector(".loading-overlay"),
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
    toast.classList.remove("show", "success", "error");
    toast.classList.add("show", type);
    toast.textContent = message;

    setTimeout(() => toast.classList.remove("show"), 2300);
  }
};

// Mask data wrapped in the configured keyword (default: '##')
const maskPasswordData = (text) => {
  const regex = new RegExp(
    `${config.passwordMaskingKeyword}([^${config.passwordMaskingKeyword}]+)${config.passwordMaskingKeyword}`,
    "g"
  );
  return text.replace(
    regex,
    `${config.passwordMaskingKeyword}Password${config.passwordMaskingKeyword}`
  );
};

// Command functions
const fetchCommands = async () => {
  try {
    showLoading();
    const response = await fetch(COMMANDS_API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.text();
    console.log("Data fetched successfully:", data);

    const workbook = XLSX.read(data, { type: "string" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const commands = XLSX.utils.sheet_to_json(sheet, {
      header: ["command", "description"],
    });

    renderCommands(commands);
  } catch (error) {
    console.error("Error fetching commands:", error);
    DOM_ELEMENTS.commandsDiv.innerHTML = `<p class="error-message">Failed to load commands. Error: ${error.message}</p>`;
  } finally {
    hideLoading();
  }
};

const renderCommands = (commands) => {
  DOM_ELEMENTS.commandsDiv.innerHTML = "";
  if (commands.length === 0) {
    DOM_ELEMENTS.commandsDiv.innerHTML = "<p>No commands available.</p>";
    return;
  }

  const fragment = document.createDocumentFragment();
  commands.forEach(({ command, description }) => {
    if (command && description) {
      const commandElement = createCommandElement(command, description);
      fragment.appendChild(commandElement);
    }
  });
  DOM_ELEMENTS.commandsDiv.appendChild(fragment);
};

const createCommandElement = (command, description) => {
  const commandElement = document.createElement("div");
  commandElement.classList.add("command");

  const maskedCommand = maskPasswordData(command);
  const maskedDescription = maskPasswordData(description);

  const originalCommand = removeMasking(command);
  const originalDescription = removeMasking(description);

  const originalHTML = `<p><strong>${maskedCommand}</strong> - ${maskedDescription}</p>`;
  commandElement.innerHTML = originalHTML;

  commandElement.dataset.originalCommand = originalCommand;
  commandElement.dataset.originalDescription = originalDescription;
  commandElement.dataset.originalHTML = originalHTML;

  commandElement.onclick = () => copyToClipboard(originalCommand);
  return commandElement;
};

// Remove the masking (i.e., get the original command and description)
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
    .then(() => showAlert("Command copied!", "success"))
    .catch((error) => {
      console.error("Failed to copy:", error);
      showAlert("Failed to copy command.", "error");
    });
};

// Filter commands based on search input
const filterCommands = (query) => {
  const searchValue = query.trim().toLowerCase();
  const commands = document.querySelectorAll(".command");

  commands.forEach((command) => {
    const originalCommandHTML = command.dataset.originalHTML;
    const originalCommand = command.dataset.originalCommand;
    const originalDescription = command.dataset.originalDescription;

    const matchesSearch =
      originalCommand.toLowerCase().includes(searchValue) ||
      originalDescription.toLowerCase().includes(searchValue);

    if (matchesSearch) {
      command.style.display = "block";
      command.innerHTML = searchValue
        ? highlightText(originalCommandHTML, searchValue)
        : originalCommandHTML;
    } else {
      command.style.display = "none";
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
    filterCommands(event.target.value)
  );
  DOM_ELEMENTS.title.addEventListener("click", () => location.reload(true));
};

// New event listener to focus on search input when typing
document.addEventListener("keydown", (event) => {
  const isCharacterKey = event.key.length === 1;
  if (isCharacterKey && document.activeElement !== DOM_ELEMENTS.searchInput) {
    DOM_ELEMENTS.searchInput.focus();
  }
});

// Initialization function
const initializeApp = async () => {
  await fetchCommands();
  addEventListeners();
};

initializeApp();
