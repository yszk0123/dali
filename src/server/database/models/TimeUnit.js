export default function createTimeUnit(sequelize, DataTypes) {
  const TimeUnit = sequelize.define(
    'timeUnit',
    {
      description: DataTypes.STRING,
      wholeDay: DataTypes.BOOLEAN,
      startAt: DataTypes.DATE,
      endAt: DataTypes.DATE,
    },
    {
      tableName: 'TimeUnit',
      timestamps: true,
    },
  );

  TimeUnit.associate = ({ Task, User }) => {
    TimeUnit.Owner = TimeUnit.belongsTo(User, {
      as: 'Owner',
      foreignKEy: 'ownerId',
    });
    TimeUnit.Tasks = TimeUnit.hasMany(Task);
  };

  return TimeUnit;
}
