module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('User', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      password: Sequelize.STRING,
      nickname: {
        type: Sequelize.STRING,
        unique: true,
      },
      firstName: Sequelize.STRING,
      lastName: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    await queryInterface.createTable('DailySchedule', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      date: {
        type: Sequelize.DATE,
        unique: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    await queryInterface.createTable('DailyReport', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      text: Sequelize.TEXT,
      dailyScheduleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'DailySchedule',
          key: 'id',
        },
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    await queryInterface.createTable('Project', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: Sequelize.STRING,
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    await queryInterface.createTable('TaskSet', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: Sequelize.STRING,
      done: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      priority: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      projectId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Project',
          key: 'id',
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    await queryInterface.createTable('TimeUnit', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: Sequelize.STRING,
      position: Sequelize.INTEGER,
      dailyScheduleId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'DailySchedule',
          key: 'id',
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    await queryInterface.addConstraint(
      'TimeUnit',
      ['dailyScheduleId', 'position'],
      {
        type: 'unique',
      },
    );

    await queryInterface.createTable('TaskUnit', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      done: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      taskSetId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'TaskSet',
          key: 'id',
        },
      },
      timeUnitId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'TimeUnit',
          key: 'id',
        },
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });

    await queryInterface.addConstraint(
      'TaskUnit',
      ['timeUnitId', 'taskSetId'],
      {
        type: 'unique',
      },
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TaskUnit');
    await queryInterface.dropTable('TimeUnit');
    await queryInterface.dropTable('TaskSet');
    await queryInterface.dropTable('Project');
    await queryInterface.dropTable('DailyReport');
    await queryInterface.dropTable('DailySchedule');
    await queryInterface.dropTable('User');
  },
};
