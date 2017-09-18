module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Task', 'assigneeId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'User',
        key: 'id',
      },
    });

    await queryInterface.removeColumn('Action', 'assigneeId');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Task', 'assigneeId');

    await queryInterface.addColumn('Action', 'assigneeId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'User',
        key: 'id',
      },
    });
  },
};
