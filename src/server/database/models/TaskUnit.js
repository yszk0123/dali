export default function createTaskUnit(sequelize, DataTypes) {
  const TaskUnit = sequelize.define(
    'taskUnit',
    {
      done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'TaskUnit',
      timestamps: true,
    },
  );

  TaskUnit.associate = ({ TimeUnit, TaskSet }) => {
    TaskUnit.TimeUnit = TaskUnit.belongsTo(TimeUnit);
    TaskUnit.TaskSet = TaskUnit.belongsTo(TaskSet);
  };

  return TaskUnit;
}
