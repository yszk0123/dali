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

  User.associate = ({ TaskUnit, Project, DailySchedule, DailyReport }) => {
    User.hasMany(DailyReport);
    User.hasMany(DailySchedule);
    User.hasMany(Project);
    User.hasMany(TaskUnit);
  };

  return User;
}
