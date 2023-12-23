// Author: Ajay Singh
// Version: 1.0
// Date: 2023-11-09

async function loadCommands() {
    // Fetching data from 'commands.csv' Github Gist (Raw)
    // const response = await fetch('https://gist.githubusercontent.com/ajayparihar/ea424724d874d67e2c5b52bf38d931f3/raw/b60ab4bb8b2bd75eaab87b9b4bcee4a5c746e48a/commands.csv');
    // Google sheet (publish as csv)
    const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTpgO5dkZtima-Pn9QPveTMsANWp-oMYBwNAc2xU0n-MsMiJKMSFqUP42xWOBZYQiUAoQsbnIysArka/pub?output=csv');
    const dataBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(dataBuffer, { type: 'array' });

    // Extracting data from the sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const commands = XLSX.utils.sheet_to_json(sheet, { header: ['command', 'description'] });

    const commandsDiv = document.getElementById('commands');

    // Creating HTML elements for each command
    commands.forEach(item => {
        const { command, description } = item;

        const commandElement = document.createElement('div');
        commandElement.classList.add('command');
        commandElement.innerHTML = `<p><strong>${command}</strong> - ${description}</p>`;
        commandElement.onclick = function () {
            copyToClipboard(command);
        };

        commandsDiv.appendChild(commandElement);
    });
}

let initialLoad = true; // Flag to track initial load

document.getElementById('searchInput').addEventListener('input', function () {
    const searchValue = this.value.toLowerCase();
    const commands = document.querySelectorAll('.command');

    if (searchValue === '') {
        location.reload(); // Reload the page
        return;
    }

    // Filtering and highlighting commands based on search input
    commands.forEach(command => {
        const commandText = command.innerText.toLowerCase();

        if (commandText.includes(searchValue)) {
            command.style.display = 'block';
            if (!initialLoad) {
                const highlightedText = commandText.replace(new RegExp(searchValue, 'gi'), (match) => `<span class="highlight">${match}</span>`);
                command.innerHTML = `<p><strong>${highlightedText}</strong></p>`;
            }
        } else {
            command.style.display = 'none';
        }
    });

    initialLoad = false;
});

function copyToClipboard(text) {
    // Copying text to clipboard
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    const selected =
        document.getSelection().rangeCount > 0
            ? document.getSelection().getRangeAt(0)
            : false;
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
    }

    showCopiedToast();
}

function showCopiedToast() {
    // Showing a toast notification for copied command
    const toast = document.getElementById('toast');
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2000);
}

loadCommands();
