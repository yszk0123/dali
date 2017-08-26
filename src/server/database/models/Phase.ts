import { Sequelize, DataTypes } from 'sequelize';
import { IModels } from '../../graphql/interfaces';

export default function createPhase(
  sequelize: Sequelize,
  DataTypes: DataTypes,
) {
  const Phase = sequelize.define(
    'phase',
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
      tableName: 'Phase',
      timestamps: true,
    },
  );

  // FIXME
  const _Phase = Phase as any;
  _Phase.associate = ({ Task, Project, User }: IModels) => {
    _Phase.Owner = Phase.belongsTo(User, { as: 'owner' });
    _Phase.Project = Phase.belongsTo(Project);
    _Phase.Tasks = Phase.hasMany(Task);
  };

  return Phase;
}
