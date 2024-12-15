# Compy V1.0

## Overview
**Compy** is a versatile web-based tool designed to help users manage and reference any type of saved data efficiently. Whether it's commands, personal credentials, short notes, or any information you need quick access to in the future, Compy provides a seamless solution. With its search and copy functionality, users can quickly locate and copy data whenever needed.

---

## Features
1. **Dynamic Data Loading**  
   Compy fetches data from an external CSV file or a local file, making it adaptable to various user needs.

2. **Customizable Use Cases**  
   Use Compy for various purposes such as:  
   - Saving commands and code snippets.  
   - Storing personal credentials or notes.  
   - Keeping track of tasks, reference points, or other important data.

3. **Interactive Search**  
   Search through data and descriptions with instant filtering and highlighting of matches.

4. **Copy to Clipboard**  
   Clicking on any item automatically copies it to the clipboard. A visual toast notification confirms the action.

5. **Automatic Updates**  
   Reload the page easily to reset filters and fetch updated data.

6. **Highlight Matches**  
   Matched search terms are dynamically highlighted for better visibility.

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
Compy supports fetching data either from an online URL or a local file.

#### Option 1: Using an Online CSV File
1. Open `script.js` in a text editor.
2. Locate the following line:
   ```javascript
   const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQzW7nf7zVPPuQaV3DQuCH3lxkog_lfNR437sjIOVfxW9ddOuEleLqH_XfjBPYRCQ/pub?gid=1883989031&single=true&output=csv');
   ```
3. Replace the URL with your custom CSV file's link.

#### Option 2: Using a Local CSV File
1. Place your CSV file in the project directory.
2. Update the `fetch` call to reference the local file, like this:
   ```javascript
   const response = await fetch('./path-to-your-file.csv');
   ```
   Replace `path-to-your-file.csv` with the relative path to your CSV file.

3. Save the file and open `index.html` in a browser to see your customized setup.

---

## Technologies Used
1. **HTML**  
   Provides the structure for the application.

2. **CSS**  
   Styles the interface with a sleek dark theme and ensures responsiveness.

3. **JavaScript**  
   - Handles dynamic data fetching using the SheetJS library.  
   - Enables interactivity, including search functionality and clipboard operations.

4. **External Libraries**  
   - **SheetJS**: Parses and reads spreadsheet data.

---

## Styling Details
- **Dark Theme**: Background colors and text styles ensure a visually comfortable experience.  
- **Highlighting**: Matched search terms are displayed with a bright blue background to stand out against the dark theme.  
- **Toast Notification**: Simple, non-intrusive feedback for user actions.

---

## Supported Browsers
- Modern browsers including Chrome, Firefox, Edge, and Safari are fully supported. 

Compy is a user-friendly, adaptable tool for saving and referencing data. You can test the application live here: [Compy](https://ajayparihar.github.io/Compy).