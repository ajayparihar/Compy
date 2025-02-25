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
    cy.get('.command-item').each(($el) => {
      expect($el.text().toLowerCase()).to.include('git');
    });
    
    // Clear the search input
    cy.get('#search-input').clear();
    
    // Type a keyword that shouldn't match any entries
    cy.get('#search-input').type('xyznonexistentcommand');
    
    // Verify that no entries are displayed and "No results found" message appears
    cy.get('.command-item').should('have.length', 0);
    cy.contains('No results found').should('be.visible');
  });

  it('should respect debounce timing when searching', () => {
    const debounceTime = 150; // Match the debounce time from the application
    
    // Get initial count of items
    cy.get('.command-item').its('length').as('initialCount');
    
    // Type quickly and verify debounce
    cy.get('#search-input').type('git', { delay: 0 });
    
    // Check immediately - should still show all items due to debounce
    cy.get('@initialCount').then((initialCount) => {
      cy.get('.command-item').should('have.length', initialCount);
    });
    
    // Wait for debounce and verify filtered results
    cy.wait(debounceTime + 50);
    cy.get('.command-item').should('have.length.lessThan', '@initialCount');
    cy.get('.command-item').each(($el) => {
      expect($el.text().toLowerCase()).to.include('git');
    });
  });

  it('should support keyboard shortcuts for search', () => {
    // Test forward slash shortcut
    cy.get('body').type('/');
    cy.get('#search-input').should('be.focused');
    
    // Type some text
    cy.get('#search-input').type('test');
    
    // Test escape to clear
    cy.get('body').type('{esc}');
    cy.get('#search-input').should('have.value', '');
    
    // Verify search is cleared
    cy.get('@initialCount').then((initialCount) => {
      cy.get('.command-item').should('have.length', initialCount);
    });
  });
}); 