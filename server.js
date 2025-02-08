/**
 * @fileoverview Command Management System - Server
 * @author Ajay Singh
 * @version 1.1
 * @created 11-09-2023
 * @updated 19-03-2024
 * 
 * This file implements the backend server for the Command Management System.
 * It provides endpoints for serving static files and managing user configuration,
 * particularly theme settings.
 */

const express = require("express");
const fs = require("fs");
const path = require("path");

// Initialize Express application
const app = express();
const PORT = 3000;

/**
 * Middleware Configuration
 * - JSON parsing for request bodies
 * - Static file serving from public directory
 */
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/**
 * PUT endpoint to update user theme configuration
 * @route PUT /user_config.json
 * @param {Object} req.body.theme - The theme configuration to update
 * @returns {string} Success or error message
 */
app.put("/user_config.json", (req, res) => {
  const { theme } = req.body;

  const configPath = path.join(__dirname, "user_config.json");
  fs.readFile(configPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading config file:", err);
      return res.status(500).send("Error reading config file");
    }

    // Update theme in configuration
    const config = JSON.parse(data);
    config.user_settings.theme = theme;

    // Write updated configuration back to file
    fs.writeFile(configPath, JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.error("Error writing config file:", err);
        return res.status(500).send("Error writing config file");
      }

      res.send("Theme updated successfully");
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
