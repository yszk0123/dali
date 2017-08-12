/* @flow */
import { resolver } from 'graphql-sequelize';
import { camelCase, omitBy, isUndefined } from 'lodash';
import type { IResolvers, IModels } from '../interfaces';

type Input = {
  models: IModels,
};

export default function createResolvers({
  models: { Project },
}: Input): IResolvers {
  return {
    Project: {
      owner: resolver(Project.User),
      members: resolver(Project.Members),
      taskGroups: resolver(Project.TaskGroups),
    },
    Query: {
      projects: resolver(Project, {
        list: true,
        before: (findOptions, { orderBy }, context) => {
          if (orderBy) {
            findOptions.order = [[camelCase(orderBy.field), orderBy.direction]];
          }

          return findOptions;
        },
      }),
    },
    Mutation: {
      createProject: async (root, { name }, { user }) => {
        return await Project.create({
          userId: user.id,
          ownerId: user.id,
          name,
        });
      },
      updateProject: async (root, { projectId, name }, { user }) => {
        const project = await Project.findOne({
          where: { id: projectId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await project.update(omitBy({ name }, isUndefined));

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
    },
  };
}
