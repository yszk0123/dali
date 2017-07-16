export default function createTaskSet(sequelize, DataTypes) {
  const TaskSet = sequelize.define(
    'taskSet',
    {
      title: DataTypes.STRING,
      done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      priority: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: 'TaskSet',
      timestamps: true,
    },
  );

  TaskSet.associate = ({ TaskUnit, Project }) => {
    TaskSet.Project = TaskSet.belongsTo(Project);
    TaskSet.TaskUnits = TaskSet.hasMany(TaskUnit);
  };

  return TaskSet;
}
