var savingsModel = require("../models/savings.m");
var usersModel = require("../models/users.m");

class SavingController {
  createForm(req, res) {
    usersModel.show()
      .then((users) => {
        res.render('savings/new', { users });
      })
      .catch((err) => res.status(500).send(`Error al obtener usuarios: ${err}`));
  }

  create(req, res) {
    let saving = req.body;
    if (!saving.userId || !saving.interestRate || !saving.balance) {
      return res.status(405).send("Faltan datos de la cuenta de ahorro por agregar.");
    }
    usersModel.showByID(saving.userId)
      .then((user) => {
        if (!user) {
          return res.status(404).send(`No se encontró el usuario con ID: ${saving.userId}`);
        }
        saving.createdAt = new Date();
        return savingsModel.create(saving)
          .then(() => res.redirect('/savings'))
          .catch((err) => res.status(500).send(`Error al crear la cuenta de ahorro: ${err}`));
      })
      .catch((err) => res.status(500).send(`Error al crear la cuenta de ahorro: ${err}`));
  }

  show(req, res) {
    savingsModel.show()
      .then((savings) => res.render('savings/index', { savings }))
      .catch((err) => res.status(500).send(`Error al listar cuentas de ahorro: ${err}`));
  }

  showByID(req, res) {
    const id = req.params.id;

    savingsModel.showByID(id)
      .then((saving) => {
        if (!saving) {
          return res.status(404).send(`No se encontró la cuenta de ahorro con id: ${id}`);
        }
        res.render('savings/show', { saving });
      })
      .catch((err) => res.status(500).send(`Error al buscar la cuenta de ahorro: ${err}`));
  }

  edit(req, res) {
    const id = req.params.id;

    Promise.all([savingsModel.showByID(id), usersModel.show()])
      .then(([saving, users]) => {
        if (!saving) {
          return res.status(404).send(`No se encontró la cuenta de ahorro con id: ${id}`);
        }
        res.render('savings/edit', { saving, users });
      })
      .catch((err) => res.status(500).send(`Error al cargar la cuenta de ahorro para editar: ${err}`));
  }

  update(req, res) {
    const id = req.params.id;
    const updatedSaving = req.body;

    savingsModel.showByID(id)
      .then((saving) => {
        if (!saving) {
          return res.status(404).send(`No se encontró la cuenta de ahorro con id: ${id}`);
        }

        const newSaving = {
          id: id,
          userId: updatedSaving.userId ? updatedSaving.userId : saving.userId,
          interestRate: updatedSaving.interestRate ? updatedSaving.interestRate : saving.interestRate,
          createdAt: saving.createdAt,
          balance: updatedSaving.balance ? updatedSaving.balance : saving.balance,
        };

        return savingsModel.edit(newSaving, id)
          .then(() => res.redirect(`/savings/${id}`))
          .catch((err) => res.status(500).send(`Error al editar la cuenta de ahorro: ${err}`));
      })
      .catch((err) => res.status(500).send(`Error al editar la cuenta de ahorro: ${err}`));
  }

  delete(req, res) {
    const id = req.params.id;

    savingsModel.showByID(id)
      .then((saving) => {
        if (!saving) {
          return res.status(404).send(`No se encontró la cuenta de ahorro con id: ${id}`);
        }
        return savingsModel.delete(id)
          .then(() => res.redirect('/savings'))
          .catch((err) => res.status(500).send(`Error al eliminar la cuenta de ahorro: ${err}`));
      })
      .catch((err) => res.status(500).send(`Error al eliminar la cuenta de ahorro: ${err}`));
  }
}

module.exports = new SavingController();
