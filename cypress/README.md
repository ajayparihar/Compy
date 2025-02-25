# COMPY Testing Framework

This directory contains automated tests for the COMPY application using Cypress.

## Test Structure

The tests are organized based on the test cases defined in `test_cases.md`:

- `cypress/e2e/search.cy.js` - Tests for search functionality (TC-001)
- `cypress/e2e/clipboard.cy.js` - Tests for clipboard functionality (TC-002)
- `cypress/e2e/security.cy.js` - Tests for sensitive data masking (TC-003)
- `cypress/e2e/ui.cy.js` - Tests for UI features like theme switching and mobile responsiveness (TC-004, TC-005)
- `cypress/e2e/data.cy.js` - Tests for data loading and custom file paths (TC-006, TC-007)
- `cypress/e2e/config.cy.js` - Tests for configuration and error handling (TC-008, TC-009, TC-010)

## Running Tests

### Prerequisites

1. Make sure Node.js is installed
2. Ensure the COMPY application is running on port 8000 (default)

### Commands

- Run all tests in headless mode:
  ```
  npm test
  ```

- Open Cypress Test Runner for interactive testing:
  ```
  npm run test:open
  ```

## Test Data

- `cypress/fixtures/test_data.csv` - Sample data file used for testing custom file paths

## Custom Commands

The following custom commands are available:

- `cy.isMasked()` - Check if an element contains masked data
- `cy.hasThemeClass(themeClass)` - Verify if a specific theme class is applied
- `cy.waitForDataLoad()` - Wait for data to be loaded in the UI

## Notes on Test Implementation

Some tests require special handling:

1. **Server Port Tests (TC-009)** - These tests are placeholders as they require manual verification
2. **Custom File Path Tests (TC-007)** - These tests assume the application can load a test file via URL parameters
3. **Error Handling Tests (TC-010)** - These tests use URL parameters to simulate error conditions

## Extending the Tests

To add new tests:

1. Create a new test file in `cypress/e2e/`
2. Follow the existing patterns for test structure
3. Use the custom commands where appropriate
4. Add any new fixtures to `cypress/fixtures/` 