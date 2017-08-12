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

  return Member;
}
