import { Sequelize, DataTypes } from 'sequelize';
import { IModels } from '../../graphql/interfaces';

export default function createGroup(
  sequelize: Sequelize,
  DataTypes: DataTypes,
) {
  const Group = sequelize.define(
    'group',
    {
      title: DataTypes.STRING,
    },
    {
      tableName: 'Group',
      timestamps: true,
    },
  );

  // FIXME
  const _Group = Group as any;
  _Group.associate = ({ User, Project }: IModels) => {
    _Group.Owner = Group.belongsTo(User, { as: 'owner' });
    _Group.Projects = Group.hasMany(Project);
  };

  return Group;
}
