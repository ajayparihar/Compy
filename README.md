# Compy - Command and Data Manager

Compy is a web-based tool for managing and quickly accessing saved data like commands, credentials, and notes. It provides an intuitive interface with search, copy-to-clipboard, and theme customization features.

## Features

- **Dynamic Data Loading**: Load data from online or local CSV files
- **Interactive Search**: Live search with highlighted matches
- **Clipboard Integration**: One-click copy to clipboard
- **Password Masking**: Secure sensitive data with `##` markers
- **Theme Support**: Multiple dark and light themes
- **Responsive Design**: Works on all screen sizes

## Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ajayparihar/Compy.git
   cd Compy
   ```

2. **Set Up Your Data**
   - Place your CSV file in the project directory
   - Update `user_config.json` with your file path:
     ```json
     {
       "file_settings": {
         "file_path": "path/to/your/file.csv"
       }
     }
     ```

3. **Run the Application**
   - **Option 1**: Use VS Code Live Server
     - Right-click `index.html` → "Open with Live Server"
   - **Option 2**: Use the included batch file
     - Double-click `CompyRunner.bat`

4. **Customize Settings**
   - Change themes in `user_config.json`:
     ```json
     {
       "user_settings": {
         "display_theme": "root.d4"
       }
     }
     ```
   - Available themes: `d1` to `d10` (dark), `l1` to `l11` (light)

## CSV Format

Your CSV file should have two columns:
```
Command, Description
ls, List directory contents
git status, Show the working tree status
```

## Password Masking

Wrap sensitive data with `##` markers:
```
##password##, Database password
```

## Keyboard Shortcuts

- **Type anywhere**: Focus search input
- **Click header**: Refresh the page
- **Click item**: Copy to clipboard

## Troubleshooting

- **No data showing**: Check your CSV file path in `user_config.json`
- **Search not working**: Ensure CSV format is correct
- **Themes not applying**: Verify theme name in `user_config.json`

## Technologies Used

- HTML, CSS, JavaScript
- SheetJS for CSV parsing
- Modern Web APIs (Clipboard, Fetch)

## License

MIT License - Free for personal and commercial use
