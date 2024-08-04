'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cooperatives', {
      id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      feeAmount: { // Monto de la cuota
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      currentFee: { // Cuota actual
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      numberOfMembers: { // Número de miembros
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      paymentFrequency: { // Frecuencia de pago
        type: Sequelize.ENUM('semanal', 'quincenal', 'mensual'),
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cooperatives');
  },
};