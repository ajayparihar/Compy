Ah, I see! You want to add a "New" tag next to the **Password Masking** feature in the list of features to indicate it's a new addition in **V1.1**. Here's the updated **README.md** with that "New" tag added:

---

# Compy V1.1

## Overview
**Compy** is a simple and efficient web-based tool that helps you manage and quickly access your saved data. Whether it’s commands, credentials, short notes, or any other important information, Compy provides an intuitive interface for easy storage and retrieval.

---

## Features
1. **Dynamic Data Loading**  
   Easily load your data from an online CSV file or a local file.

2. **Customizable Use Cases**  
   Use Compy for a variety of purposes:  
   - Saving commands and code snippets.  
   - Storing personal credentials or notes.  
   - Keeping track of tasks, reference points, and more.

3. **Interactive Search**  
   Instantly search and filter your data with live updates. Matched search terms are highlighted for quick identification.

4. **Copy to Clipboard**  
   Simply click on any item to copy it to your clipboard. A toast notification confirms the action.

5. **Automatic Updates**  
   Reload the page to reset filters and fetch updated data.

6. **Highlight Matches**  
   Matched search terms are dynamically highlighted to make it easier to find relevant data.

7. **Password Masking** **(New)**  
   **Password Masking** is a feature that hides sensitive data (like passwords, API keys, etc.) by wrapping it in a special masking keyword (e.g., `##Password##`). This ensures that sensitive information is not displayed directly in the interface.  
   
   **Customizable Masking Keyword**: The keyword used for masking data (such as `##`) is now customizable. You can change this keyword to any symbol or word (e.g., `**`) by updating the code. This flexibility allows you to adapt the tool to your security needs and preferences, making it easier to manage sensitive information.

---

## Customizing the Tool

### Clone the Repository
1. Clone the repository to your local system:
   ```bash
   git clone https://github.com/ajayparihar/Compy.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Compy
   ```

### Update the Data Source
You can load data from either an online CSV file or a local file.

#### Option 1: Using an Online CSV File
1. Open `script.js` in a text editor.
2. Locate the following line:
   ```javascript
   const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQzW7nf7zVPPuQaV3DQuCH3lxkog_lfNR437sjIOVfxW9ddOuEleLqH_XfjBPYRCQ/pub?gid=1883989031&single=true&output=csv');
   ```
3. Replace the URL with the link to your CSV file.

#### Option 2: Using a Local CSV File
1. Place your CSV file in the project directory.
2. Update the `fetch` call in `script.js` to reference the local file, like this:
   ```javascript
   const response = await fetch('./path-to-your-file.csv');
   ```

### Update the Masking Keyword
To customize the password masking keyword (e.g., change `##` to `**`):
1. Open `script.js`.
2. Locate the `config` object:
   ```javascript
   const config = {
     passwordMaskingKeyword: '##' // Change this to '**' or any other keyword
   };
   ```
3. Update `passwordMaskingKeyword` to your preferred keyword, such as `**`.

---

## Technologies Used
1. **HTML**  
   Provides the structure of the application.

2. **CSS**  
   Styles the interface for a clean and responsive design.

3. **JavaScript**  
   - Fetches data dynamically using the SheetJS library.  
   - Handles search and clipboard functionality.

4. **External Libraries**  
   - **SheetJS**: A library to read and parse spreadsheet data.

---

## Styling Details
- **Dark Theme**: A dark color scheme for a comfortable and modern user interface.  
- **Highlighting**: Search matches are highlighted for easy visibility.  
- **Toast Notification**: Simple feedback for user actions like copying to the clipboard.

---

## Supported Browsers
- Modern browsers such as Chrome, Firefox, Edge, and Safari are fully supported.

---

Compy makes it easy to save, organize, and retrieve important information quickly. You can test the live version here: [Compy](https://ajayparihar.github.io/Compy).

---

In this version (V1.1), the **Password Masking** feature has been introduced, allowing sensitive information to be hidden with a customizable keyword. This improves both security and flexibility, making it easier to manage private data within the application.