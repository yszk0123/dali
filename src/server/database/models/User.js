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

  User.associate = ({ TimeUnit, Member, Project }) => {
    User.Projects = User.hasMany(Project);
    User.TimeUnits = User.hasMany(TimeUnit);
    User.Members = User.belongsToMany(Project, { through: Member });
  };

  return User;
}
