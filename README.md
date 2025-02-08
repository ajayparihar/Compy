# COMPY - Your Personal Data Assistant

![COMPY Logo](favicon_io/favicon.ico)

## What is COMPY?

COMPY is your personal data assistant that helps you securely store and quickly access:
- Commands you frequently use but often forget
- Sensitive credentials that need secure storage
- Commonly used text snippets and templates
- Any text-based information you need quick access to

## Why Use COMPY?

- 🔒 **Security First**: Your sensitive data is masked and secure
- ⚡ **Lightning Fast**: Instant search across all your entries
- 🎨 **Personalized Experience**: Choose from 21 beautiful themes
- 📱 **Use Anywhere**: Works on desktop and mobile browsers
- 🔄 **Quick Copy**: One-click to clipboard
- ⚙️ **Fully Customizable**: Adapt it to your workflow

## Prerequisites

- Node.js (version 12 or higher)
- Modern web browser (Chrome, Firefox, Edge recommended)
- Windows operating system

## Getting Started

1. Download and extract COMPY to your preferred location
2. Configure `CompyRunner.bat` if needed (see Customizing CompyRunner section)
3. Double-click `CompyRunner.bat` to start
4. The application will open in your default browser
5. Start adding your data or import existing CSV files

## How to Use COMPY

### Adding Your Data
1. Open your data file (default: `comm.csv`)
2. Add entries in this format:
   ```
   Command/Text,Description
   git status,Check git repository status
   ##mypassword##,Login for example.com
   ```
   Tips for better organization:
   - Use `##` to mask sensitive information
   - Keep descriptions clear and searchable
   - Group similar commands together
   - Add tags in description for easier searching
   - Use consistent formatting for similar entries

### Daily Usage
1. Launch COMPY using `CompyRunner.bat`
2. Type in the search bar to find entries
3. Click any item to copy it instantly

## Customization Guide

### CompyRunner Settings
The `CompyRunner.bat` file can be customized to match your setup:

1. Open `CompyRunner.bat` in any text editor
2. Modify these variables at the top of the file:
   ```batch
   :: HTML files location (where COMPY is installed)
   set "HTML_DIRECTORY=C:\Users\username\path\to\compy"

   :: Server port number (if 8000 is already in use)
   set "PORT=8000"
   ```
3. Common customizations:
   - Change `HTML_DIRECTORY` to your COMPY installation path
   - Modify `PORT` if port 8000 is already in use
   - Save changes and run CompyRunner as usual

Note: If you change the port, remember to access COMPY using the new port number in your browser (e.g., `http://localhost:9000` if you set PORT=9000)

### Theme Selection
1. Click the theme icon in the top-right corner
2. Choose from:
   - 10 Dark themes (d1-d10)
   - 11 Light themes (l1-l11)
   - Popular choices:
     - Galactic Blue (d4) - Dark modern
     - Sunrise (l1) - Light professional
     - Cyber Night (d7) - High contrast
     - Lavender Mist (l11) - Soft light

### Configuration Settings
Edit `user_config.json` to personalize:
```json
{
  "file_settings": {
    "file_path": "comm.csv"  // Your data file location
  },
  "user_settings": {
    "user_name": "",         // Your name
    "theme": "d4"           // Your preferred theme
  }
}
```

## Technology Stack
- Frontend: HTML5, CSS3, JavaScript (Vanilla)
- Backend: Node.js
- Data Storage: CSV format
- Security: Client-side password masking
- Server: Local Node.js server

## Updating COMPY

To update to the latest version while keeping your personal data:

```bash
git pull https://github.com/your-repo/compy.git main --no-rebase
```

Your personal files (`user_config.json`, `comm.csv`, and custom configurations) will remain unchanged.

## Troubleshooting

1. **Application won't start**
   - Ensure Node.js is installed
   - Check if port 8000 is available
   - Run `npm install` in the application directory
   - Verify HTML_DIRECTORY path in CompyRunner.bat

2. **Data not showing**
   - Verify `comm.csv` exists and has correct format
   - Check file path in `user_config.json`
   - Ensure file has read permissions

3. **Theme not applying**
   - Clear browser cache
   - Verify theme name in `user_config.json`

4. **Copy not working**
   - Allow clipboard access in browser
   - Try using keyboard shortcut (Enter)

## License

MIT License - See [LICENSE](LICENSE) for details.

---
Made with ❤️ for productivity enthusiasts
