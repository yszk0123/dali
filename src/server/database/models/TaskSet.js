export default function createTaskSet(sequelize, DataTypes) {
  const TaskSet = sequelize.define(
    'taskSet',
    {
      title: DataTypes.TEXT,
      startAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      endAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: new Date(10000, 0, 0, 0),
      },
      routine: {
        type: DataTypes.ENUM,
        values: ['EVERYDAY', 'WEEKDAY', 'WEEKEND'],
        allowNull: true,
        defaultValue: null,
      },
      priority: {
        type: DataTypes.ENUM,
        values: ['EMERGENCY', 'HIGH', 'LOW'],
        allowNull: true,
        defaultValue: null,
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
