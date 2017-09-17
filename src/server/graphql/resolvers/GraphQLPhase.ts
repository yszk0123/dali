import { Sequelize } from 'sequelize';
import { camelCase, omitBy, isUndefined } from 'lodash';
import { ISource, IResolvers, IModels, IContext } from '../interfaces';
import { resolver } from '../utils';

interface Input {
  models: IModels;
}

export default function createResolvers({
  models: { Phase, Task, Project },
}: Input): IResolvers {
  return {
    Phase: {
      owner: resolver(Phase.Owner),
      project: resolver(Phase.Project),
      tasks: resolver(Phase.Tasks, {
        before: (findOptions: any, { used }: any, context: IContext) => {
          const where = { ...findOptions.where };

          if (used != null) {
            Object.assign(where, { timeUnitId: used ? { $not: null } : null });
          }

          findOptions.where = where;

          return findOptions;
        },
      }),
    },
    Query: {
      phases: resolver(Phase, {
        list: true,
        before: (findOptions: any, { groupId }: any, context: IContext) => {
          const where = { ...findOptions.where };

          if (groupId != null) {
            findOptions.include = [{ model: Project, where: { groupId } }];
          }

          findOptions.where = where;

          return findOptions;
        },
      }),
    },
    Mutation: {
      createPhase: async (
        source,
        { title, description, done, projectId },
        { user },
      ) => {
        return await Phase.create({
          ownerId: user.id,
          title,
          description,
          done,
          projectId,
        });
      },
      updatePhase: async (
        source,
        { phaseId, title, description, done, projectId },
        { user },
      ) => {
        const phase = await Phase.findOne({
          where: { id: phaseId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await phase.update(
          omitBy({ title, description, done, projectId }, isUndefined),
        );

        return phase;
      },
      removePhase: async (source, { phaseId }, { user }) => {
        const phase = await Phase.findOne({
          where: { id: phaseId, ownerId: user.id },
          rejectOnEmpty: true,
        });

        await phase.destroy();

        return { removedPhaseId: phaseId };
      },
      moveTaskToPhase: async (root, { taskId, phaseId }, { user }) => {
        const task = await Task.findById(taskId, {
          where: { ownerId: user.id },
          rejectOnEmpty: true,
        });
        const sourcePhase = await task.getPhase();
        const targetPhase = await Phase.findById(phaseId, {
          where: { ownerId: user.id },
          rejectOnEmpty: true,
        });

        await task.setPhase(targetPhase);

        return { task, sourcePhase, targetPhase };
      },
      setProjectToPhase: async (root, { phaseId, projectId }, { user }) => {
        const phase = await Phase.findById(phaseId, {
          where: { ownerId: user.id },
          rejectOnEmpty: true,
        });
        const project = await Project.findById(projectId, {
          where: { ownerId: user.id },
          rejectOnEmpty: true,
        });

        await phase.setProject(project);

        return phase;
      },
    },
  };
}
