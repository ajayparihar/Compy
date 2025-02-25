// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to check if an element is masked (for sensitive data)
Cypress.Commands.add('isMasked', { prevSubject: true }, (subject) => {
  // Check if the text content contains asterisks or other masking characters
  const text = subject.text();
  const isMasked = /\*+/.test(text);
  return cy.wrap(isMasked);
});

// Custom command to verify theme application
Cypress.Commands.add('hasThemeClass', (themeClass) => {
  cy.document().then((doc) => {
    const htmlElement = doc.documentElement;
    const hasClass = htmlElement.classList.contains(themeClass);
    return cy.wrap(hasClass);
  });
});

// Custom command to wait for data to load
Cypress.Commands.add('waitForDataLoad', () => {
  // Wait for the data container to be visible and not have a loading class
  cy.get('#data-container', { timeout: 10000 })
    .should('be.visible')
    .should('not.have.class', 'loading');
}); 