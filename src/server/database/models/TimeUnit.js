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

  TimeUnit.associate = ({ DailySchedule, TaskUnit }) => {
    TimeUnit.DailySchedule = TimeUnit.belongsTo(DailySchedule);
    TimeUnit.TaskUnits = TimeUnit.hasMany(TaskUnit);
  };

  return TimeUnit;
}
