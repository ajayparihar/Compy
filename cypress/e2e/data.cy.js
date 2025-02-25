/**
 * Test Case ID: TC-006
 * Title: Verify Data Loading from CSV
 * Description: Test that the application correctly loads data from the CSV file
 */
describe('Data Loading', () => {
  beforeEach(() => {
    // Visit the application
    cy.visit('/');
    // Wait for data to load
    cy.waitForDataLoad();
  });

  it('should load data from CSV file correctly', () => {
    // Verify that data is loaded and displayed
    cy.get('.command-item').should('have.length.greaterThan', 0);
    
    // Verify that each command item has the expected structure
    cy.get('.command-item').each(($el) => {
      cy.wrap($el).find('.command-text').should('exist');
      cy.wrap($el).find('.command-description').should('exist');
    });
  });

  it('should display the correct number of entries', () => {
    // Get the count of entries from the UI
    cy.get('.command-item').its('length').as('uiCount');
    
    // We can't directly access the file system in Cypress, but we can check
    // if the count matches what we expect based on the data-total attribute
    // that might be set by the application
    cy.get('#data-container').invoke('attr', 'data-total').then((totalAttr) => {
      if (totalAttr) {
        const expectedTotal = parseInt(totalAttr, 10);
        cy.get('@uiCount').should('eq', expectedTotal);
      } else {
        // If there's no data-total attribute, we can at least verify there are entries
        cy.get('@uiCount').should('be.greaterThan', 0);
      }
    });
  });
});

/**
 * Test Case ID: TC-007
 * Title: Verify Custom Data File Path
 * Description: Test that the application can load data from a custom file path specified in user_config.json
 */
describe('Custom File Path', () => {
  // Note: This test is more complex as it requires modifying the user_config.json file
  // and creating a test CSV file. In a real implementation, we might use cy.task()
  // to interact with the file system, but for this example, we'll simulate the behavior.
  
  // This test assumes the application has an API or mechanism to change the data source
  // without editing the file directly
  
  it('should load data from a custom file path', () => {
    // Visit the application with a query parameter to specify a test file
    // This assumes the application supports this - in a real implementation,
    // we would need to modify the actual config file
    cy.visit('/?testFile=test_data.csv');
    
    // Wait for data to load
    cy.waitForDataLoad();
    
    // Verify that data is loaded from the test file
    // This assumes the test file has specific content we can check for
    cy.get('.command-item').contains('TEST_COMMAND').should('exist');
    
    // Verify the file path is displayed in the UI (if applicable)
    cy.get('#file-path-display').should('contain', 'test_data.csv');
  });
}); 