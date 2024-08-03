const loansModel = require('../models/loans.m');
const usersModel = require('../models/users.m');
const loanMovementsModel = require('../models/loans_movements.m');

class LoansController {
  async createForm() {
    try {
      const users = await usersModel.show();
      return { users };
    } catch (err) {
      throw new Error(`Error al obtener usuarios: ${err}`);
    }
  }

  async create(data) {
    const { userId, amount, interestRate, balance, nextPaymentDate } = data;
    if (!userId || !amount || !interestRate || !balance || !nextPaymentDate) {
      throw new Error("Faltan datos del préstamo por agregar.");
    }
    try {
      const user = await usersModel.showByID(userId);
      if (!user) {
        throw new Error(`No se encontró el usuario con ID: ${userId}`);
      }
      const loan = {
        userId,
        amount,
        interestRate,
        balance,
        nextPaymentDate: new Date(nextPaymentDate),
        createdAt: new Date()
      };
      await loansModel.create(loan);
      return { success: true };
    } catch (err) {
      throw new Error(`Error al crear el préstamo: ${err}`);
    }
  }

  async show() {
    try {
      const loans = await loansModel.show();
      return { loans };
    } catch (err) {
      throw new Error(`Error al listar los préstamos: ${err}`);
    }
  }

  async showByID(id) {
    try {
      const loan = await loansModel.showByID(id);
      if (!loan) {
        throw new Error(`No se encontró el préstamo con ID: ${id}`);
      }
      return { loan };
    } catch (err) {
      throw new Error(`Error al buscar el préstamo: ${err}`);
    }
  }

  async edit(id) {
    try {
      const [loan, users] = await Promise.all([loansModel.showByID(id), usersModel.show()]);
      if (!loan) {
        throw new Error(`No se encontró el préstamo con ID: ${id}`);
      }
      return { loan, users };
    } catch (err) {
      throw new Error(`Error al cargar el préstamo para editar: ${err}`);
    }
  }

  async update(id, data) {
    try {
      const loan = await loansModel.showByID(id);
      if (!loan) {
        throw new Error(`No se encontró el préstamo con ID: ${id}`);
      }
      const updatedLoan = {
        id,
        userId: data.userId || loan.userId,
        amount: data.amount || loan.amount,
        interestRate: data.interestRate || loan.interestRate,
        balance: data.balance || loan.balance,
        nextPaymentDate: data.nextPaymentDate ? new Date(data.nextPaymentDate) : loan.nextPaymentDate,
        createdAt: loan.createdAt,
      };
      await loansModel.edit(updatedLoan, id);
      return { success: true };
    } catch (err) {
      throw new Error(`Error al editar el préstamo: ${err}`);
    }
  }

  async delete(id) {
    try {
      const result = await loansModel.delete(id);
      if (!result) {
        throw new Error(`No se encontró el préstamo con ID: ${id}`);
      }
      return { success: true };
    } catch (err) {
      throw new Error(`Error al eliminar el préstamo: ${err}`);
    }
  }

  async getNextPaymentDate(id) {
    try {
      const loan = await loansModel.showByID(id);
      if (!loan) {
        throw new Error(`No se encontró el préstamo con ID: ${id}`);
      }
      return { id: loan.id, date: loan.nextPaymentDate };
    } catch (err) {
      throw new Error(`Error al buscar el préstamo: ${err}`);
    }
  }

  async createMovement(data) {
    const { loanId, amount, type } = data;
    if (!loanId || !amount || !type) {
      throw new Error("Faltan datos del movimiento.");
    }
    try {
      const loan = await loansModel.showByID(loanId);
      if (!loan) {
        throw new Error(`No se encontró el préstamo con ID: ${loanId}`);
      }
      const newBalance = loan.balance + amount;
      const interestPaid = type === 'Interés' ? amount : 0;
      const capitalPaid = type === 'Capital' ? amount : 0;

      const movement = {
        loanId,
        amount,
        date: new Date(),
        type,
        newBalance,
        interestPaid,
        capitalPaid,
      };

      await loanMovementsModel.create(movement);
      await loansModel.edit({ ...loan, balance: newBalance }, loanId);

      return { success: true };
    } catch (err) {
      throw new Error(`Error al crear el movimiento: ${err}`);
    }
  }

  async showMovements(loanId) {
    try {
      const movements = await loanMovementsModel.showByLoanId(loanId);
      return { movements };
    } catch (err) {
      throw new Error(`Error al listar los movimientos: ${err}`);
    }
  }
}

module.exports = new LoansController();