/**
 * Test Case ID: TC-008
 * Title: Verify User Configuration Settings
 * Description: Test that user settings in user_config.json are applied correctly
 */
describe('User Configuration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
  });
  
  it('should apply username from configuration', () => {
    // Visit with a test username parameter
    cy.visit('/?testUser=TestUser');
    
    // Wait for data to load
    cy.waitForDataLoad();
    
    // Verify the username is displayed correctly
    cy.get('#user-display')
      .should('be.visible')
      .should('contain', 'TestUser');
    
    // Verify username persists after refresh
    cy.reload();
    cy.waitForDataLoad();
    cy.get('#user-display').should('contain', 'TestUser');
  });

  it('should apply theme from configuration', () => {
    // Visit with a test theme parameter
    cy.visit('/?testTheme=d5');
    
    // Wait for data to load
    cy.waitForDataLoad();
    
    // Verify the theme is applied correctly
    cy.hasThemeClass('d5').should('be.true');
    
    // Verify theme persists in localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('selectedTheme')).to.equal('d5');
    });
  });

  it('should apply multiple configuration settings together', () => {
    // Visit with multiple test parameters
    cy.visit('/?testUser=ConfigTester&testTheme=l3');
    
    // Wait for data to load
    cy.waitForDataLoad();
    
    // Verify all settings are applied correctly
    cy.get('#user-display').should('contain', 'ConfigTester');
    cy.hasThemeClass('l3').should('be.true');
  });

  it('should handle invalid configuration gracefully', () => {
    // Visit with invalid theme
    cy.visit('/?testTheme=invalid');
    
    // Verify fallback to default theme
    cy.hasThemeClass('d4').should('be.true');
    
    // Check error message
    cy.get('.toast-notification')
      .should('be.visible')
      .should('contain', 'Invalid theme');
  });

  it('should respect user preferences over default settings', () => {
    // Set user preferences
    cy.window().then((win) => {
      win.localStorage.setItem('selectedTheme', 'l2');
    });
    
    // Visit with different default theme
    cy.visit('/?testTheme=d3');
    
    // Verify user preference is maintained
    cy.hasThemeClass('l2').should('be.true');
  });
});

/**
 * Test Case ID: TC-009
 * Title: Verify Custom Server Port
 * Description: Test that the application can run on a custom port specified in CompyRunner.bat
 */
describe('Server Port Configuration', () => {
  it('should be accessible on a custom port', () => {
    // Visit the app on the current port
    cy.visit('/');
    cy.waitForDataLoad();
    
    // Verify basic functionality works
    cy.get('#search-input').should('be.visible');
    cy.get('.command-item').should('have.length.greaterThan', 0);
    
    // Note: Testing different ports would require server restart
    cy.log('Note: Testing on custom ports requires manual verification');
  });
});

/**
 * Test Case ID: TC-010
 * Title: Verify Error Handling for Missing Data File
 * Description: Test that the application handles missing data file gracefully
 */
describe('Error Handling', () => {
  it('should display an error message when data file is missing', () => {
    // Visit with a parameter that simulates a missing file
    cy.visit('/?simulateError=missingFile');
    
    // Verify that an error message is displayed
    cy.get('.error-message')
      .should('be.visible')
      .should('contain', 'Could not load data file');
    
    // Verify that a retry button is available
    cy.get('#retry-button')
      .should('be.visible')
      .should('not.be.disabled');
  });

  it('should recover when data becomes available', () => {
    // Visit with a parameter that simulates a temporary error
    cy.visit('/?simulateError=temporaryError');
    
    // Verify that an error message is displayed
    cy.get('.error-message').should('be.visible');
    
    // Click the retry button
    cy.get('#retry-button').click();
    
    // Verify that the application recovers and loads data
    cy.waitForDataLoad();
    cy.get('.command-item').should('have.length.greaterThan', 0);
    
    // Verify error message is hidden
    cy.get('.error-message').should('not.exist');
  });

  it('should handle network timeouts', () => {
    // Visit with timeout simulation
    cy.visit('/?simulateError=timeout');
    
    // Verify timeout error message
    cy.get('.error-message')
      .should('be.visible')
      .should('contain', 'Request timed out');
    
    // Verify automatic retry after timeout
    cy.waitForDataLoad();
    cy.get('.command-item').should('have.length.greaterThan', 0);
  });

  it('should handle invalid JSON configuration', () => {
    // Visit with invalid config simulation
    cy.visit('/?simulateError=invalidConfig');
    
    // Verify fallback to default configuration
    cy.get('#user-display').should('contain', 'Guest');
    cy.hasThemeClass('d4').should('be.true');
    
    // Verify warning message
    cy.get('.toast-notification')
      .should('be.visible')
      .should('contain', 'Using default configuration');
  });
}); 