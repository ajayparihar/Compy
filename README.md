# COMPY - Your Personal Data Assistant 🚀

<div align="center">
  <img src="favicon_io/favicon.ico" alt="COMPY Logo" width="100">
  <h3>Your Smart Digital Notebook for Everything Important</h3>
  <p><em>Store, search, and access your information with real-time filtering</em></p>
</div>

## 🎯 What is COMPY?

COMPY is a lightweight tool that helps you:
- Store and find commands, snippets, and notes with real-time search
- Protect sensitive information with automatic masking
- Access your data through a modern interface with 20+ themes
- Sync with Google Sheets for easy data management

## 🚀 Quick Start

1. **Prerequisites**
   - Node.js 12 or higher
   - Windows OS
   - Modern web browser (Chrome, Firefox, Edge)

2. **Installation**
   ```bash
   git clone https://github.com/ajayparihar/compy.git
   cd compy
   npm install
   npm start
   ```
   Access COMPY at `http://localhost:3000` 🎉

## 📝 Managing Your Data

### Data Storage Options
1. **Local CSV File**:
   Store your data in `comm.csv` with this format:
   ```csv
   command_or_text, description
   git reset --hard origin/main, Reset branch to remote main
   npm install, Install project dependencies
   ##apikey123##, Development API key (sensitive data masked)
   ```

2. **Google Sheets Integration**:
   - Publish your Google Sheet as CSV
   - Update the file path in `user_config.json`
   - Format follows the same structure as local CSV

### Adding New Entries
1. **Direct CSV Edit**:
   - Open `comm.csv` in any text editor
   - Add new lines: `command/text, description`
   - Save the file

2. **Best Practices**:
   - Keep related commands together
   - Use clear descriptions
   - Mask sensitive data with `##` (example: `##password123##`)
   - Keep a backup of your data

## 💡 Key Features

1. **Enhanced Search**
   - Type `/` to focus search
   - Real-time filtering with 150ms debounce
   - Click items to copy instantly
   - Search in both commands and descriptions
   - Keyboard navigation support

2. **Data Security**
   - Local storage only - your data stays with you
   - Automatic masking of sensitive data with `##`
   - Secure clipboard handling
   - HTTPS support for Google Sheets integration

3. **Rich Customization**
   - 21+ built-in themes (10 Dark + 11 Light variants)
   - Persistent theme settings
   - Custom user display name
   - Mobile-responsive design
   - Configure in `user_config.json`:
     ```json
     {
       "file_settings": {
         "file_path": "comm.csv"
       },
       "user_settings": {
         "user_name": "YourName"
       }
     }
     ```

## 🔑 Keyboard Shortcuts
- `/` - Focus search
- `Esc` - Clear search
- `Enter` - Copy selected item
- `↑/↓` - Navigate through items

## 🔧 Advanced Configuration

1. **Google Sheets Integration**
   ```javascript
   // Default Google Sheets URL in config.js
   const DEFAULT_FILE_PATH = "https://docs.google.com/spreadsheets/d/[YOUR-SHEET-ID]/pub?output=csv";
   ```

2. **Performance Optimizations**
   - Debounced search (150ms)
   - Optimized DOM operations
   - Lazy loading for large datasets
   - Mobile-optimized animations

## ❓ Troubleshooting

1. **Can't Start COMPY?**
   - Verify Node.js installation: `node --version`
   - Check if port 3000 is available
   - Ensure all dependencies are installed

2. **Data Not Showing?**
   - Verify `comm.csv` exists and is formatted correctly
   - Check file path in `user_config.json`
   - For Google Sheets, ensure the sheet is published and accessible
   - Ensure each line follows the format: `command/text, description`

3. **Search Not Working?**
   - Use `/` key to focus search
   - Check if your search term matches any command or description
   - Clear search with `Esc` key
   - Try refreshing the page

Need more help? Check the [Issues](https://github.com/ajayparihar/compy/issues) section.

---

<div align="center">
  <p>Made with ❤️ by Ajay Singh</p>
  <p>© 2024 COMPY | MIT License</p>
</div>
