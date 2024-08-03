const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class LoanMovementsModel {
  create(movement) {
    return new Promise((resolve, reject) => {
      movement.id = uuidv4();
      const query = 'INSERT INTO loan_movements (id, loanId, amount, date, type, newBalance, interestPaid, capitalPaid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      const values = [movement.id, movement.loanId, movement.amount, movement.date, movement.type, movement.newBalance, movement.interestPaid, movement.capitalPaid];
      pool.query(query, values)
        .then(([result]) => resolve(result.insertId))
        .catch(error => reject(error));
    });
  }

  showByLoanId(loanId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM loan_movements WHERE loanId = ?';
      pool.query(query, [loanId])
        .then(([rows]) => resolve(rows))
        .catch(error => reject(error));
    });
  }
}

module.exports = new LoanMovementsModel();