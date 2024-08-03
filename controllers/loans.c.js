const loansModel = require('../models/loans.m');
const usersModel = require('../models/users.m');

class LoansController {
  createForm(req, res) {
    usersModel.show()
      .then((users) => {
        res.render('loans/new', { users });
      })
      .catch((err) => res.status(500).send(`Error al obtener usuarios: ${err}`));
  }

  create(req, res) {
    const loan = req.body;
    console.log(loan)
    if (!loan.userId || !loan.amount || !loan.interestRate || !loan.balance || !loan.nextPaymentDate) {
      return res.status(400).send("Faltan datos del préstamo por agregar.");
    }

    usersModel.showByID(loan.userId)
      .then((user) => {
        if (!user) {
          return res.status(404).send(`No se encontró el usuario con ID: ${loan.userId}`);
        }
        loan.nextPaymentDate = new Date(req.body.nextPaymentDate);
        loan.createdAt = new Date();
        return loansModel.create(loan)
          .then(() => res.redirect('/loans'))
          .catch((err) => res.status(500).send(`Error al crear el préstamo: ${err}`));
      })
      .catch((err) => res.status(500).send(`Error al crear el préstamo: ${err}`));
  }

  show(req, res) {
    loansModel.show()
      .then((loans) => res.render('loans/index', { loans }))
      .catch((err) => res.status(500).send(`Error al listar los préstamos: ${err}`));
  }

  showByID(req, res) {
    const id = req.params.id;
    loansModel.showByID(id)
      .then((loan) => {
        if (!loan) {
          return res.status(404).send(`No se encontró el préstamo con ID: ${id}`);
        }
        res.render('loans/show', { loan });
      })
      .catch((err) => res.status(500).send(`Error al buscar el préstamo: ${err}`));
  }

  edit(req, res) {
    const id = req.params.id;

    Promise.all([loansModel.showByID(id), usersModel.show()])
      .then(([loan, users]) => {
        if (!loan) {
          return res.status(404).send(`No se encontró el préstamo con ID: ${id}`);
        }
        res.render('loans/edit', { loan, users });
      })
      .catch((err) => res.status(500).send(`Error al cargar el préstamo para editar: ${err}`));
  }

  update(req, res) {
    const id = req.params.id;
    const updatedLoan = req.body;

    loansModel.showByID(id)
      .then((loan) => {
        if (!loan) {
          return res.status(404).send(`No se encontró el préstamo con ID: ${id}`);
        }

        const newLoan = {
          id: id,
          userId: updatedLoan.userId ? updatedLoan.userId : loan.userId,
          amount: updatedLoan.amount ? updatedLoan.amount : loan.amount,
          interestRate: updatedLoan.interestRate ? updatedLoan.interestRate : loan.interestRate,
          balance: updatedLoan.balance ? updatedLoan.balance : loan.balance,
          nextPaymentDate: updatedLoan.nextPaymentDate ? new Date(updatedLoan.nextPaymentDate) : loan.nextPaymentDate,
          createdAt: loan.createdAt,
        };

        return loansModel.edit(newLoan, id)
          .then(() => res.redirect(`/loans/${id}`))
          .catch((err) => res.status(500).send(`Error al editar el préstamo: ${err}`));
      })
      .catch((err) => res.status(500).send(`Error al editar el préstamo: ${err}`));
  }


  delete(req, res) {
    const id = req.params.id;

    loansModel.delete(id)
      .then((result) => {
        if (!result) {
          return res.status(404).send(`No se encontró el préstamo con ID: ${id}`);
        }
        res.redirect('/loans');
      })
      .catch((err) => res.status(500).send(`Error al eliminar el préstamo: ${err}`));
  }

  getNextPaymentDate(req, res) {
    const id = req.params.id;
    loansModel.showByID(id)
      .then((loan) => {
        if (!loan) {
          return res.status(404).send(`No se encontró el préstamo con ID: ${id}`);
        }
        const date = loan.nextPaymentDate;
        const id = loan.id;
        res.status(200).render("next-payment-date");
        res.render('next-payment-date', { id, date });
      })
      .catch((err) => res.status(500).send(`Error al buscar el préstamo: ${err}`));
  }
}

module.exports = new LoansController();