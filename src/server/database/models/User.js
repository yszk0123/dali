export default function createUser(sequelize, DataTypes) {
  const User = sequelize.define(
    'user',
    {
      name: DataTypes.STRING,
    },
    {
      tableName: 'User',
      timestamps: true,
    },
  );

  User.associate = ({
    TaskSet,
    TimeUnit,
    Project,
    DailySchedule,
    DailyReport,
  }) => {
    User.DailyReports = User.hasMany(DailyReport);
    User.DailySchedules = User.hasMany(DailySchedule);
    User.Projects = User.hasMany(Project);
    User.TaskSets = User.hasMany(TaskSet);
    User.TimeUnits = User.hasMany(TimeUnit);
  };

  return User;
}
