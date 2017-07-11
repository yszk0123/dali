export default function createTaskUnit(sequelize, DataTypes) {
  const TaskUnit = sequelize.define(
    'taskUnit',
    {
      title: DataTypes.TEXT,
      done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      createdAt: DataTypes.DATE,
      modifiedAt: DataTypes.DATE,
    },
    {
      timestamps: true,
    },
  );

  TaskUnit.associate = ({ TimeUnit, TaskSet }) => {
    TaskUnit.TimeUnit = TaskUnit.belongsTo(TimeUnit);
    TaskUnit.TaskSet = TaskUnit.belongsTo(TaskSet);
  };

  return TaskUnit;
}
