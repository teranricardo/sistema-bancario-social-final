const cooperativesModel = require("../models/cooperatives.m");
const usersModel = require("../models/users.m");
const savingsModel = require("../models/savings.m");
const cooperativeMovementsModel = require("../models/cooperativeMovements.m");
const { v4: uuidv4 } = require('uuid');

class CooperativesController {
  async createForm() {
    try {
      const users = await usersModel.show();
      return { users };
    } catch (err) {
      throw new Error(`Error al obtener usuarios: ${err}`);
    }
  }

  async create(data) {
    const cooperative = data;

    // Validar campos requeridos
    if (!cooperative.name || !cooperative.feeAmount || !cooperative.numberOfMembers || !cooperative.paymentFrequency) {
      throw new Error("Faltan datos de la cooperativa por agregar.");
    }

    // Validar miembros si están presentes
    const memberValidation = cooperative.members
      ? Promise.all(cooperative.members.map(userId => usersModel.showByID(userId)))
      : Promise.resolve([]);

    try {
      const members = await memberValidation;
      const invalidMembers = members.filter(member => !member);
      if (invalidMembers.length > 0) {
        throw new Error(`No se encontró(aron) algún(os) usuario(s) con los siguientes id: ${cooperative.members}`);
      }

      cooperative.createdAt = new Date();
      cooperative.currentFee = 1;
      const newCooperativeId = await cooperativesModel.create(cooperative);

      if (cooperative.members) {
        await Promise.all(cooperative.members.map(userId => cooperativesModel.addUser(newCooperativeId, userId)));
      }

      return { status: 201, data: newCooperativeId };
    } catch (error) {
      throw new Error(`Error al crear la cooperativa: ${error.message}`);
    }
  }

  async show() {
    try {
      const cooperatives = await cooperativesModel.show();
      return { status: 200, data: cooperatives };
    } catch (error) {
      throw new Error(`Error al listar las cooperativas: ${error.message}`);
    }
  }

  async showByID(id) {
    try {
      const cooperative = await cooperativesModel.showByID(id);
      if (!cooperative) {
        throw new Error(`No se encontró la cooperativa con id: ${id}`);
      }
      return { status: 200, data: cooperative };
    } catch (error) {
      throw new Error(`Error al buscar la cooperativa: ${error.message}`);
    }
  }

