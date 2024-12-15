// Author: Ajay Singh
// Version: 1.0
// Date: 09-11-2023

const COMMANDS_API_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTpgO5dkZtima-Pn9QPveTMsANWp-oMYBwNAc2xU0n-MsMiJKMSFqUP42xWOBZYQiUAoQsbnIysArka/pub?output=csv';

const DOM_ELEMENTS = {
  commandsDiv: document.getElementById('commands'),
  searchInput: document.getElementById('searchInput'),
  title: document.querySelector('h1'),
  toast: document.getElementById('toast'),
  loadingOverlay: document.querySelector('.loading-overlay'),
};

// Utility functions
const showLoading = () => {
  document.body.classList.add('loading');
  DOM_ELEMENTS.loadingOverlay.style.display = 'flex';
};

const hideLoading = () => {
  document.body.classList.remove('loading');
  DOM_ELEMENTS.loadingOverlay.style.display = 'none';
};

const showAlert = (message, type) => {
  const toast = DOM_ELEMENTS.toast;
  toast.classList.remove('show', 'success', 'error');
  toast.classList.add('show', type);
  toast.textContent = message;

  setTimeout(() => toast.classList.remove('show'), 2300);
};

// Command functions
const fetchCommands = async () => {
  try {
    showLoading();
    const response = await fetch(COMMANDS_API_URL);
    if (!response.ok) throw new Error('Failed to fetch commands.');
    const data = await response.text();

    const workbook = XLSX.read(data, { type: 'string' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const commands = XLSX.utils.sheet_to_json(sheet, { header: ['command', 'description'] });

    renderCommands(commands);
  } catch (error) {
    console.error('Error fetching commands:', error);
    DOM_ELEMENTS.commandsDiv.innerHTML = '<p class="error-message">Failed to load commands. Please try again later.</p>';
  } finally {
    hideLoading();
  }
};

const renderCommands = (commands) => {
  DOM_ELEMENTS.commandsDiv.innerHTML = '';
  if (commands.length === 0) {
    DOM_ELEMENTS.commandsDiv.innerHTML = '<p>No commands available.</p>';
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
  const commandElement = document.createElement('div');
  commandElement.classList.add('command');
  const originalHTML = `<p><strong>${command}</strong> - ${description}</p>`;
  commandElement.innerHTML = originalHTML;
  commandElement.dataset.originalHTML = originalHTML;

  commandElement.onclick = () => copyToClipboard(command);
  return commandElement;
};

// Copy to clipboard
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => showAlert('Command copied!', 'success'))
    .catch((error) => {
      console.error('Failed to copy:', error);
      showAlert('Failed to copy command.', 'error');
    });
};

// Filter commands based on search input
const filterCommands = (query) => {
  const searchValue = query.trim().toLowerCase();
  const commands = document.querySelectorAll('.command');

  commands.forEach(command => {
    const originalCommandHTML = command.dataset.originalHTML;
    command.innerHTML = searchValue ? highlightText(originalCommandHTML, searchValue) : originalCommandHTML;
    command.style.display = command.innerText.toLowerCase().includes(searchValue) ? 'block' : 'none';
  });
};

const highlightText = (text, searchValue) => {
  const regex = new RegExp(`(${searchValue})`, 'gi');
  return text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
};

// Event listeners
const addEventListeners = () => {
  DOM_ELEMENTS.searchInput.addEventListener('input', (event) => filterCommands(event.target.value));
  DOM_ELEMENTS.title.addEventListener('click', () => location.reload());
};

// Initialization function
const initializeApp = async () => {
  await fetchCommands();
  addEventListeners();
};

initializeApp();
