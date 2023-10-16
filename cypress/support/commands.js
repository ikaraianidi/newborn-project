// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getToken', () => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: {
      email: Cypress.env('email'),
      password: Cypress.env('password'),
    },
  }).then((response) => {
    return response.body.token;
  });
});

Cypress.Commands.add('loginViaApi', () => {
  cy.getToken().then((token) => {
    cy.visit('/overview', {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth-token', token);
      },
    });
  });
});

Cypress.Commands.add('getCategories', () => {
  cy.getToken().then((token) => {
    cy.request({
      method: 'GET',
      url: '/api/category',
      headers: {
        Authorization: token,
      },
    })
      .its('body')
      .then((body) => {
        return body;
      });
  });
});
