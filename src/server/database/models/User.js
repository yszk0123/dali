export default function createUser(sequelize, DataTypes) {
  const User = sequelize.define(
    'user',
    {
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      nickname: {
        type: DataTypes.STRING,
        unique: true,
      },
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
    User.DailySchedules = User.hasMany(DailySchedule);
    User.Projects = User.hasMany(Project);
    User.TaskSets = User.hasMany(TaskSet);
    User.TimeUnits = User.hasMany(TimeUnit);
  };

  return User;
}
