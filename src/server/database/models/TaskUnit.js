export default function createTaskUnit(sequelize, DataTypes) {
  const TaskUnit = sequelize.define(
    'taskUnit',
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
      createdAt: DataTypes.DATE,
      modifiedAt: DataTypes.DATE,
    },
    {
      timestamps: true,
    },
  );

  TaskUnit.associate = ({ TimeUnit, Project }) => {
    TaskUnit.Project = TaskUnit.belongsTo(Project);
    TaskUnit.TimeUnits = TaskUnit.belongsToMany(TimeUnit, {
      through: 'timeUnitTaskUnit',
    });
  };

  return TaskUnit;
}
