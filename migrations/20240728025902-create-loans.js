'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('loans', {
      id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.CHAR(36),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      interestRate: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      nextPaymentDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      capital: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      interestPaid: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('loans');
  },
};
