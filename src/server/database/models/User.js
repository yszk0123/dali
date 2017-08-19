export default function createUser(sequelize, DataTypes) {
  const User = sequelize.define(
    'user',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
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

  User.associate = ({ Task, TaskGroup, TimeUnit, Member, Project }) => {
    User.Tasks = User.hasMany(Task, { foreignKey: 'ownerId' });
    User.TaskGroups = User.hasMany(TaskGroup, { foreignKey: 'ownerId' });
    User.Projects = User.hasMany(Project, { foreignKey: 'ownerId' });
    User.TimeUnits = User.hasMany(TimeUnit, { foreignKey: 'ownerId' });
    User.Members = User.belongsToMany(Project, { through: Member });
  };

  return User;
}
