export default function createProject(sequelize, DataTypes) {
  const Project = sequelize.define(
    'project',
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      visibility: {
        type: DataTypes.ENUM('PRIVATE', 'MEMBER', 'PUBLIC'),
        allowNull: false,
        defaultValue: 'PRIVATE',
      },
      done: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: 'Project',
      timestamps: true,
    },
  );

  Project.associate = ({ User, Member, TaskGroup }) => {
    Project.Owner = Project.belongsTo(User, { as: 'owner' });
    Project.Members = Project.belongsToMany(User, { through: Member });
    Project.TaskGroups = Project.hasMany(TaskGroup);
  };

  return Project;
}
