export default function createTask(sequelize, DataTypes) {
  const Task = sequelize.define(
    'task',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
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
    Task.Owner = Task.belongsTo(User, { as: 'owner' });
    Task.Assignee = Task.belongsTo(User, { as: 'assignee' });
    Task.TaskGroup = Task.belongsTo(TaskGroup);
    Task.TimeUnit = Task.belongsTo(TimeUnit, { as: 'timeUnit' });
  };

  return Task;
}
