/**
 * Test Case ID: TC-002
 * Title: Verify Copy to Clipboard Functionality
 * Description: Test that clicking on an entry copies its content to the clipboard
 */
describe('Copy to Clipboard Functionality', () => {
  beforeEach(() => {
    // Visit the application
    cy.visit('/');
    // Wait for data to load
    cy.waitForDataLoad();
    
    // Stub the clipboard API
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').resolves();
    });
  });

  it('should copy command text to clipboard when clicked', () => {
    // Get the first command item
    cy.get('.command-item').first().as('firstCommand');
    
    // Get the text content of the command
    cy.get('@firstCommand').find('.command-text').invoke('text').as('commandText');
    
    // Click on the command
    cy.get('@firstCommand').click();
    
    // Verify that the clipboard API was called with the correct text
    cy.get('@commandText').then((text) => {
      cy.window().its('navigator.clipboard.writeText').should('be.calledWith', text);
    });
    
    // Verify that visual feedback is shown
    cy.get('.toast-notification').should('be.visible');
    cy.contains('Copied to clipboard').should('be.visible');
  });

  it('should copy unmasked sensitive data when clicked', () => {
    // Find an entry with sensitive data (marked with ##)
    cy.get('.command-item').contains('*').first().as('sensitiveCommand');
    
    // Get the original unmasked data (this would be in the data attribute or similar)
    cy.get('@sensitiveCommand').invoke('attr', 'data-original').as('originalData');
    
    // Click on the sensitive command
    cy.get('@sensitiveCommand').click();
    
    // Verify that the clipboard API was called with the unmasked data
    cy.get('@originalData').then((originalData) => {
      cy.window().its('navigator.clipboard.writeText').should('be.calledWith', originalData);
    });
  });
}); 