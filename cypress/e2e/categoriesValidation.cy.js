/// <reference types="cypress" />

describe('Categories', () => {
  it('Validate number of categories', () => {
    cy.loginViaApi();
    cy.getCategories().then((categories) => {
      cy.contains('Асортимент').click();
      cy.get('.collection-item').should('have.length', categories.length);
    });
  });
});
