export default function createTaskGroup(sequelize, DataTypes) {
  const TaskGroup = sequelize.define(
    'taskGroup',
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
      tableName: 'TaskGroup',
      timestamps: true,
    },
  );

  TaskGroup.associate = ({ Task, Project, User }) => {
    TaskGroup.Owner = TaskGroup.belongsTo(User, {
      as: 'owner',
      foreignKey: 'ownerId',
    });
    TaskGroup.Project = TaskGroup.belongsTo(Project);
    TaskGroup.Tasks = TaskGroup.hasMany(Task, {
      foreignKey: 'taskGroupId',
    });
  };

  return TaskGroup;
}
