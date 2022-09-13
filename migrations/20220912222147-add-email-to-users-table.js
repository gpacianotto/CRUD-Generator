'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([queryInterface.addColumn(
      'users',
      'fireBaseEmail',
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      }
    )])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

     return Promise.all([
      queryInterface.removeColumn('users', 'fireBaseEmail')
     ])
  }
};
