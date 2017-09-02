module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Group', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
        onDelete: 'cascade',
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    await queryInterface.addColumn('Project', 'groupId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Group',
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Project', 'groupId');
    await queryInterface.dropTable('Group');
  },
};
