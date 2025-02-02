# COMPY - Secure Data Manager

![COMPY Logo](favicon_io/apple-touch-icon.png)

## Overview
COMPY is a secure, cross-platform tool for managing and quickly accessing various types of text-based data, including:
- Command-line commands
- Personal credentials
- Frequently used phrases
- Sentence templates

## Key Features
- **Secure Storage**: Password masking for sensitive data
- **Instant Search**: Real-time search across all entries
- **Multi-Purpose**: Manage commands, credentials, and templates
- **Clipboard Integration**: One-click copy to clipboard
- **Customizable**: Multiple light and dark themes
- **Responsive**: Optimized for desktop and mobile

## Quick Start
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/compy.git
   cd compy
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```

## Data Types
- **Technical Commands**: Store and access command-line operations
- **Sensitive Information**: Securely manage login credentials and API keys
- **Common Phrases**: Save frequently used text snippets
- **Message Templates**: Maintain reusable email and document templates

## How to Use
1. **Add Data**:
   - Open your data CSV file
   - Add entries in the format: `Entry,Description`
   - Wrap sensitive data with `##` (e.g., `##password##`)

2. **Search & Access**:
   - Launch COMPY in your browser
   - Use the search bar to find entries
   - Click any item to copy it to your clipboard

3. **Customize**:
   - Change themes via the theme selector
   - Modify settings in `user_config.json`

## Configuration
Edit `user_config.json` to customize:
```json
{
  "file_settings": {
    "file_path": "data.csv"
  },
  "user_settings": {
    "user_name": "",
    "theme": "d4"
  }
}
```

## Themes
Choose from 10 dark and 11 light themes, including:
- Galactic Blue (d4)
- Sunrise (l1)
- Cyber Night (d7)
- Lavender Mist (l11)

## Contributing
We welcome contributions! Please follow our [contribution guidelines](CONTRIBUTING.md).

## License
MIT License - See [LICENSE](LICENSE) for details.

---

**Version**: 1.1.1  
**Maintainer**: Bheb Developer 
