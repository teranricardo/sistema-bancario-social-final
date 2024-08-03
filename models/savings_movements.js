const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class SavingsMovementsModel {
  create(movement) {
    return new Promise((resolve, reject) => {
      movement.id = uuidv4();
      const query = 'INSERT INTO savings_movements (id, savingsId, amount, date, type, newBalance) VALUES (?, ?, ?, ?, ?, ?)';
      const values = [movement.id, movement.savingsId, movement.amount, movement.date, movement.type, movement.newBalance];
      pool.query(query, values)
        .then(([result]) => resolve(result.insertId))
        .catch(error => reject(error));
    });
  }

  showBySavingsId(savingsId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM savings_movements WHERE savingsId = ?';
      pool.query(query, [savingsId])
        .then(([rows]) => resolve(rows))
        .catch(error => reject(error));
    });
  }
}

module.exports = new SavingsMovementsModel();
