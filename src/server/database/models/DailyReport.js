export default function createDailyReport(sequelize, DataTypes) {
  const DailyReport = sequelize.define(
    'dailyReport',
    {
      text: DataTypes.TEXT,
    },
    {
      timestamps: true,
    },
  );

  DailyReport.associate = ({ User }) => {
    DailyReport.User = DailyReport.belongsTo(User);
  };

  return DailyReport;
}
