export default function createTaskUnit(sequelize, DataTypes) {
  const TaskUnit = sequelize.define(
    'taskUnit',
    {
      createdAt: DataTypes.DATE,
      modifiedAt: DataTypes.DATE,
      title: DataTypes.TEXT,
      priority: {
        type: DataTypes.ENUM,
        values: ['EMERGENCY', 'HIGH', 'LOW'],
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      timestamps: true,
    },
  );

  TaskUnit.associate = ({ TimeUnit, Project }) => {
    TaskUnit.belongsTo(Project);
    TaskUnit.belongsToMany(TimeUnit, {
      through: 'TimeUnitTaskUnit',
    });
  };

  return TaskUnit;
}
