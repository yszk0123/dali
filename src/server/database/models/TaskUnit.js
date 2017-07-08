export default function createTaskUnit(sequelize, DataTypes) {
  const TaskUnit = sequelize.define(
    'taskUnit',
    {
      title: DataTypes.TEXT,
      doneAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
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
