export default function createUser(sequelize, DataTypes) {
  const User = sequelize.define(
    'user',
    {
      name: DataTypes.STRING,
    },
    {
      timestamps: true,
    },
  );

  User.associate = ({
    TaskUnit,
    TimeUnit,
    Project,
    DailySchedule,
    DailyReport,
  }) => {
    User.DailyReports = User.hasMany(DailyReport);
    User.DailySchedules = User.hasMany(DailySchedule);
    User.Projects = User.hasMany(Project);
    User.TaskUnits = User.hasMany(TaskUnit);
    User.TimeUnits = User.hasMany(TimeUnit);
  };

  return User;
}
