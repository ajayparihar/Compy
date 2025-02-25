# COMPY - Your Personal Data Assistant 🚀

<div align="center">
  <img src="favicon_io/favicon.ico" alt="COMPY Logo" width="100">
  <h3>Your Smart Digital Notebook for Everything Important</h3>
  <p><em>Never forget a command, snippet, or important piece of information again!</em></p>
  <p>Version 1.1 | Updated: February 2024</p>
</div>

## 🎯 What is COMPY?

COMPY is your personal digital assistant that helps you:
- 📝 Store and organize frequently used commands, snippets, and notes
- 🔍 Find information instantly with powerful search
- 🔐 Keep sensitive information secure with built-in masking
- 🎨 Work comfortably with 10+ customizable themes
- 📱 Access your data anywhere through your browser

Perfect for:
- Developers storing commonly used commands
- IT professionals managing configuration snippets
- Anyone who needs quick access to frequently used information

## 🚀 Quick Start (2 minutes!)

1. **Get COMPY Running**
   ```bash
   # Clone the repository
   git clone https://github.com/ajayparihar/compy.git
   cd compy

   # Install dependencies
   npm install

   # Start COMPY
   npm start
   ```
   COMPY will open in your default browser at `http://localhost:3000` 🎉

2. **Start Using COMPY**
   - Type `/` anywhere to focus the search bar
   - Click any item to copy it instantly
   - Use categories to organize your data

## 💡 Examples of What You Can Store

```csv
# Terminal Commands
git reset --hard origin/main, Reset branch to remote main
docker ps, List running containers
npm run dev, Start development server

# Code Snippets
console.log('Hello World'), Basic JavaScript console log
SELECT * FROM users, Basic SQL query
for i in range(10):, Python for loop

# Masked Sensitive Data
##myAPIkey123##, Development API key
##dbpass123##, Database password
```

## ✨ Core Features

### 1. 🔍 Smart Search
- Real-time filtering with 150ms debounce
- Search through commands and descriptions
- Keyboard shortcuts for power users
- Clear search with Esc key

### 2. 🔒 Security First
- Sensitive data is automatically masked with `##`
- Local storage only - your data stays with you
- No external dependencies or cloud sync
- Client-side data masking for privacy

### 3. 🎨 Personalization
- 10+ built-in themes (Light/Dark variants)
- Persistent theme settings
- Custom user display name
- Responsive design for all devices

### 4. 📱 Cross-Platform
- Works on any modern browser
- Responsive design for mobile devices
- Consistent experience across platforms
- Touch-friendly interface

## 🛠️ Setup & Configuration

### System Requirements
- Node.js 12 or higher
- Modern web browser (Chrome, Firefox, Edge)
- Windows OS

### Basic Configuration
1. Open `user_config.json`:
   ```json
   {
     "file_settings": {
       "file_path": "comm.csv"  // Local file or Google Sheets CSV URL
     },
     "user_settings": {
       "user_name": "YourName",
       "theme": "light"         // light, dark, or custom themes
     }
   }
   ```

2. Data Sources:
   - Local CSV file (default: `comm.csv`)
   - Google Sheets published as CSV
   - Custom file path via URL parameter

## 📖 Tips & Tricks

1. **Keyboard Shortcuts**
   - `/` to focus search
   - `Esc` to clear search
   - `Enter` to copy selected item
   - Click page title to refresh data

2. **Best Practices**
   - Use `##` to mask sensitive information
   - Add tags in descriptions for better searchability
   - Group related items together
   - Regular backups of your `comm.csv`

3. **Mobile Usage**
   - Bookmark for quick access
   - Works offline (after initial load)
   - Touch-optimized interface

## 🧪 Testing

Run the test suite:
```bash
# Run tests in headless mode
npm test

# Open Cypress test runner
npm run test:open
```

## ❓ Need Help?

### Common Questions

1. **COMPY won't start?**
   - Check if Node.js is installed (`node --version`)
   - Ensure port 3000 is free
   - Verify file paths in configuration

2. **Can't find your data?**
   - Check if `comm.csv` exists
   - Verify file path in `user_config.json`
   - Make sure file format is correct

3. **Copy not working?**
   - Allow clipboard permissions in browser
   - Try the keyboard shortcut (Ctrl+C)

### Still stuck? 
- Check the [Issues](https://github.com/ajayparihar/compy/issues) section
- Create a new issue with details about your problem

## 🤝 Want to Contribute?

We love contributions! Here's how:
1. Fork the repository
2. Create your feature branch
3. Make your improvements
4. Submit a pull request

## 📄 License

MIT License - Feel free to use and modify!

---

<div align="center">
  <p>Made with ❤️ by the COMPY Team</p>
  <p>© 2024 COMPY - Making productivity personal</p>
  <p><small>Created by Ajay Singh | Version 1.1</small></p>
</div>
