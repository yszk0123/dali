export default function createTaskGroup(sequelize, DataTypes) {
  const TaskGroup = sequelize.define(
    'taskGroup',
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
      tableName: 'TaskGroup',
      timestamps: true,
    },
  );

  TaskGroup.associate = ({ Task, Project, User }) => {
    TaskGroup.Owner = TaskGroup.belongsTo(User, { as: 'owner' });
    TaskGroup.Project = TaskGroup.belongsTo(Project);
    TaskGroup.Tasks = TaskGroup.hasMany(Task);
  };

  return TaskGroup;
}
