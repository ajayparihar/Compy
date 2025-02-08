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

## Getting Started

1. Download and extract COMPY to your preferred location
2. Double-click `CompyRunner.bat` to start
3. The application will open in your default browser
4. Start adding your data or import existing CSV files

## How to Use COMPY

### Adding Your Data
1. Open your data file (default: `comm.csv`)
2. Add entries in this format:
   ```
   Command/Text,Description
   git status,Check git repository status
   ##mypassword##,Login for example.com
   ```
   - Use `##` to mask sensitive information
   - Keep descriptions clear and searchable

### Daily Usage
1. Launch COMPY using `CompyRunner.bat`
2. Type in the search bar to find entries
3. Click any item to copy it instantly
4. Use keyboard shortcuts for faster navigation:
   - `↑`/`↓`: Navigate items
   - `Enter`: Copy selected item
   - `Esc`: Clear search
   - `Ctrl + L`: Focus search bar

## Customization Guide

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
    "user_name": "",         // Your name (optional)
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
   - Check if port 3000 is available
   - Run `npm install` in the application directory

2. **Data not showing**
   - Verify `comm.csv` exists and has correct format
   - Check file path in `user_config.json`

3. **Theme not applying**
   - Clear browser cache
   - Verify theme name in `user_config.json`

## Need Help?

- Check the [Issues](https://github.com/your-repo/compy/issues) section
- Create a new issue for bug reports
- Join our community discussions

## License

MIT License - See [LICENSE](LICENSE) for details.

---
Made with ❤️ for productivity enthusiasts
