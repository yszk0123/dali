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

  Project.associate = ({ TaskUnit }) => {
    Project.hasMany(TaskUnit);
  };

  return Project;
}
