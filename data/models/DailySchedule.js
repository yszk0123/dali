export default function createDailySchedule(sequelize, DataTypes) {
  const DailySchedule = sequelize.define(
    'dailySchedule',
    {
      date: DataTypes.DATE,
    },
    {
      timestamps: true,
    },
  );

  DailySchedule.associate = ({ TimeUnit, DailyReport }) => {
    DailySchedule.DailyReport = DailySchedule.hasOne(DailyReport);
    DailySchedule.TimeUnits = DailySchedule.hasMany(TimeUnit);
  };

  return DailySchedule;
}
