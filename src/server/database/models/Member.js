export default function createMember(sequelize, DataTypes) {
  const Member = sequelize.define(
    'member',
    {
      authority: {
        type: DataTypes.ENUM('OWNER', 'EDITABLE', 'READONLY'),
        defaultValue: 'READONLY',
      },
    },
    {
      tableName: 'Member',
      timestamps: true,
    },
  );

  Member.associate = ({ User, Project }) => {
    Member.User = Member.belongsTo(User);
    Member.Project = Member.belongsTo(Project);
  };

  return Member;
}
