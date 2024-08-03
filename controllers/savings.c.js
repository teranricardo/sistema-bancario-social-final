var savingsModel = require("../models/savings.m");
var usersModel = require("../models/users.m");
const savingsMovementsModel = require('../models/savings_movements')

class SavingController {
  async createForm() {
    try {
      const users = await usersModel.show();
      return { users };
    } catch (err) {
      throw new Error(`Error al obtener usuarios: ${err}`);
    }
  }

  async create(data) {
    const { userId, interestRate, balance } = data;
    if (!userId || !interestRate || !balance) {
      throw new Error("Faltan datos de la cuenta de ahorro por agregar.");
    }
    try {
      const user = await usersModel.showByID(userId);
      if (!user) {
        throw new Error(`No se encontró el usuario con ID: ${userId}`);
      }
      const saving = {
        userId,
        interestRate,
        balance,
        createdAt: new Date()
      };
      await savingsModel.create(saving);
      return { success: true };
    } catch (err) {
      throw new Error(`Error al crear la cuenta de ahorro: ${err}`);
    }
  }

  async show() {
    try {
      const savings = await savingsModel.show();
      return { savings };
    } catch (err) {
      throw new Error(`Error al listar cuentas de ahorro: ${err}`);
    }
  }

  async showByID(id) {
    try {
      const saving = await savingsModel.showByID(id);
      if (!saving) {
        throw new Error(`No se encontró la cuenta de ahorro con id: ${id}`);
      }
      return { saving };
    } catch (err) {
      throw new Error(`Error al buscar la cuenta de ahorro: ${err}`);
    }
  }

  async edit(id) {
    try {
      const [saving, users] = await Promise.all([savingsModel.showByID(id), usersModel.show()]);
      if (!saving) {
        throw new Error(`No se encontró la cuenta de ahorro con id: ${id}`);
      }
      return { saving, users };
    } catch (err) {
      throw new Error(`Error al cargar la cuenta de ahorro para editar: ${err}`);
    }
  }

  async update(id, data) {
    try {
      const saving = await savingsModel.showByID(id);
      if (!saving) {
        throw new Error(`No se encontró la cuenta de ahorro con id: ${id}`);
      }
      const updatedSaving = {
        id,
        userId: data.userId || saving.userId,
        interestRate: data.interestRate || saving.interestRate,
        createdAt: saving.createdAt,
        balance: data.balance || saving.balance,
      };
      await savingsModel.edit(updatedSaving, id);
      return { success: true };
    } catch (err) {
      throw new Error(`Error al editar la cuenta de ahorro: ${err}`);
    }
  }

  async delete(id) {
    try {
      const saving = await savingsModel.showByID(id);
      if (!saving) {
        throw new Error(`No se encontró la cuenta de ahorro con id: ${id}`);
      }
      await savingsModel.delete(id);
      return { success: true };
    } catch (err) {
      throw new Error(`Error al eliminar la cuenta de ahorro: ${err}`);
    }
  }

  async showMovements(savingsId) {
    try {
      const movements = await savingsMovementsModel.showBySavingsId(savingsId);
      return { movements };
    } catch (err) {
      throw new Error(`Error al listar los movimientos: ${err}`);
    }
  }

  async createMovement(data) {
    const { savingsId, amount, type } = data;
    if (!savingsId || !amount || !type) {
      throw new Error("Faltan datos del movimiento.");
    }
    try {
      const savings = await savingsModel.showByID(savingsId);
      if (!savings) {
        throw new Error(`No se encontró la cuenta de ahorros con ID: ${savingsId}`);
      }
      const newBalance = type === 'Deposito' ? savings.balance + amount : savings.balance - amount;

      const movement = {
        savingsId,
        amount,
        date: new Date(),
        type,
        newBalance,
        // interestEarned: type === 'interest' ? amount : 0, // Solo si decides registrar intereses explícitamente
      };

      await savingsMovementsModel.create(movement);
      await savingsModel.edit({ ...savings, balance: newBalance }, savingsId);

      return { success: true };
    } catch (err) {
      throw new Error(`Error al crear el movimiento: ${err}`);
    }
  }


}

module.exports = new SavingController();