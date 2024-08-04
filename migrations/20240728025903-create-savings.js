'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('savings', {
      id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      interestRate: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
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
    await queryInterface.dropTable('savings');
  },
};