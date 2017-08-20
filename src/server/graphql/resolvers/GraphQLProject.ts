import { resolver } from 'graphql-sequelize';
import { camelCase, omitBy, isUndefined } from 'lodash';
import { IResolvers, IModels, IContext } from '../interfaces';

interface Input {
  models: IModels;
}

export default function createResolvers({
  models: { Project, Phase },
}: Input): IResolvers {
  return {
    Project: {
      owner: resolver(Project.Owner),
      members: resolver(Project.Members),
      phases: resolver(Project.Phases),
    },
    Query: {
      projects: resolver(Project, {
        list: true,
        before: (findOptions: any, { orderBy }: any, context: IContext) => {
          if (orderBy) {
            findOptions.order = [[camelCase(orderBy.field), orderBy.direction]];
          }

          return findOptions;
        },
      }),
    },
    Mutation: {
      createProject: async (root, { title }, { user }) => {
        return await Project.create({
          ownerId: user.id,
          title,
        });
      },
      updateProject: async (root, { projectId, title }, { user }) => {
        const project = await Project.findOne({
          where: { id: projectId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await project.update(omitBy({ title }, isUndefined));

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
      addPhaseToProject: async (
        root,
        { phaseId, projectId },
        { user },
      ) => {
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
    },
  };
}
