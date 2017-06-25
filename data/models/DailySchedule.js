export default function createDailySchedule(sequelize, DataTypes) {
  const DailySchedule = sequelize.define(
    'dailySchedule',
    {
      position: DataTypes.INTEGER,
    },
    {
      timestamps: true,
    },
  );

  DailySchedule.associate = ({ TimeUnit, DailyReport }) => {
    DailySchedule.hasOne(DailyReport);
    DailySchedule.hasMany(TimeUnit);
  };

  return DailySchedule;
}
