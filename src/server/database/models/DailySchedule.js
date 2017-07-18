export default function createDailySchedule(sequelize, DataTypes) {
  const DailySchedule = sequelize.define(
    'dailySchedule',
    {
      date: {
        type: DataTypes.DATEONLY,
        unique: true,
        get() {
          const date = this.getDataValue('date');

          return new Date(date);
        },
      },
    },
    {
      tableName: 'DailySchedule',
      timestamps: true,
    },
  );

  DailySchedule.associate = ({ TimeUnit, DailyReport }) => {
    DailySchedule.DailyReport = DailySchedule.hasOne(DailyReport);
    DailySchedule.TimeUnits = DailySchedule.hasMany(TimeUnit);
  };

  return DailySchedule;
}
