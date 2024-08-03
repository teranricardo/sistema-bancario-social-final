const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class SavingsModel {
  create(saving) {
    return new Promise((resolve, reject) => {
      saving.id = uuidv4();
      const query = 'INSERT INTO savings (id, userId, interestRate, balance, createdAt) VALUES (?, ?, ?, ?, ?)';
      const values = [saving.id, saving.userId, saving.interestRate, saving.balance, saving.createdAt];
      pool.query(query, values)
        .then(([result]) => resolve(result.insertId))
        .catch(error => reject(error));
    });
  }

  show() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM savings';
      pool.query(query)
        .then(([rows]) => resolve(rows))
        .catch(error => reject(error));
    });
  }

  showByID(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM savings WHERE id = ?';
      pool.query(query, [id])
        .then(([rows]) => resolve(rows[0]))
        .catch(error => reject(error));
    });
  }

  edit(saving, id) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE savings SET userId = ?, interestRate = ?, balance = ?, createdAt = ? WHERE id = ?';
      const values = [saving.userId, saving.interestRate, saving.balance, saving.createdAt, id];
      pool.query(query, values)
        .then(([result]) => resolve(result.affectedRows))
        .catch(error => reject(error));
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM savings WHERE id = ?';
      pool.query(query, [id])
        .then(([result]) => resolve(result.affectedRows))
        .catch(error => reject(error));
    });
  }

  showByUserID(userId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM savings WHERE userId = ?';
      pool.query(query, [userId])
        .then(([rows]) => resolve(rows))
        .catch(error => reject(error));
    });
  }
}

module.exports = new SavingsModel();