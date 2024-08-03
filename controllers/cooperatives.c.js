const cooperativesModel = require("../models/cooperatives.m");
const usersModel = require("../models/users.m");

class CooperativesController {
  create(req, res) {
    const cooperative = req.body;
    
    if (!cooperative.name || !cooperative.interestRate || !cooperative.balance) {
      return res.status(405).send("Faltan datos de la cooperativa por agregar.");
    }

    const memberValidation = cooperative.members 
      ? Promise.all(cooperative.members.map(userId => usersModel.showByID(userId)))
      : Promise.resolve([]);
    
    memberValidation
      .then(members => {
        const invalidMembers = members.filter(member => !member);
        if (invalidMembers.length > 0) {
          return res.status(404).send(`No se encontró(aron) algún(os) usuario(s) con los siguientes id: ${cooperative.members}`);
        }
        cooperative.createdAt = new Date();
        return cooperativesModel.create(cooperative)
          .then(() => {
            if (cooperative.members) {
              return Promise.all(cooperative.members.map(userId => cooperativesModel.addUser(cooperative.id, userId)));
            }
          })
          .then(() => res.status(201).send(cooperative))
          .catch((err) => res.status(500).send(`Error al crear la cooperativa: ${err}`));
      })
      .catch((err) => res.status(500).send(`Error al validar miembros: ${err}`));
  }

  show(req, res) {
    cooperativesModel.show()
      .then(cooperatives => res.status(200).send(cooperatives))
      .catch(err => res.status(500).send(`Error al listar las cooperativas: ${err}`));
  }

  showByID(req, res) {
    const id = req.params.id;
    cooperativesModel.showByID(id)
      .then(cooperative => {
        if (!cooperative) {
          return res.status(404).send(`No se encontró la cooperativa con id: ${id}`);
        }
        res.status(200).send(cooperative);
      })
      .catch(err => res.status(500).send(`Error al buscar la cooperativa: ${err}`));
  }

  edit(req, res) {
    const id = req.params.id;
    const updatedCooperative = req.body;

    cooperativesModel.showByID(id)
      .then(cooperative => {
        if (!cooperative) {
          return res.status(404).send(`No se encontró la cooperativa con id: ${id}`);
        }

        const memberValidation = updatedCooperative.members 
          ? Promise.all(updatedCooperative.members.map(userId => usersModel.showByID(userId)))
          : Promise.resolve([]);

        return memberValidation
          .then(members => {
            const invalidMembers = members.filter(member => !member);
            if (invalidMembers.length > 0) {
              return res.status(404).send(`No se encontró(aron) algún(os) usuario(s) con los siguientes id: ${updatedCooperative.members}`);
            }

            const newCooperative = {
              id: id,
              name: updatedCooperative.name || cooperative.name,
              balance: updatedCooperative.balance || cooperative.balance,
              interestRate: updatedCooperative.interestRate || cooperative.interestRate,
              createdAt: cooperative.createdAt,
            };

            return cooperativesModel.edit(newCooperative, id)
              .then(() => cooperativesModel.showMembersByCooperativeID(id))
              .then(existingMembers => {
                const membersToAdd = updatedCooperative.members.filter(userId => !existingMembers.includes(userId));
                const membersToRemove = existingMembers.filter(userId => !updatedCooperative.members.includes(userId));
                
                const addMembersPromise = Promise.all(membersToAdd.map(userId => cooperativesModel.addUser(id, userId)));
                const removeMembersPromise = Promise.all(membersToRemove.map(userId => cooperativesModel.removeUser(id, userId)));
                
                return Promise.all([addMembersPromise, removeMembersPromise]);
              })
              .then(() => res.status(200).send(`Cooperativa con id ${id} editada correctamente.`))
              .catch(err => res.status(500).send(`Error al editar la cooperativa: ${err}`));
          });
      })
      .catch(err => res.status(500).send(`Error al buscar la cooperativa: ${err}`));
  }

  delete(req, res) {
    const id = req.params.id;
    cooperativesModel.showByID(id)
      .then(cooperative => {
        if (!cooperative) {
          return res.status(404).send(`No se encontró la cooperativa con id: ${id}`);
        }
        return cooperativesModel.delete(id)
          .then(() => res.status(200).send(`Cooperativa con id ${id} eliminada correctamente.`))
          .catch(err => res.status(500).send(`Error al eliminar la cooperativa: ${err}`));
      })
      .catch(err => res.status(500).send(`Error al buscar la cooperativa: ${err}`));
  }

  addUser(req, res) {
    const cooperativeId = req.params.id;
    const userId = req.body.userId;

    cooperativesModel.showByID(cooperativeId)
      .then(cooperative => {
        if (!cooperative) {
          return res.status(404).send(`No se encontró la cooperativa con id: ${cooperativeId}`);
        }
        return usersModel.showByID(userId)
          .then(user => {
            if (!user) {
              return res.status(404).send(`No se encontró el usuario con id: ${userId}`);
            }
            return cooperativesModel.showMembersByCooperativeID(cooperativeId)
              .then(members => {
                if (members.includes(userId)) {
                  return res.status(400).send(`El usuario con id "${userId}" ya pertenece a la cooperativa.`);
                }
                return cooperativesModel.addUser(cooperativeId, userId)
                  .then(() => res.status(200).send(`Usuario con id ${userId} agregado correctamente a la cooperativa.`))
                  .catch(err => res.status(500).send(`Error al agregar el usuario a la cooperativa: ${err}`));
              });
          });
      })
      .catch(err => res.status(500).send(`Error al buscar la cooperativa: ${err}`));
  }
}

module.exports = new CooperativesController();
