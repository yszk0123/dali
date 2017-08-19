import { Sequelize, DataTypes } from 'sequelize';
import { IModels } from '../../graphql/interfaces';

export default function createTaskGroup(
  sequelize: Sequelize,
  DataTypes: DataTypes,
) {
  const TaskGroup = sequelize.define(
    'taskGroup',
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
      tableName: 'TaskGroup',
      timestamps: true,
    },
  );

  // FIXME
  const _TaskGroup = TaskGroup as any;
  _TaskGroup.associate = ({ Task, Project, User }: IModels) => {
    _TaskGroup.Owner = TaskGroup.belongsTo(User, { as: 'owner' });
    _TaskGroup.Project = TaskGroup.belongsTo(Project);
    _TaskGroup.Tasks = TaskGroup.hasMany(Task);
  };

  return TaskGroup;
}
