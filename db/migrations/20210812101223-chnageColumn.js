'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('User', 'userType', {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1
      })
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('User', 'userType', {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1
      })
    ])
  }
};