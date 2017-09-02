import { camelCase, omitBy, isUndefined } from 'lodash';
import { IResolvers, IModels, IContext } from '../interfaces';
import resolver from '../utils/resolver';

interface Input {
  models: IModels;
}

export default function createResolvers({
  models: { Project, Phase, Group },
}: Input): IResolvers {
  return {
    Project: {
      owner: resolver(Project.Owner),
      group: resolver(Project.Group),
      members: resolver(Project.Members, { list: true }),
      phases: resolver(Project.Phases, { list: true }),
    },
    Query: {
      projects: resolver(Project, { list: true }),
    },
    Mutation: {
      createProject: async (root, { title, done, groupId }, { user }) => {
        return await Project.create({
          ownerId: user.id,
          title,
          done,
          groupId,
        });
      },
      updateProject: async (
        root,
        { projectId, title, done, groupId },
        { user },
      ) => {
        const project = await Project.findOne({
          where: { id: projectId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await project.update(omitBy({ title, done, groupId }, isUndefined));

        return project;
      },
      removeProject: async (root, { projectId }, { user }) => {
        const project = await Project.findOne({
          where: { id: projectId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await project.destroy();

        return { removedProjectId: projectId };
      },
      addPhaseToProject: async (root, { phaseId, projectId }, { user }) => {
        const phase = await Phase.findById(phaseId, {
          where: { ownerId: user.id },
          rejectOnEmpty: true,
        });
        const project = await Project.findById(projectId, {
          where: { ownerId: user.id },
          rejectOnEmpty: true,
        });

        await project.addPhase(phase);

        return project;
      },
      setGroupToProject: async (root, { groupId, projectId }, { user }) => {
        const group = await Group.findById(groupId, {
          where: { ownerId: user.id },
          rejectOnEmpty: true,
        });
        const project = await Project.findById(projectId, {
          where: { ownerId: user.id },
          rejectOnEmpty: true,
        });

        await project.setGroup(group);

        return project;
      },
    },
  };
}
