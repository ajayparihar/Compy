const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'test/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'test/cypress/support/e2e.js',
  },
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false,
  screenshotOnRunFailure: true,
}); 