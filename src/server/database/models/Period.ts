import { Sequelize, DataTypes } from 'sequelize';
import { IModels } from '../../graphql/interfaces';

export default function createPeriod(
  sequelize: Sequelize,
  DataTypes: DataTypes,
) {
  const Period = sequelize.define(
    'period',
    {
      description: DataTypes.TEXT,
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      position: DataTypes.INTEGER,
    },
    {
      tableName: 'Period',
      timestamps: true,
    },
  );

  // FIXME
  const _Period = Period as any;
  _Period.associate = ({ Action, User }: IModels) => {
    _Period.Owner = Period.belongsTo(User, { as: 'owner' });
    _Period.Actions = Period.hasMany(Action);
  };

  return Period;
}
