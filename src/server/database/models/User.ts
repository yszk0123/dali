import { Sequelize, DataTypes } from 'sequelize';
import { IModels } from '../../graphql/interfaces';

export default function createUser(sequelize: Sequelize, DataTypes: DataTypes) {
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

  // FIXME
  const _User = User as any;
  _User.associate = ({ Action, Task, Period, Member, Project }: IModels) => {
    _User.Actions = User.hasMany(Action, { foreignKey: 'ownerId' });
    _User.Tasks = User.hasMany(Task, { foreignKey: 'ownerId' });
    _User.Projects = User.hasMany(Project, { foreignKey: 'ownerId' });
    _User.Periods = User.hasMany(Period, { foreignKey: 'ownerId' });
    _User.Members = User.belongsToMany(Project, { through: Member });
  };

  return User;
}
