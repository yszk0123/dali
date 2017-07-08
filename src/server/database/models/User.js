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

  User.associate = ({ TaskUnit, TimeUnit, Project, DailyReport }) => {
    User.DailyReports = User.hasMany(DailyReport);
    User.Projects = User.hasMany(Project);
    User.TaskUnits = User.hasMany(TaskUnit);
    User.TimeUnits = User.hasMany(TimeUnit);
  };

  return User;
}
