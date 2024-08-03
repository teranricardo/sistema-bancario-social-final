const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class CooperativesModel {
  create(cooperative) {
    return new Promise((resolve, reject) => {
      cooperative.id = uuidv4();
      const query = 'INSERT INTO cooperatives (id, name, interestRate, balance, createdAt) VALUES (?, ?, ?, ?, ?)';
      const values = [cooperative.id, cooperative.name, cooperative.interestRate, cooperative.balance, cooperative.createdAt];
      pool.query(query, values)
        .then(([result]) => resolve(result.insertId))
        .catch(error => reject(error));
    });
  }

  show() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM cooperatives';
      pool.query(query)
        .then(([rows]) => {
          const cooperatives = rows;
          const memberPromises = cooperatives.map(cooperative => {
            return this.showMembersByCooperativeID(cooperative.id)
              .then(members => {
                cooperative.members = members;
                return cooperative;
              });
          });
          return Promise.all(memberPromises);
        })
        .then(cooperativesWithMembers => resolve(cooperativesWithMembers))
        .catch(error => reject(error));
    });
  }

  showByID(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM cooperatives WHERE id = ?';
      pool.query(query, [id])
        .then(([rows]) => {
          if (rows.length) {
            const cooperative = rows[0];
            return this.showMembersByCooperativeID(id)
              .then(members => {
                cooperative.members = members;
                resolve(cooperative);
              });
          } else {
            resolve(null);
          }
        })
        .catch(error => reject(error));
    });
  }

  edit(updatedCooperative, id) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE cooperatives SET name = ?, interestRate = ?, balance = ?, createdAt = ? WHERE id = ?';
      const values = [updatedCooperative.name, updatedCooperative.interestRate, updatedCooperative.balance, updatedCooperative.createdAt, id];
      pool.query(query, values)
        .then(([result]) => resolve(result.affectedRows))
        .catch(error => reject(error));
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM cooperatives WHERE id = ?';
      pool.query(query, [id])
        .then(([result]) => resolve(result.affectedRows))
        .catch(error => reject(error));
    });
  }

  addUser(cooperativeId, userId) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO cooperative_members (cooperative_id, user_id) VALUES (?, ?)';
      const values = [cooperativeId, userId];
      pool.query(query, values)
        .then(([result]) => resolve(result.affectedRows))
        .catch(error => reject(error));
    });
  }

  removeUser(cooperativeId, userId) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM cooperative_members WHERE cooperative_id = ? AND user_id = ?';
      const values = [cooperativeId, userId];
      pool.query(query, values)
        .then(([result]) => resolve(result.affectedRows))
        .catch(error => reject(error));
    });
  }

  showMembersByCooperativeID(cooperativeId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT user_id FROM cooperative_members WHERE cooperative_id = ?';
      pool.query(query, [cooperativeId])
        .then(([rows]) => resolve(rows.map(row => row.user_id)))
        .catch(error => reject(error));
    });
  }

  showByUserID(userId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT c.* FROM cooperatives c JOIN cooperative_members cm ON c.id = cm.cooperative_id WHERE cm.user_id = ?';
      pool.query(query, [userId])
        .then(([rows]) => resolve(rows))
        .catch(error => reject(error));
    });
  }
}

module.exports = new CooperativesModel();
