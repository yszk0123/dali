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

  TimeUnit.associate = ({ DailySchedule, TaskSet }) => {
    TimeUnit.DailySchedule = TimeUnit.belongsTo(DailySchedule);
    TimeUnit.TaskSets = TimeUnit.belongsToMany(TaskSet, {
      through: 'timeUnitTaskSet',
    });
  };

  return TimeUnit;
}
