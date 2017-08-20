import { Sequelize, DataTypes } from 'sequelize';
import { IModels } from '../../graphql/interfaces';

export default function createTask(sequelize: Sequelize, DataTypes: DataTypes) {
  const Task = sequelize.define(
    'task',
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
      tableName: 'Task',
      timestamps: true,
    },
  );

  // FIXME
  const _Task = Task as any;
  _Task.associate = ({ TimeUnit, TaskGroup, User }: IModels) => {
    _Task.Owner = Task.belongsTo(User, { as: 'owner' });
    _Task.Assignee = Task.belongsTo(User, { as: 'assignee' });
    _Task.TaskGroup = Task.belongsTo(TaskGroup);
    _Task.TimeUnit = Task.belongsTo(TimeUnit, { as: 'timeUnit' });
  };

  return Task;
}
