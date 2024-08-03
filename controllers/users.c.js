var usersModel = require("../models/users.m");
var loansModel = require("../models/loans.m");
var savingsModel = require("../models/savings.m");
var cooperativesModel = require("../models/cooperatives.m");
const bcrypt = require('bcryptjs');

class UsersController {
  async register(data) {
    const { name, username, password, role } = data;
    if (!name || !username || !password || !role) {
      return { error: "Todos los campos son requeridos." };
    }

    try {
      const user = await usersModel.findByUsername(username);
      if (user) {
        return { error: "El nombre de usuario ya está en uso." };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { name, username, password: hashedPassword, role };
      await usersModel.create(newUser);

      return { success: true };
    } catch (error) {
      return { error: `Error al registrar usuario: ${error.message}` };
    }
  }

  async show() {
    try {
      const users = await usersModel.show();
      return users;
    } catch (err) {
      throw new Error(`Error al listar usuarios: ${err}`);
    }
  }

  async showByID(id) {
    try {
      const user = await usersModel.showByID(id);
      return user;
    } catch (err) {
      throw new Error(`Error al buscar usuario: ${err}`);
    }
  }

  async update(id, data) {
    const { name, username, password, role } = data;

    try {
      const user = await usersModel.showByID(id);
      if (!user) {
        return { error: `No se encontró el usuario con id: ${id}` };
      }

      // Si se proporciona una nueva contraseña, encriptarla
      let hashedPassword = user.password; // Mantener la contraseña actual si no se proporciona una nueva
      if (password && password.trim() !== '') {
        hashedPassword = await bcrypt.hash(password, 10);
      }

      const updatedUser = {
        name: name ? name : user.name,
        username: username ? username : user.username,
        password: hashedPassword,
        role: role ? role : user.role
      };

      await usersModel.edit(updatedUser, id);
      return { success: true };
    } catch (err) {
      throw new Error(`Error al editar el usuario: ${err}`);
    }
  }

  async delete(id) {
    try {
      const user = await usersModel.showByID(id);
      if (!user) {
        return { error: `No se encontró el usuario con id: ${id}` };
      }
      await usersModel.delete(id);
      return { success: true };
    } catch (err) {
      throw new Error(`Error al eliminar usuario: ${err}`);
    }
  }

  async getAccounts(id) {
    try {
      const user = await usersModel.showByID(id);
      if (!user) {
        throw new Error(`No se encontró el usuario con id: ${id}`);
      }
      const loans = await loansModel.showByUserID(id);
      const savings = await savingsModel.showByUserID(id);
      const cooperatives = await cooperativesModel.showByUserID(id);

      return {
        user,
        accounts: { loans, savings, cooperatives }
      };
    } catch (err) {
      throw new Error(`Error al obtener cuentas del usuario: ${err}`);
    }
  }

  async summaryAccounts(id) {
    try {
      const user = await usersModel.showByID(id);
      if (!user) {
        throw new Error(`No se encontró el usuario con id: ${id}`);
      }

      const loans = await loansModel.showByUserID(id);
      const savings = await savingsModel.showByUserID(id);
      const cooperatives = await cooperativesModel.showByUserID(id);

      const totalLoanBalance = loans.reduce((sum, loan) => sum + parseFloat(loan.balance), 0);
      const totalSavingsBalance = savings.reduce((sum, saving) => sum + parseFloat(saving.balance), 0);
      const totalCooperativeBalance = cooperatives.reduce((sum, cooperative) => sum + parseFloat(cooperative.balance), 0);

      const totalLoanInterest = loans.reduce((sum, loan) => sum + parseFloat(loan.interestRate), 0);
      const averageLoanInterestRate = loans.length > 0 ? totalLoanInterest / loans.length : 0;

      const totalSavingsInterest = savings.reduce((sum, saving) => sum + parseFloat(saving.interestRate), 0);
      const averageSavingsInterestRate = savings.length > 0 ? totalSavingsInterest / savings.length : 0;

      const totalCooperativeInterest = cooperatives.reduce((sum, cooperative) => sum + parseFloat(cooperative.interestRate), 0);
      const averageCooperativeInterestRate = cooperatives.length > 0 ? totalCooperativeInterest / cooperatives.length : 0;

      return {
        user,
        summary: {
          totalLoanBalance,
          totalSavingsBalance,
          totalCooperativeBalance,
          averageLoanInterestRate,
          averageSavingsInterestRate,
          averageCooperativeInterestRate
        }
      };
    } catch (err) {
      throw new Error(`Error al obtener resumen de cuentas del usuario: ${err}`);
    }
  }
}

module.exports = new UsersController();