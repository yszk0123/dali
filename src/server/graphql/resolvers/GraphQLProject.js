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
      owner: resolver(Project.Owner),
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
    },
  };
}
