'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.changeColumn('DailySchedule', 'date', {
      type: Sequelize.DATEONLY,
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.changeColumn('DailySchedule', 'date', {
      type: Sequelize.DATE,
      unique: true,
    });
  },
};
