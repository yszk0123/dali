module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('Phase', ['done']);
    await queryInterface.addIndex('Task', ['done']);
    await queryInterface.addIndex('TimeUnit', ['date']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('TimeUnit', ['date']);
    await queryInterface.removeIndex('Task', ['done']);
    await queryInterface.removeIndex('Phase', ['done']);
  },
};
