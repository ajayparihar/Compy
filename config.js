// config.js

const DEFAULT_FILE_PATH =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTpgO5dkZtima-Pn9QPveTMsANWp-oMYBwNAc2xU0n-MsMiJKMSFqUP42xWOBZYQiUAoQsbnIysArka/pub?output=csv";

// Fetch user configuration
fetch("user_config.json")
  .then((response) => response.json())
  .then((config) => {
    const filePath = config.file_settings?.file_path || DEFAULT_FILE_PATH;
    const userName = config.user_settings?.user_name || "";
    const displayTheme = config.user_settings?.display_theme || "root";

    // Apply user name and theme
    applyUserName(userName);
    applyTheme(displayTheme);

    // Load the specified file
    loadFile(filePath);
  })
  .catch((error) => console.error("Error loading user configuration:", error));

// Function to load the specified file
const loadFile = (filePath) => {
  fetch(filePath)
    .then((response) => response.text())
    .then((data) => {
      console.log("File loaded successfully:", data);
      // Process the loaded data as needed
    })
    .catch((error) => console.error("Error loading file:", error));
};

// Function to apply user name
const applyUserName = (userName) => {
  const pageTitle = document.getElementById("pageTitle");
  if (pageTitle) {
    pageTitle.textContent = userName ? `${userName}'s COMPY` : "COMPY";
  }
};

// Function to apply theme
const applyTheme = (theme) => {
  // Remove the 'root.' part from the theme name if it exists
  const themeClass = theme.startsWith("root.") ? theme.substring(5) : theme;

  // Remove any existing theme class from <html>
  document.documentElement.className =
    document.documentElement.className.replace(
      /(?:dark|light)-\S+/g,
      "" // This regex matches the theme classes (e.g., dark-ocean_vibes, light-blue_horizon)
    );

  // Add the correct theme class
  document.documentElement.classList.add(themeClass);
};
