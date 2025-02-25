/**
 * @fileoverview Command Management System - Server
 * @author Ajay Singh
 * @version 1.1
 * @created 11-09-2023
 * @updated 25-02-2025
 * 
 * This file implements the backend server for the Command Management System.
 * It provides endpoints for serving static files and managing user configuration,
 * particularly theme settings.
 * 
 * WARNING: This server is simple but effective. Don't be tempted to over-engineer it.
 * Future me: Remember when you tried to add that fancy caching layer and broke everything?
 * Yeah, let's not do that again. Keep it simple, stupid.
 */

// Import required modules
// Express for the web server framework, fs for file operations, path for file paths
const express = require("express");
const fs = require("fs");
const path = require("path");

/**
 * Initialize Express application
 * Express makes it easy to create a web server with minimal code.
 * It's like the Swiss Army knife of Node.js web frameworks.
 */
const app = express();
const PORT = 3000;

/**
 * Middleware Configuration
 * - JSON parsing for request bodies
 * - Static file serving from public directory
 * 
 * Think of middleware as bouncers at a club - they check and process
 * each request before it gets to the VIP area (our route handlers).
 */
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/**
 * PUT endpoint to update user theme configuration
 * @route PUT /user_config.json
 * @param {Object} req.body.theme - The theme configuration to update
 * @returns {string} Success or error message
 * 
 * This endpoint allows the client to save theme preferences.
 * It's a simple file read/write operation, but it makes the user experience
 * so much better by remembering their preferences.
 * 
 * Error handling is important here - we don't want to crash the server
 * just because someone's theme preference couldn't be saved.
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
    // Parse the JSON, modify it, then stringify it back
    const config = JSON.parse(data);
    config.user_settings.theme = theme;

    // Write updated configuration back to file
    // Pretty-print with 2 spaces for readability
    fs.writeFile(configPath, JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.error("Error writing config file:", err);
        return res.status(500).send("Error writing config file");
      }

      res.send("Theme updated successfully");
    });
  });
});

/**
 * Start the server and listen for incoming connections
 * This is where the magic happens - our server comes alive!
 * 
 * Port 3000 is the classic development port. It's like apartment 3000 -
 * every developer has lived there at some point.
 */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
