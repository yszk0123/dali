export default function createDailyReport(sequelize, DataTypes) {
  const DailyReport = sequelize.define(
    'dailyReport',
    {
      text: DataTypes.TEXT,
    },
    {
      tableName: 'DailyReport',
      timestamps: true,
    },
  );

  DailyReport.associate = ({ DailySchedule }) => {
    DailyReport.DailySchedule = DailyReport.belongsTo(DailySchedule);
  };

  return DailyReport;
}
