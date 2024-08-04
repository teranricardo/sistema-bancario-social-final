const pool = require('../config/db');

class CooperativeMovementsModel {
  async create(movement) {
    try {
      const result = await pool.query(
        'INSERT INTO cooperative_movements (id, cooperativeId, userId, amount, date, feeNumber) VALUES (?, ?, ?, ?, ?, ?)',
        [movement.id, movement.cooperativeId, movement.userId, movement.amount, movement.date, movement.feeNumber]
      );
      return result;
    } catch (error) {
      throw new Error(`Error al crear el movimiento: ${error.message}`);
    }
  }
}

module.exports = new CooperativeMovementsModel();