  async edit(id, updatedCooperative) {
    try {
      const cooperative = await cooperativesModel.showByID(id);
      if (!cooperative) {
        throw new Error(`No se encontró la cooperativa con id: ${id}`);
      }

      // Validar miembros si están presentes
      const memberValidation = updatedCooperative.members
        ? Promise.all(updatedCooperative.members.map(userId => usersModel.showByID(userId)))
        : Promise.resolve([]);

      const members = await memberValidation;
      const invalidMembers = members.filter(member => !member);
      if (invalidMembers.length > 0) {
        throw new Error(`No se encontró(aron) algún(os) usuario(s) con los siguientes id: ${updatedCooperative.members}`);
      }

      const updatedData = {
        name: updatedCooperative.name || cooperative.name,
        feeAmount: updatedCooperative.feeAmount || cooperative.feeAmount,
        numberOfMembers: updatedCooperative.numberOfMembers || cooperative.numberOfMembers,
        paymentFrequency: updatedCooperative.paymentFrequency || cooperative.paymentFrequency,
      };

      await cooperativesModel.edit(updatedData, id);

      const existingMembers = await cooperativesModel.showMembersByCooperativeID(id);
      const membersToAdd = updatedCooperative.members.filter(userId => !existingMembers.some(member => member.user_id === userId));
      const membersToRemove = existingMembers.filter(member => !updatedCooperative.members.includes(member.user_id));

      await Promise.all([
        ...membersToAdd.map(userId => cooperativesModel.addUser(id, userId)),
        ...membersToRemove.map(member => cooperativesModel.removeUser(id, member.user_id))
      ]);

      return { status: 200, message: `Cooperativa con id ${id} editada correctamente.` };
    } catch (error) {
      throw new Error(`Error al editar la cooperativa: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const cooperative = await cooperativesModel.showByID(id);
      if (!cooperative) {
        throw new Error(`No se encontró la cooperativa con id: ${id}`);
      }
      await cooperativesModel.delete(id);
      return { status: 200, message: `Cooperativa con id ${id} eliminada correctamente.` };
    } catch (error) {
      throw new Error(`Error al eliminar la cooperativa: ${error.message}`);
    }
  }

  async addUser(cooperativeId, userId) {
    try {
      const cooperative = await cooperativesModel.showByID(cooperativeId);
      if (!cooperative) {
        throw new Error(`No se encontró la cooperativa con id: ${cooperativeId}`);
      }

      const user = await usersModel.showByID(userId);
      if (!user) {
        throw new Error(`No se encontró el usuario con id: ${userId}`);
      }

      // Contar miembros actuales
      const currentMembersCount = await cooperativesModel.countMembersByCooperativeID(cooperativeId);
      if (currentMembersCount >= cooperative.numberOfMembers) {
        throw new Error(`No se puede agregar más miembros. El límite de ${cooperative.numberOfMembers} miembros ha sido alcanzado.`);
      }

      const members = await cooperativesModel.showMembersByCooperativeID(cooperativeId);
      if (members.some(member => member.user_id === userId)) {
        throw new Error(`El usuario con id "${userId}" ya pertenece a la cooperativa.`);
      }

      await cooperativesModel.addUser(cooperativeId, userId);
      return { status: 200, message: `Usuario con id ${userId} agregado correctamente a la cooperativa.` };
    } catch (error) {
      throw new Error(`Error al agregar el usuario a la cooperativa: ${error.message}`);
    }
  }

  async removeMember(cooperativeId, memberId) {
    try {
      // Verificar si la cooperativa existe
      const cooperative = await cooperativesModel.showByID(cooperativeId);
      if (!cooperative) {
        throw new Error(`No se encontró la cooperativa con id: ${cooperativeId}`);
      }

      // Verificar si el usuario existe
      const user = await usersModel.showByID(memberId);
      if (!user) {
        throw new Error(`No se encontró el usuario con id: ${memberId}`);
      }

      // Verificar si el miembro está en la cooperativa
      const members = await cooperativesModel.showMembersByCooperativeID(cooperativeId);
      if (!members.some(member => member.user_id === memberId)) {
        throw new Error(`El miembro con id ${memberId} no pertenece a la cooperativa con id ${cooperativeId}`);
      }

      // Eliminar el miembro de la cooperativa
      await cooperativesModel.removeUser(cooperativeId, memberId);
      return { status: 200, message: `Miembro con id ${memberId} eliminado correctamente de la cooperativa con id ${cooperativeId}.` };
    } catch (error) {
      throw new Error(`Error al eliminar el miembro: ${error.message}`);
    }
  }

  async payFees(cooperativeId) {
    try {
      // Obtener la cooperativa
      const cooperative = await cooperativesModel.showByID(cooperativeId);
      if (!cooperative) {
        throw new Error(`No se encontró la cooperativa con id: ${cooperativeId}`);
      }

      // Convertir valores relevantes a números
      const frequencyMap = {
        semanal: 7,
        quincenal: 15,
        mensual: 30
      };

      const paymentFrequency = frequencyMap[cooperative.paymentFrequency];
      const feeAmount = Number(cooperative.feeAmount);
      const currentFee = Number(cooperative.currentFee);
      const numberOfMembers = Number(cooperative.numberOfMembers);
      let nextPaymentDate = new Date(cooperative.createdAt);
      let paymentsMade = 0;

      // Calcular la cantidad de pagos realizados
      while (nextPaymentDate <= new Date()) {
        nextPaymentDate.setDate(nextPaymentDate.getDate() + paymentFrequency);
        paymentsMade++;
      }

      if (currentFee > numberOfMembers) {
        throw new Error('Ya se han pagado todas las cuotas correspondientes.');
      }

      // Obtener miembros de la cooperativa
      const members = await cooperativesModel.showMembersByCooperativeID(cooperativeId);

      if (members.length < numberOfMembers) {
        throw new Error('Faltan miembros en la cooperativa.');
      }
      const totalFeeAmount = feeAmount * (numberOfMembers - 1);
      let i = 1;
      for (const member of members) {
        // Obtener cuenta de ahorro del miembro
        const savings = await savingsModel.showByUserID(member.user_id);
        if (savings.length > 0) {
          const savingAccount = savings[0];
          const savingBalance = Number(savingAccount.balance);

          // Verificar saldo suficiente
          if (savingBalance < feeAmount) {
            throw new Error('Saldo insuficiente en la cuenta de ahorro.');
          }

          // Crear movimiento
          const movement = {
            id: uuidv4(),
            cooperativeId: cooperativeId,
            userId: member.user_id,
            amount: feeAmount,
            date: new Date(),
            feeNumber: currentFee + 1
          };
          await cooperativeMovementsModel.create(movement);

          // Actualizar saldo de la cuenta de ahorro
          await savingsModel.editBalance({ balance: savingBalance - feeAmount }, savingAccount.id);

          if (i == currentFee) {
            await savingsModel.editBalance({ balance: savingBalance + totalFeeAmount }, savingAccount.id);
          }
          i++;
        }
      }

      // Actualizar cuota actual de la cooperativa
      await cooperativesModel.editCurrentFee({ currentFee: currentFee + 1 }, cooperativeId);



      return { status: 200, message: 'Cuotas pagadas exitosamente.' };
    } catch (error) {
      throw new Error(`Error al procesar el pago de cuotas: ${error.message}`);
    }
  }
}

module.exports = new CooperativesController();