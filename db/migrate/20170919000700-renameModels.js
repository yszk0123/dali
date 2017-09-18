function renameConstraint(table, before, after) {
  return `ALTER TABLE "${table}" RENAME CONSTRAINT "${before}" TO "${after}";`;
}

function renameIndex(before, after) {
  return `ALTER INDEX "${before}" RENAME TO "${after}"`;
}

async function renameModel(queryInterface, before, after, attrs) {
  await queryInterface.renameTable(before, after);
  await queryInterface.renameTable(`${before}_id_seq`, `${after}_id_seq`);
  await queryInterface.sequelize.query(
    attrs
      .map(attr =>
        renameConstraint(
          after,
          `${before}_${attr}_fkey`,
          `${after}_${attr}_fkey`,
        ),
      )
      .join('\n'),
  );
  await queryInterface.sequelize.query(
    renameIndex(`${before}_pkey`, `${after}_pkey`),
  );
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await renameModel(queryInterface, 'Task', 'Action', [
      'assigneeId',
      'ownerId',
      'phaseId',
      'timeUnitId',
    ]);
    await renameModel(queryInterface, 'Phase', 'Task', [
      'ownerId',
      'projectId',
    ]);
    await renameModel(queryInterface, 'TimeUnit', 'Period', ['ownerId']);

    await queryInterface.renameColumn('Action', 'phaseId', 'taskId');
    await queryInterface.renameColumn('Action', 'timeUnitId', 'periodId');
    await queryInterface.sequelize.query(
      renameConstraint(
        'Action',
        'Action_timeUnitId_fkey',
        'Action_periodId_fkey',
      ),
    );
    await queryInterface.sequelize.query(
      renameConstraint(
        'Action',
        'Action_phaseId_fkey',
        'Action_taskId_fkey',
      ),
    );
    await queryInterface.sequelize.query(
      renameIndex('task_done', 'action_done'),
    );
    await queryInterface.sequelize.query(
      renameIndex('phase_done', 'task_done'),
    );
    await queryInterface.sequelize.query(
      renameIndex('time_unit_date', 'period_date'),
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      renameIndex('period_date', 'time_unit_date'),
    );
    await queryInterface.sequelize.query(
      renameIndex('task_done', 'phase_done'),
    );
    await queryInterface.sequelize.query(
      renameIndex('action_done', 'task_done'),
    );

    await queryInterface.sequelize.query(
      renameConstraint(
        'Action',
        'Action_taskId_fkey',
        'Action_phaseId_fkey',
      ),
    );
    await queryInterface.sequelize.query(
      renameConstraint(
        'Action',
        'Action_periodId_fkey',
        'Action_timeUnitId_fkey',
      ),
    );
    await queryInterface.renameColumn('Action', 'periodId', 'timeUnitId');
    await queryInterface.renameColumn('Action', 'taskId', 'phaseId');

    await renameModel(queryInterface, 'Period', 'TimeUnit', ['ownerId']);
    await renameModel(queryInterface, 'Task', 'Phase', [
      'ownerId',
      'projectId',
    ]);
    await renameModel(queryInterface, 'Action', 'Task', [
      'assigneeId',
      'ownerId',
      'phaseId',
      'timeUnitId',
    ]);
  },
};
