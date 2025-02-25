/**
 * Test Case ID: TC-004
 * Title: Verify Theme Switching Functionality
 * Description: Test that users can switch between different themes and the selection persists
 */
describe('Theme Switching', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
    
    // Visit the application
    cy.visit('/');
    // Wait for data to load
    cy.waitForDataLoad();
  });

  it('should allow switching between themes', () => {
    // Click on the theme icon
    cy.get('#theme-toggle').click();
    
    // Theme selection menu should appear
    cy.get('.theme-menu').should('be.visible');
    
    // Select a different theme (e.g., d2 - Crimson Night)
    cy.get('.theme-option[data-theme="d2"]').click();
    
    // Verify the theme is applied
    cy.hasThemeClass('d2').should('be.true');
    
    // Theme menu should close
    cy.get('.theme-menu').should('not.exist');
  });

  it('should persist theme selection after page refresh', () => {
    // Select a specific theme
    cy.get('#theme-toggle').click();
    cy.get('.theme-option[data-theme="d3"]').click();
    
    // Verify the theme is applied
    cy.hasThemeClass('d3').should('be.true');
    
    // Refresh the page
    cy.reload();
    
    // Wait for data to load after refresh
    cy.waitForDataLoad();
    
    // Verify the theme is still applied
    cy.hasThemeClass('d3').should('be.true');
  });

  it('should store theme preference in localStorage', () => {
    // Select a specific theme
    cy.get('#theme-toggle').click();
    cy.get('.theme-option[data-theme="l1"]').click();
    
    // Verify localStorage has the theme setting
    cy.window().then((win) => {
      expect(win.localStorage.getItem('selectedTheme')).to.eq('l1');
    });
  });
});

/**
 * Test Case ID: TC-005
 * Title: Verify Mobile Responsiveness
 * Description: Test that the interface adapts properly to mobile screen sizes
 */
describe('Mobile Responsiveness', () => {
  const mobileViewport = {
    width: 375,
    height: 667
  };
  
  beforeEach(() => {
    // Visit the application with mobile viewport
    cy.viewport(mobileViewport.width, mobileViewport.height);
    cy.visit('/');
    // Wait for data to load
    cy.waitForDataLoad();
  });

  it('should display properly on mobile screen size', () => {
    // Verify the search bar is visible and properly sized
    cy.get('#search-input')
      .should('be.visible')
      .invoke('outerWidth')
      .should('be.lte', mobileViewport.width);
    
    // Verify command items are visible and properly sized
    cy.get('.command-item')
      .should('be.visible')
      .invoke('outerWidth')
      .should('be.lte', mobileViewport.width);
  });

  it('should have functional search on mobile', () => {
    // Test search functionality
    cy.get('#search-input').type('git');
    cy.get('.command-item').should('have.length.greaterThan', 0);
  });

  it('should have functional copy on mobile', () => {
    // Stub clipboard API
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').resolves();
    });
    
    // Test copy functionality
    cy.get('.command-item').first().click();
    cy.window().its('navigator.clipboard.writeText').should('be.called');
    cy.get('.toast-notification').should('be.visible');
  });

  it('should have accessible theme switching on mobile', () => {
    // Verify theme toggle is accessible
    cy.get('#theme-toggle').should('be.visible').click();
    cy.get('.theme-menu').should('be.visible');
    
    // Theme options should be properly sized for mobile
    cy.get('.theme-option')
      .should('be.visible')
      .invoke('outerWidth')
      .should('be.lte', mobileViewport.width);
  });
}); 