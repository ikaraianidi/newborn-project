import { ObjectId } from 'mongodb';

export class DBHelper {
  static getAllCategories() {
    return cy.findMany({}, { collection: 'categories' });
  }

  static getCategoriesByContainingNames(name) {
    const regName = new RegExp(name, 'i');
    return cy.findMany({ name: regName }, { collection: 'categories' });
  }

  static getCategoryByName(name) {
    return cy.findOne({ name }, { collection: 'categories' });
  }

  static getCategoryById(id) {
    const formattedId = new ObjectId(id);
    return cy.findOne({ _id: formattedId }, { collection: 'categories' });
  }

  static getUserIdByName(email) {
    return cy.findOne({ email }, { collection: 'users' }).its('_id');
  }
}
