const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class UsersModel {
  async create(user) {
    return new Promise((resolve, reject) => {
      user.id = uuidv4();

      const query = 'INSERT INTO users (id, name, username, password, role) VALUES (?, ?, ?, ?, ?)';
      pool.query(query, [user.id, user.name, user.username, user.password, user.role])
        .then(([result]) => resolve(result.insertId))
        .catch(error => reject(error));
    });
  }

  show() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users';
      pool.query(query)
        .then(([rows]) => resolve(rows))
        .catch(error => reject(error));
    });
  }

  showByID(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE id = ?';
      pool.query(query, [id])
        .then(([rows]) => resolve(rows[0]))
        .catch(error => reject(error));
    });
  }

  findByUsername(username) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM users WHERE username = ?';
      pool.query(query, [username])
        .then(([rows]) => resolve(rows[0]))
        .catch(error => reject(error));
    });
  }

  areUsersValid(userIds) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT id FROM users WHERE id IN (?)';
      pool.query(query, [userIds])
        .then(([rows]) => resolve(rows.length === userIds.length))
        .catch(error => reject(error));
    });
  }

  edit(updatedUser, id) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE users SET 
          name = ?, 
          username = ?, 
          password = ?, 
          role = ? 
        WHERE id = ?
      `;
      pool.query(query, [updatedUser.name, updatedUser.username, updatedUser.password, updatedUser.role, id])
        .then(([result]) => resolve(result.affectedRows))
        .catch(error => reject(error));
    });
  }


  delete(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM users WHERE id = ?';
      pool.query(query, [id])
        .then(([result]) => resolve(result.affectedRows))
        .catch(error => reject(error));
    });
  }
}

module.exports = new UsersModel();