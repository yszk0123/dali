import { camelCase, omitBy, isUndefined } from 'lodash';
import { IResolvers, IModels, IContext } from '../interfaces';
import { resolver } from '../utils';

interface Input {
  models: IModels;
}

export default function createResolvers({
  models: { Group, Project },
}: Input): IResolvers {
  return {
    Group: {
      owner: resolver(Group.Owner),
      projects: resolver(Group.Projects),
    },
    Query: {
      groups: resolver(Group, { list: true }),
    },
    Mutation: {
      createGroup: async (root, { title }, { user }) => {
        return await Group.create({
          ownerId: user.id,
          title,
        });
      },
      updateGroup: async (root, { groupId, title }, { user }) => {
        const group = await Group.findOne({
          where: { id: groupId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await group.update(omitBy({ title, groupId }, isUndefined));

        return group;
      },
      removeGroup: async (root, { groupId }, { user }) => {
        const group = await Group.findOne({
          where: { id: groupId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await group.destroy();

        return { removedGroupId: groupId };
      },
      addProjectToGroup: async (root, { projectId, groupId }, { user }) => {
        const project = await Project.findById(projectId, {
          where: { ownerId: user.id },
          rejectOnEmpty: true,
        });
        const group = await Group.findById(groupId, {
          where: { ownerId: user.id },
          rejectOnEmpty: true,
        });

        await group.addProject(project);

        return group;
      },
    },
  };
}
