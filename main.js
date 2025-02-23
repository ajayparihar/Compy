// main.js - Entry point for the Command Management System
import { showLoading, hideLoading, showAlert } from './ui.js';
import { fetchData } from './data.js';

// Configuration constants
const ITEMS_API_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpgO5dkZtima-Pn9QPveTMsANWp-oMYBwNAc2xU0n-MsMiJKMSFqUP42xWOBZYQiUAoQsbnIysArka/pub?output=csv";

// Initialize the application
const init = () => {
  showLoading();
  fetchData(ITEMS_API_URL)
    .then(data => {
      // Process data
      hideLoading();
    })
    .catch(error => {
      showAlert('Error fetching data', 'error');
      hideLoading();
    });
};

// Start the application
init(); 