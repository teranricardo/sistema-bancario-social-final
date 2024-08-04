const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class CooperativesModel {
  create(cooperative) {
    return new Promise((resolve, reject) => {
      cooperative.id = uuidv4();
      const query = `
        INSERT INTO cooperatives 
        (id, name, feeAmount, currentFee, numberOfMembers, paymentFrequency, createdAt, updatedAt) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        cooperative.id,
        cooperative.name,
        cooperative.feeAmount,
        cooperative.currentFee,
        cooperative.numberOfMembers,
        cooperative.paymentFrequency,
        cooperative.createdAt,
        cooperative.updatedAt
      ];
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
                cooperative.members = members || [];
                return cooperative;
              });
          });
          return Promise.all(memberPromises);
        })
        .then(cooperatives => resolve(cooperatives))
        .catch(error => {
          console.error('Error al listar las cooperativas:', error);
          reject(error);
        });
    });
  }

  showByID(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM cooperatives WHERE id = ?';
      pool.query(query, [id])
        .then(([rows]) => {
          if (rows.length === 0) {
            throw new Error('Cooperativa no encontrada');
          }
          const cooperative = rows[0];
          return this.showMembersByCooperativeID(cooperative.id)
            .then(members => {
              cooperative.members = members || [];
              return cooperative;
            });
        })
        .then(cooperative => resolve(cooperative))
        .catch(error => {
          console.error('Error al obtener los detalles de la cooperativa:', error);
          reject(error);
        });
    });
  }

  edit(updatedCooperative, id) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE cooperatives 
        SET name = ?, 
            feeAmount = ?, 
            currentFee = ?,
            numberOfMembers = ?, 
            paymentFrequency = ?, 
            updatedAt = ?
        WHERE id = ?
      `;
      const values = [
        updatedCooperative.name || null,
        updatedCooperative.feeAmount || null,
        updatedCooperative.currentFee || null,
        updatedCooperative.numberOfMembers || null,
        updatedCooperative.paymentFrequency || null,
        updatedCooperative.updatedAt || null,
        id
      ];
      pool.query(query, values)
        .then(() => resolve())
        .catch(error => reject(error));
    });
  }

  editCurrentFee(updatedCooperative, id) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE cooperatives 
        SET currentFee = ?
        WHERE id = ?
      `;
      const values = [
        updatedCooperative.currentFee || null,
        id
      ];
      pool.query(query, values)
        .then(() => resolve())
        .catch(error => reject(error));
    });
  }


  delete(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM cooperatives WHERE id = ?';
      pool.query(query, [id])
        .then(() => resolve())
        .catch(error => reject(error));
    });
  }

  async addUser(cooperativeId, userId) {
    try {
      const query = 'INSERT INTO cooperative_members (cooperative_id, user_id) VALUES (?, ?)';
      const [result] = await pool.query(query, [cooperativeId, userId]);
      return { status: 200, message: 'Usuario agregado exitosamente.' };
    } catch (error) {
      console.error('Error al agregar el usuario a la cooperativa:', error);
      return { status: 500, message: 'Error al agregar el usuario a la cooperativa.' };
    }
  }

  showMembersByCooperativeID(cooperativeId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT cm.cooperative_id, cm.user_id, u.name AS user_name
        FROM cooperative_members cm
        JOIN users u ON cm.user_id = u.id
        WHERE cm.cooperative_id = ?
      `;

      pool.query(query, [cooperativeId])
        .then(([rows]) => {
          resolve(rows);
        })
        .catch(error => {
          console.error(`Error al obtener los miembros para la cooperativa con ID ${cooperativeId}:`, error);
          resolve([]);
        });
    });
  }

  showByUserID(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT c.id, c.name, c.createdAt, c.feeAmount, c.currentFee, c.numberOfMembers, c.paymentFrequency
        FROM cooperative_members cm
        JOIN cooperatives c ON cm.cooperative_id = c.id
        WHERE cm.user_id = ?
      `;

      pool.query(query, [userId])
        .then(([rows]) => resolve(rows))
        .catch(error => {
          console.error(`Error al obtener las cooperativas para el usuario con ID ${userId}:`, error);
          reject(error);
        });
    });
  }

  removeUser(cooperativeId, userId) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM cooperative_members WHERE cooperative_id = ? AND user_id= ?';
      const values = [cooperativeId, userId];
      pool.query(query, values)
        .then(() => resolve())
        .catch(error => reject(error));
    });
  }

  async countMembersByCooperativeID(cooperativeId) {
    try {
      const query = 'SELECT COUNT(*) AS count FROM cooperative_members WHERE cooperative_id = ?';
      const [rows] = await pool.query(query, [cooperativeId]);
      return rows[0].count;
    } catch (error) {
      throw new Error(`Error al contar miembros: ${error.message}`);
    }
  }

}

module.exports = new CooperativesModel();