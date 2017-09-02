import { Sequelize, DataTypes } from 'sequelize';
import { IModels } from '../../graphql/interfaces';

export default function createProject(
  sequelize: Sequelize,
  DataTypes: DataTypes,
) {
  const Project = sequelize.define(
    'project',
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      visibility: {
        type: DataTypes.ENUM('PRIVATE', 'MEMBER', 'PUBLIC'),
        allowNull: false,
        defaultValue: 'PRIVATE',
      },
      done: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'Project',
      timestamps: true,
    },
  );

  // FIXME
  const _Project = Project as any;
  _Project.associate = ({ User, Member, Phase, Group }: IModels) => {
    _Project.Owner = Project.belongsTo(User, { as: 'owner' });
    _Project.Group = Project.belongsTo(Group);
    _Project.Members = Project.belongsToMany(User, { through: Member });
    _Project.Phases = Project.hasMany(Phase);
  };

  return Project;
}
