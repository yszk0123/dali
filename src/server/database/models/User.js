export default function createUser(sequelize, DataTypes) {
  const User = sequelize.define(
    'user',
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      nickname: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
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
