/// <reference types="cypress" />
import { DBHelper } from '../support/dbHelper';
let suffix = Date.now();
let categoryId;
let orderNumber;
let orderId;
let expectedOrderId;
let expectedOrderNumber;

describe('Validate Category deletion from the DB', () => {
  beforeEach(() => {
    cy.loginViaApi();
  });
  it('Create category with an image and add positions', () => {
    cy.contains('Асортимент').click();
    cy.contains('button', 'Додати категорію').click();
    cy.get('#name').type(`Test category ${suffix}`);
    cy.get('input[type="file"]').selectFile('cypress/media/lays.png', {
      force: true,
    });

    cy.intercept('POST', '/api/category').as('createCategory');
    cy.contains('button', 'Зберегти зміни').click();

    cy.wait('@createCategory')
      .its('response.body._id')
      .then((categoryId) => {
        cy.createPosition(categoryId, `Test position #1 + ${suffix}`, 10);
        cy.createPosition(categoryId, `Test position #2 + ${suffix}`, 20);
        cy.createPosition(categoryId, `Test position #3 + ${suffix}`, 30);
      });
  });

  it('Create order', () => {
    cy.contains('Додати замовлення').click();
    cy.contains(`Test category ${suffix}`).click();
    for (let i = 0; i < 3; i++) {
      const randomNumber = Math.round(Math.random() * 50);
      cy.get("input[type='number']").eq(i).clear().type(randomNumber);
      cy.get('button.btn-small').eq(i).click();
    }
    cy.contains('button', 'Завершити').click();

    cy.intercept('POST', '/api/order').as('createOrder');

    cy.contains('button', 'Підтвердити').click();

    cy.wait('@createOrder').then((interception) => {
      const orderResponse = interception.response.body;
      orderId = orderResponse._id;
      orderNumber = orderResponse.order;
    });
  });

  it('Filter order', () => {
    cy.contains('Історія').click();
    cy.get(
      'button[data-position="left"][data-tooltip="Открыть фильтр"]'
    ).click();
    cy.get('#number').type(orderNumber, { force: true });
    cy.intercept('GET', '/api/order?**').as('filterOrders');
    cy.contains('button', 'Применить фильтр').click();

    cy.wait('@filterOrders').then((interception) => {
      const orderResponse = interception.response.body;
      expectedOrderId = orderResponse[0]._id;
      expectedOrderNumber = orderResponse[0].order;

      expect(expectedOrderId).to.equal(orderId);
      expect(expectedOrderNumber).to.equal(orderNumber);
    });
  });

  it('Validate that category is deleted from the DB', () => {
    cy.contains('Асортимент').click();
    cy.contains(`Test category ${suffix}`).click();
    cy.intercept('DELETE', '/api/category/*').as('deleteCategory');
    cy.get('button.btn.btn-small.red').click();
    cy.wait('@deleteCategory');

    DBHelper.getCategoryById(categoryId).then((category) => {
      expect(category).to.be.null;
    });
  });
});
