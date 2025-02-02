const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to update theme
app.put('/user_config.json', (req, res) => {
  const { theme } = req.body;

  // Read the current config
  const configPath = path.join(__dirname, 'user_config.json');
  fs.readFile(configPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading config file:', err);
      return res.status(500).send('Error reading config file');
    }

    // Update the theme in the config
    const config = JSON.parse(data);
    config.user_settings.theme = theme;

    // Write the updated config back to the file
    fs.writeFile(configPath, JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.error('Error writing config file:', err);
        return res.status(500).send('Error writing config file');
      }

      res.send('Theme updated successfully');
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 