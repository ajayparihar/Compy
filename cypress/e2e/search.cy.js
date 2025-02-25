/**
 * Test Case ID: TC-001
 * Title: Verify Real-time Search Functionality
 * Description: Test that the search feature filters entries in real-time as the user types
 */
describe('Search Functionality', () => {
  beforeEach(() => {
    // Visit the application
    cy.visit('/');
    // Wait for data to load
    cy.waitForDataLoad();
  });

  it('should filter entries in real-time as user types', () => {
    // Get the search input
    cy.get('#search-input')
      .should('be.visible')
      .click()
      .should('be.focused');

    // Type a keyword that should match at least one entry
    cy.get('#search-input').type('git');

    // Verify that entries are filtered
    cy.get('.command-item').should('have.length.greaterThan', 0);
    
    // Clear the search input
    cy.get('#search-input').clear();
    
    // Type a keyword that shouldn't match any entries
    cy.get('#search-input').type('xyznonexistentcommand');
    
    // Verify that no entries are displayed and "No results found" message appears
    cy.get('.command-item').should('have.length', 0);
    cy.contains('No results found').should('be.visible');
  });

  it('should update results immediately on each keystroke', () => {
    // Get the search input
    cy.get('#search-input').click();
    
    // Type one character at a time and verify filtering happens on each keystroke
    const searchTerm = 'git';
    
    // Type first character
    cy.get('#search-input').type(searchTerm[0]);
    cy.get('.command-item').should('have.length.greaterThan', 0);
    
    // Type second character
    cy.get('#search-input').type(searchTerm[1]);
    cy.get('.command-item').should('have.length.greaterThan', 0);
    
    // Type third character
    cy.get('#search-input').type(searchTerm[2]);
    cy.get('.command-item').should('have.length.greaterThan', 0);
  });
}); 