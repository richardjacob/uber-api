'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('ThreadItems', 'authorId', {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.addColumn('ThreadItems', 'userId', {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.addColumn('ThreadItems', 'message', { type: Sequelize.TEXT })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('ThreadItems', 'authorId'),
      queryInterface.removeColumn('ThreadItems', 'userId'),
      queryInterface.removeColumn('ThreadItems', 'message')
    ])
  }
};