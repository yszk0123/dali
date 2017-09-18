import { Sequelize, DataTypes } from 'sequelize';
import { IModels } from '../../graphql/interfaces';

export default function createAction(sequelize: Sequelize, DataTypes: DataTypes) {
  const Action = sequelize.define(
    'action',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: DataTypes.TEXT,
      done: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'Action',
      timestamps: true,
    },
  );

  // FIXME
  const _Action = Action as any;
  _Action.associate = ({ Period, Task, User }: IModels) => {
    _Action.Owner = Action.belongsTo(User, { as: 'owner' });
    _Action.Assignee = Action.belongsTo(User, { as: 'assignee' });
    _Action.Task = Action.belongsTo(Task);
    _Action.Period = Action.belongsTo(Period, { as: 'period' });
  };

  return Action;
}
