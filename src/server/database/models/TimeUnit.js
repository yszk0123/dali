export default function createTimeUnit(sequelize, DataTypes) {
  const TimeUnit = sequelize.define(
    'timeUnit',
    {
      position: DataTypes.INTEGER,
    },
    {
      timestamps: true,
    },
  );

  TimeUnit.associate = ({ TaskUnit }) => {
    TimeUnit.TaskUnits = TimeUnit.belongsToMany(TaskUnit, {
      through: 'timeUnitTaskUnit',
    });
  };

  return TimeUnit;
}
