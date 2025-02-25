# COMPY - Your Personal Data Assistant

<div align="center">
  <img src="favicon_io/favicon.ico" alt="COMPY Logo" width="100">
  <p><em>Securely store and instantly access your important information</em></p>
</div>

## 📋 Overview

COMPY is a lightweight, secure personal data assistant designed to help you store and quickly access frequently used information. Whether you need to remember terminal commands, store credentials securely, save code snippets, or manage any text-based information, COMPY provides a streamlined solution with powerful search capabilities.

## ✨ Key Features

- **🔒 Enhanced Security**: Sensitive data is masked and protected to maintain your privacy
- **⚡ Lightning-Fast Search**: Find what you need instantly with real-time filtering
- **🎨 Customizable Themes**: Multiple themes to match your preferences and reduce eye strain
- **📱 Cross-Platform**: Works seamlessly on desktop and mobile browsers
- **📋 One-Click Copy**: Copy any entry to your clipboard with a single click
- **🔧 Highly Adaptable**: Fully customizable to fit your unique workflow

## 🚀 Getting Started

### Prerequisites

- Node.js (version 12 or higher)
- A modern web browser (Chrome, Firefox, Edge, etc.)
- Windows operating system

### Installation

1. **Clone or Download**:
   ```bash
   git clone https://github.com/your-username/compy.git
   # or download and extract the ZIP file
   ```

2. **Navigate to the Directory**:
   ```bash
   cd compy
   ```

3. **Configure CompyRunner.bat** (Optional):
   - Open `CompyRunner.bat` in a text editor
   - Modify the `HTML_DIRECTORY` path if needed
   - Change the `PORT` if port 8000 is already in use

4. **Launch the Application**:
   - Double-click `CompyRunner.bat`
   - COMPY will open in your default web browser

## 📝 Usage Guide

### Managing Your Data

1. **Data File Structure**:
   - Open `comm.csv` (or your configured data file)
   - Format your entries as follows:
     ```
     Command/Text,Description
     git status,Check git repository status
     ##mypassword##,Login for example.com
     ```

2. **Best Practices**:
   - Use `##` to mask sensitive information
   - Create clear, searchable descriptions
   - Group similar commands together
   - Add tags in descriptions for better searchability
   - Maintain consistent formatting for similar entries

### Daily Usage

1. **Launch**: Start COMPY using `CompyRunner.bat`
2. **Search**: Type in the search bar to filter entries
3. **Copy**: Click any item to copy it to your clipboard
4. **Categories**: Use the category filters to narrow down results

## ⚙️ Customization

### CompyRunner Configuration

```batch
@echo off
set HTML_DIRECTORY=C:\path\to\your\compy
set PORT=8000
```

### Theme Selection

COMPY offers multiple themes to suit different preferences:
- Click the theme icon in the top-right corner
- Choose from light, dark, and custom color schemes
- Your selection is automatically saved for future sessions

### User Configuration

Edit `user_config.json` to personalize your experience:

```json
{
  "file_settings": {
    "file_path": "comm.csv"
  },
  "user_settings": {
    "user_name": "YourName",
    "theme": "d4"
  }
}
```

## 🔧 Technical Details

### Architecture

- **Frontend**: HTML5, CSS3, and Vanilla JavaScript
- **Backend**: Node.js local server
- **Data Storage**: CSV format for simplicity and portability
- **Security**: Client-side data masking for sensitive information

### File Structure

- `index.html` - Main application interface
- `script.js` - Core application logic
- `styles.css` - Main styling
- `themes.css` - Theme definitions
- `toast.css` - Notification styling
- `server.js` - Local Node.js server
- `config.js` - Configuration handling
- `CompyRunner.bat` - Windows launcher
- `user_config.json` - User preferences
- `comm.csv` - Data storage

## 🔄 Updating

To update while preserving your personal data:

```bash
git pull origin main
```

Your personal files (`user_config.json`, `comm.csv`, and custom configurations) will remain unchanged.

## ❓ Troubleshooting

### Common Issues

1. **Application Won't Start**
   - Ensure Node.js is properly installed
   - Check if port 8000 (or your configured port) is available
   - Verify the path in `CompyRunner.bat` is correct

2. **Data Not Displaying**
   - Confirm `comm.csv` exists and has the correct format
   - Check the file path in `user_config.json`
   - Ensure the file has proper read permissions

3. **Theme Not Applying**
   - Clear your browser cache
   - Verify the theme name in `user_config.json`
   - Restart the application

4. **Copy Function Not Working**
   - Allow clipboard access in your browser
   - Try using keyboard shortcuts (Ctrl+C) as an alternative

## 📱 Mobile Usage

COMPY is designed to work on mobile devices:
- Access via your mobile browser
- Bookmark for quick access
- Responsive design adapts to your screen size

## 🤝 Contributing

Contributions are welcome! If you'd like to improve COMPY:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ for productivity enthusiasts</p>
  <p>© 2023 COMPY Team</p>
</div>
