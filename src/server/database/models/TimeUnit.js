export default function createTimeUnit(sequelize, DataTypes) {
  const TimeUnit = sequelize.define(
    'timeUnit',
    {
      title: DataTypes.STRING,
      position: DataTypes.INTEGER,
    },
    {
      tableName: 'TimeUnit',
      timestamps: true,
      indexes: [
        {
          fields: ['dailyScheduleId', 'position'],
          unique: true,
        },
      ],
    },
  );

  TimeUnit.associate = ({ DailySchedule, TaskUnit }) => {
    TimeUnit.DailySchedule = TimeUnit.belongsTo(DailySchedule);
    TimeUnit.TaskUnits = TimeUnit.hasMany(TaskUnit);
  };

  return TimeUnit;
}
