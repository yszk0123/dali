import { Sequelize, DataTypes } from 'sequelize';
import { IModels } from '../../graphql/interfaces';

export default function createTimeUnit(
  sequelize: Sequelize,
  DataTypes: DataTypes,
) {
  const TimeUnit = sequelize.define(
    'timeUnit',
    {
      description: DataTypes.TEXT,
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      position: DataTypes.INTEGER,
    },
    {
      tableName: 'TimeUnit',
      timestamps: true,
    },
  );

  // FIXME
  const _TimeUnit = TimeUnit as any;
  _TimeUnit.associate = ({ Task, User }: IModels) => {
    _TimeUnit.Owner = TimeUnit.belongsTo(User, { as: 'owner' });
    _TimeUnit.Tasks = TimeUnit.hasMany(Task);
  };

  return TimeUnit;
}
