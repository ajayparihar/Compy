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
      
      // Verify data structure
      cy.wrap($el).should('have.attr', 'data-id');
      cy.wrap($el).find('.command-text').invoke('text').should('not.be.empty');
      cy.wrap($el).find('.command-description').invoke('text').should('not.be.empty');
    });
  });

  it('should handle malformed CSV data gracefully', () => {
    // Visit with malformed data parameter
    cy.visit('/?testData=malformed');
    
    // Verify error handling
    cy.get('.error-message')
      .should('be.visible')
      .should('contain', 'Error loading data');
    
    // Verify retry button is available
    cy.get('#retry-button').should('be.visible');
    
    // Test retry functionality
    cy.get('#retry-button').click();
    cy.waitForDataLoad();
    cy.get('.command-item').should('have.length.greaterThan', 0);
  });

  it('should handle empty CSV file', () => {
    // Visit with empty data parameter
    cy.visit('/?testData=empty');
    
    // Verify empty state handling
    cy.get('.empty-state')
      .should('be.visible')
      .should('contain', 'No data available');
    
    // Verify add new item button is available
    cy.get('#add-item-button').should('be.visible');
  });

  it('should preserve data order from CSV', () => {
    // Get the first few items and store their order
    const itemOrder = [];
    cy.get('.command-item').each(($el) => {
      itemOrder.push($el.find('.command-text').text());
    }).then(() => {
      // Refresh the page
      cy.reload();
      cy.waitForDataLoad();
      
      // Verify items are in the same order
      cy.get('.command-item').each(($el, index) => {
        if (index < itemOrder.length) {
          expect($el.find('.command-text').text()).to.equal(itemOrder[index]);
        }
      });
    });
  });

  it('should handle special characters in CSV data', () => {
    // Visit with special characters test data
    cy.visit('/?testData=special');
    cy.waitForDataLoad();
    
    // Verify special characters are displayed correctly
    cy.get('.command-item').contains('SELECT * FROM').should('exist');
    cy.get('.command-item').contains('&&').should('exist');
    cy.get('.command-item').contains('|').should('exist');
    cy.get('.command-item').contains('<script>').should('exist');
  });

  it('should handle large datasets efficiently', () => {
    // Visit with large dataset parameter
    cy.visit('/?testData=large');
    
    // Measure load time
    const startTime = Date.now();
    cy.waitForDataLoad().then(() => {
      const loadTime = Date.now() - startTime;
      expect(loadTime).to.be.lessThan(3000); // Should load within 3 seconds
    });
    
    // Verify smooth scrolling with large dataset
    cy.get('.command-item').should('have.length.greaterThan', 100);
    cy.get('#data-container').scrollTo('bottom', { duration: 1000 });
    cy.get('.command-item').last().should('be.visible');
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