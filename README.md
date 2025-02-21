# COMPY - Your Personal Data Assistant

![COMPY Logo](favicon_io/favicon.ico)

## Overview

Welcome to COMPY, your personal data assistant designed to help you securely store and quickly access a wide range of information. Whether it's commands you frequently use, sensitive credentials, common text snippets, or any other text-based information, COMPY has got you covered.

## Key Features

- **Security**: Your data is masked and secure, ensuring your privacy is maintained at all times.
- **Speed**: Instant search capabilities allow you to find entries lightning fast.
- **Local Storage**: All data is stored securely in your browser's local storage.
- **CSV Import**: Easily import your existing CSV data with drag & drop support.
- **Rich Data**: Support for categories, tags, and sensitive data masking.
- **Customization**: Choose from a variety of themes to suit your preferences and workflow.
- **Portability**: Works seamlessly on both desktop and mobile browsers.
- **Quick Copy**: One-click access to copy data directly to your clipboard.
- **Flexibility**: Fully customizable to adapt to your unique needs.

## Getting Started

### Prerequisites

Before you begin, ensure that you have the following installed:

- A modern web browser like Chrome, Firefox, or Edge.
- Windows operating system (compatibility note).

### Installation and Setup

1. **Download and Extract**: Download COMPY from the repository and extract it to your preferred location.
2. **Configure `CompyRunner.bat`**: If needed, configure this batch file to suit your setup. This is optional but recommended for a smoother experience.
3. **Run the Application**: Double-click `CompyRunner.bat` to start COMPY. The application will open in your default browser.
4. **Add Your Data**: Start adding entries directly through the UI or import existing CSV files.

## Usage Guide

### Adding Your Data

There are two ways to add data to COMPY:

1. **Using the Add Entry Form**:
   - Click the "+" button in the bottom right corner
   - Fill in the command/text and description (required fields)
   - Optionally add a category and tags
   - Check "Mask as sensitive data" for passwords or sensitive information
   - Click Save to add the entry

2. **Importing from CSV**:
   - Click the "Import" button in the header
   - Drag & drop your CSV file or click to choose file
   - Review the preview of entries to be imported
   - Click Import to add the entries
   - Note: CSV should have the format:
     ```
     Command/Text,Description
     git status,Check git repository status
     ##mypassword##,Login for example.com
     ```
   - Entries with `##` around them will be automatically marked as sensitive

### Daily Usage

1. Launch COMPY using `CompyRunner.bat`.
2. Type your query into the search bar to find relevant entries.
3. Click any item to copy it directly to your clipboard.
4. For sensitive data:
   - Click to reveal the masked content
   - Content will be automatically hidden after 2 seconds
   - Click the copy button to copy without revealing

### Data Storage

COMPY now uses your browser's local storage to securely store your data. This means:
- No files are created on your system
- Data persists between sessions
- Data is isolated to the browser you're using
- Easy to clear data if needed (just clear browser data)

## Customization Guide

### CompyRunner Settings

Modify `CompyRunner.bat` if needed:

- Change `HTML_DIRECTORY` to match your COMPY installation path.
- Adjust the `PORT` number if port 8000 is already in use.

### Theme Selection

1. Click the theme icon in the top-right corner of the application.
2. Select from a variety of themes, including dark and light options. Choose your preferred theme to enhance your user experience.

### Configuration Settings

Edit `user_config.json` to personalize settings:

```json
{
  "file_settings": {
    "file_path": "comm.csv"
  },
  "user_settings": {
    "user_name": "",
    "theme": "d4"
  }
}
```

## Technology Stack

- **Frontend**: HTML5, CSS3, and JavaScript (Vanilla).
- **Backend**: Node.js.
- **Data Storage**: CSV format.
- **Security**: Client-side password masking.
- **Server**: Local Node.js server.

## Updating COMPY

To update to the latest version while preserving your personal data:

```bash
git pull https://github.com/your-repo/compy.git main --no-rebase
```

This command ensures that your personal files (`user_config.json`, `comm.csv`, and custom configurations) remain unchanged.

## Troubleshooting

### Common Issues and Solutions

1. **Application won't start**: Ensure Node.js is installed, check port availability, run `npm install` in the application directory, and verify the `HTML_DIRECTORY` path in `CompyRunner.bat`.
2. **Data not showing**: Verify that `comm.csv` exists and has the correct format, check file path in `user_config.json`, and ensure the file has read permissions.
3. **Theme not applying**: Clear browser cache and verify theme name in `user_config.json`.
4. **Copy not working**: Allow clipboard access in your browser or use the keyboard shortcut for copying.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ for productivity enthusiasts.
