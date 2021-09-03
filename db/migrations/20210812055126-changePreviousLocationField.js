'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('BookingLocations', 'previousLocation', { type: Sequelize.TEXT }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('BookingLocations', 'previousLocation', { type: Sequelize.STRING })
    ])
  }
};