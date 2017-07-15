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
      indexes: [
        {
          fields: ['timeUnitId', 'taskSetId'],
          unique: true,
        },
      ],
    },
  );

  TaskUnit.associate = ({ TimeUnit, TaskSet }) => {
    TaskUnit.TaskSet = TaskUnit.belongsTo(TaskSet);
    TaskUnit.TimeUnit = TaskUnit.belongsTo(TimeUnit);
  };

  return TaskUnit;
}
