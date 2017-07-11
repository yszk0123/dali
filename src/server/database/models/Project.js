export default function createProject(sequelize, DataTypes) {
  const Project = sequelize.define(
    'project',
    {
      title: DataTypes.TEXT,
    },
    {
      timestamps: true,
    },
  );

  Project.associate = ({ TaskSet }) => {
    Project.TaskSets = Project.hasMany(TaskSet);
  };

  return Project;
}
