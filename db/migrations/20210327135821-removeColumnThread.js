'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Threads', 'messageUpdatedDate'),
      queryInterface.removeColumn('Threads', 'riderUnreadCount'),
      queryInterface.removeColumn('Threads', 'driverUnreadCount')
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Threads', 'messageUpdatedDate', {
        type: Sequelize.DATE
      }),
      queryInterface.addColumn('Threads', 'riderUnreadCount', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }),
      queryInterface.addColumn('Threads', 'driverUnreadCount', {
        type: Sequelize.INTEGER,
        defaultValue: 0
      })
    ]);
  }
};
