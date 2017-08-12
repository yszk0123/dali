export default function createTask(sequelize, DataTypes) {
  const Task = sequelize.define(
    'task',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.STRING,
      done: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'Task',
      timestamps: true,
    },
  );

  Task.associate = ({ TimeUnit, TaskGroup, User }) => {
    Task.Owner = Task.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
    Task.Assignee = Task.belongsTo(User, {
      as: 'assignee',
      foreignKey: 'assigneeId',
    });
    Task.TaskGroup = Task.belongsTo(TaskGroup);
    Task.TimeUnit = Task.belongsTo(TimeUnit, {
      as: 'timeUnit',
      foreignKey: 'timeUnitId',
    });
  };

  return Task;
}
