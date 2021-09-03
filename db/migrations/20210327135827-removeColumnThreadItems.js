'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('ThreadItems', 'sentBy'),
      queryInterface.removeColumn('ThreadItems', 'sendTo'),
      queryInterface.removeColumn('ThreadItems', 'content'),
      queryInterface.removeColumn('ThreadItems', 'bookingId'),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('ThreadItems', 'sentBy', {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.addColumn('ThreadItems', 'sendTo', {
        type: Sequelize.STRING,
        allowNull: false
      }),
      queryInterface.addColumn('ThreadItems', 'content', { type: Sequelize.TEXT }),
      queryInterface.addColumn('ThreadItems', 'bookingId', {
        type: Sequelize.INTEGER,
        allowNull: false
      })
    ]);
  }
};
