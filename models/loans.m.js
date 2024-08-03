const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class LoansModel {
  create(loan) {
    return new Promise((resolve, reject) => {
      loan.id = uuidv4();
      const query = 'INSERT INTO loans (id, userId, amount, interestRate, balance, nextPaymentDate, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const values = [loan.id, loan.userId, loan.amount, loan.interestRate, loan.balance, loan.nextPaymentDate, loan.createdAt];
      pool.query(query, values)
        .then(([result]) => resolve(result.insertId))
        .catch(error => reject(error));
    });
  }

  show() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM loans';
      pool.query(query)
        .then(([rows]) => resolve(rows))
        .catch(error => reject(error));
    });
  }

  showByID(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM loans WHERE id = ?';
      pool.query(query, [id])
        .then(([rows]) => resolve(rows[0]))
        .catch(error => reject(error));
    });
  }

  edit(updatedLoan, id) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE loans SET userId = ?, amount = ?, interestRate = ?, balance = ?, nextPaymentDate = ?, createdAt = ? WHERE id = ?';
      const values = [updatedLoan.userId, updatedLoan.amount, updatedLoan.interestRate, updatedLoan.balance, updatedLoan.nextPaymentDate, updatedLoan.createdAt, id];
      pool.query(query, values)
        .then(([result]) => resolve(result.affectedRows))
        .catch(error => reject(error));
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM loans WHERE id = ?';
      pool.query(query, [id])
        .then(([result]) => resolve(result.affectedRows))
        .catch(error => reject(error));
    });
  }

  showByUserID(userId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM loans WHERE userId = ?';
      pool.query(query, [userId])
        .then(([rows]) => resolve(rows))
        .catch(error => reject(error));
    });
  }
}

module.exports = new LoansModel();