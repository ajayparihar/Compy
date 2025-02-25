/**
 * Test Case ID: TC-003
 * Title: Verify Sensitive Data Masking
 * Description: Test that sensitive data marked with ## is properly masked in the interface
 */
describe('Sensitive Data Masking', () => {
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

  it('should display sensitive data as masked in the UI', () => {
    // Find entries with sensitive data (marked with ##)
    cy.get('.command-item').each(($el) => {
      const text = $el.text();
      const dataOriginal = $el.attr('data-original') || '';
      
      // If this is a sensitive data entry (has data-original attribute)
      if (dataOriginal.includes('##')) {
        // Verify the displayed text is masked
        cy.wrap($el).find('.command-text').should('contain', '*');
        
        // Verify the original text is not visible in the UI
        cy.wrap($el).find('.command-text').should('not.contain', dataOriginal.replace(/##/g, ''));
      }
    });
  });

  it('should unmask sensitive data when copied to clipboard', () => {
    // Find an entry with sensitive data
    cy.get('.command-item[data-original*="##"]').first().as('sensitiveCommand');
    
    // Get the original unmasked data
    cy.get('@sensitiveCommand').invoke('attr', 'data-original').as('originalData');
    
    // Click on the sensitive command
    cy.get('@sensitiveCommand').click();
    
    // Verify that the clipboard API was called with the unmasked data
    cy.get('@originalData').then((originalData) => {
      // Remove the ## markers for comparison
      const unmaskedData = originalData.replace(/##/g, '');
      cy.window().its('navigator.clipboard.writeText').should('be.calledWith', unmaskedData);
    });
    
    // Verify that the toast notification indicates successful copy
    cy.get('.toast-notification').should('be.visible');
    cy.contains('Copied to clipboard').should('be.visible');
  });
}); 