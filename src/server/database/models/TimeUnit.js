export default function createTimeUnit(sequelize, DataTypes) {
  const TimeUnit = sequelize.define(
    'timeUnit',
    {
      description: DataTypes.TEXT,
      wholeDay: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      startAt: DataTypes.DATE,
      endAt: DataTypes.DATE,
    },
    {
      tableName: 'TimeUnit',
      timestamps: true,
    },
  );

  TimeUnit.associate = ({ Task, User }) => {
    TimeUnit.Owner = TimeUnit.belongsTo(User, { as: 'owner' });
    TimeUnit.Tasks = TimeUnit.hasMany(Task);
  };

  return TimeUnit;
}
