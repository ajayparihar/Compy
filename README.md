# Compy V1.1

[Compy](https://ajayparihar.github.io/Compy)

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

8. **Theme Support** **(New)**  
   Compy now supports multiple themes. You can choose from a variety of dark and light themes to customize the look and feel of the application.

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
   const response = await fetch("https://your-csv-file-link");
   ```
3. Replace the URL with the link to your CSV file.

#### Option 2: Using a Local CSV File

1. Place your CSV file in the project directory.
2. Update the `fetch` call in `script.js` to reference the local file, like this:
   ```javascript
   const response = await fetch("./path-to-your-file.csv");
   ```

### Update the Masking Keyword

To customize the password masking keyword (e.g., change `##` to `**`):

1. Open `script.js`.
2. Locate the `config` object:
   ```javascript
   const config = {
     passwordMaskingKeyword: "##", // Change this to '**' or any other keyword
   };
   ```
3. Update `passwordMaskingKeyword` to your preferred keyword, such as `**`.

### Update the Theme

To customize the theme:

1. Open `user_config.json`.
2. Locate the `display_theme` property:
   ```json
   "display_theme": "root.d4"
   ```
3. Update `display_theme` to your preferred theme. Available themes are listed below.

### Running the Local Server

You can run the local server using either VS Code Live Server or the provided batch file.

#### Method 1: Using VS Code Live Server

1. Open the project directory in VS Code.
2. Install the Live Server extension if you haven't already.
   - Go to the Extensions view by clicking the Extensions icon in the Activity Bar on the side of the window or by pressing `Ctrl+Shift+X`.
   - Search for "Live Server" and install it.
3. Right-click on `index.html` and select "Open with Live Server".
4. The application will open in your default browser at `http://localhost:5500`.

#### Method 2: Using the Batch File

1. Open `CompyRunner.bat` in a text editor.
2. Set the `HTML_DIRECTORY` variable to the path where your HTML files are located. Ensure this path is correct.
3. Optionally, set the `PORT` variable to your desired port number (default is 8000).
4. Save the changes and close the text editor.
5. Double-click `CompyRunner.bat` to start the local server and open the application in your default browser.

---

## Available Themes

### Dark Themes

1. **Mystic Forest**: `root.d1`
2. **Crimson Night**: `root.d2`
3. **Royal Elegance**: `root.d3`
4. **Galactic Blue**: `root.d4`
5. **Twilight Dream**: `root.d5`
6. **Deep Ocean**: `root.d6`
7. **Cyber Night**: `root.d7`
8. **Molten Core**: `root.d8`
9. **Neon Pulse**: `root.d9`
10. **Toxic Night**: `root.d10`

### Light Themes

1. **Sunrise**: `root.l1`
2. **Soft Glow**: `root.l2`
3. **Floral Breeze**: `root.l3`
4. **Ocean Breeze**: `root.l4`
5. **Golden Sands**: `root.l5`
6. **Mint Grove**: `root.l6`
7. **Sky Dusk**: `root.l7`
8. **Autumn Leaves**: `root.l8`
9. **Citrus Burst**: `root.l9`
10. **Rose Petal**: `root.l10`
11. **Lavender Mist**: `root.l11`

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

---

## Data Security Report

### Overview

This report evaluates the security of a local web application running on **VS Code Live Server**, processing local CSV data and ensuring sensitive information is masked.

### Code Security & Data Handling

- **Local Data Fetching**: The app fetches local CSV data, with no external network requests, ensuring no data leakage.
- **Password Masking**: Sensitive data is masked with a customizable keyword (e.g., `##Password##`), keeping original data secure in memory.
- **Clipboard Access**: Unmasked data is copied to the clipboard locally, with minimal risk of external access unless the machine is compromised.
- **XSS Protection**: Data is sourced locally (CSV file), minimizing XSS risk. Inputs should be sanitized for future external sources.

### Live Server Configuration

- **Local Hosting**: Runs locally on `localhost`, ensuring it’s inaccessible externally unless reconfigured.
- **Port Accessibility**: Live Server binds to local ports, minimizing external exposure.

### Recommendations

1. **Minimize Sensitive Data in DOM**: Use in-memory storage for unmasked data.
2. **Clipboard Access**: Limit clipboard access for sensitive data to reduce exposure risk.
3. **Ensure Local Hosting**: Verify **Live Server** is bound to `localhost` only.

### Conclusion

The app is secure for local use. With physical access control and best practices (e.g., limiting exposed data), security remains strong.
