import { Sequelize, DataTypes } from 'sequelize';
import { IModels } from '../../graphql/interfaces';

export default function createMember(
  sequelize: Sequelize,
  DataTypes: DataTypes,
) {
  const Member = sequelize.define(
    'member',
    {
      authority: {
        type: DataTypes.ENUM('OWNER', 'EDITABLE', 'READONLY'),
        allowNull: false,
        defaultValue: 'READONLY',
      },
    },
    {
      tableName: 'Member',
      timestamps: true,
    },
  );

  // FIXME
  const _Member = Member as any;
  _Member.associate = ({ User, Project }: IModels) => {
    _Member.User = Member.belongsTo(User);
    _Member.Project = Member.belongsTo(Project);
  };

  return Member;
}
