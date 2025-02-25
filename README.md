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

### CSV File Structure
Your data is stored in `comm.csv` with a simple format:
```csv
command_or_text, description
git reset --hard origin/main, Reset branch to remote main
npm install, Install project dependencies
##apikey123##, Development API key (sensitive data masked)
```

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

1. **Smart Search**
   - Type `/` to focus search
   - Real-time filtering with 150ms debounce
   - Click items to copy instantly
   - Search in both commands and descriptions

2. **Data Security**
   - Local storage only - your data stays with you
   - Automatic masking of sensitive data with `##`
   - Secure clipboard handling

3. **Rich Customization**
   - 20+ built-in themes (10 Dark + 11 Light variants)
   - Persistent theme settings
   - Custom user display name
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

## ❓ Troubleshooting

1. **Can't Start COMPY?**
   - Verify Node.js installation: `node --version`
   - Check if port 3000 is available
   - Ensure all dependencies are installed

2. **Data Not Showing?**
   - Verify `comm.csv` exists and is formatted correctly
   - Check file path in `user_config.json`
   - Ensure each line follows the format: `command/text, description`

3. **Search Not Working?**
   - Use `/` key to focus search
   - Check if your search term matches any command or description
   - Clear search with `Esc` key

Need more help? Check the [Issues](https://github.com/ajayparihar/compy/issues) section.

---

<div align="center">
  <p>Made with ❤️ by Ajay Singh</p>
  <p>© 2024 COMPY | MIT License</p>
</div>
