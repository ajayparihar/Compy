/**
 * @fileoverview Command Management System - Server
 * @author Ajay Singh
 * @version 1.2
 * @created 11-09-2023
 * @updated 25-03-2024
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
app.use(express.static(path.join(__dirname)));  // Serve files from the root directory

/**
 * Updates user theme configuration
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
  try {
    fs.writeFileSync("user_config.json", JSON.stringify(req.body, null, 2));
    res.send("Configuration updated successfully");
  } catch (error) {
    console.error("Error updating configuration:", error);
    res.status(500).send("Error updating configuration");
  }
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
