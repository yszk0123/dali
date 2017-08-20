import { FakeAuthService } from '../src/server/express';
import generateFakeData from '../src/server/generateFakeData';
import { createSchema } from '../src/server/graphql';
import { connectDatabase } from '../src/server/database';
import graphql from './graphqlForTest';
import gql from './fakeGraphQLTag';

describe('server', () => {
  let sequelize;
  let models;
  let schema;
  let contextValue;

  beforeAll(async () => {
    const result = await connectDatabase();
    sequelize = result.sequelize;
    models = result.models;
    schema = createSchema({ models });
    await sequelize.truncate({ cascade: true });
  });

  beforeEach(async () => {
    contextValue = {
      session: {},
      User: models.User,
      AuthService: FakeAuthService,
    };
  });

  it('succeeds', async () => {
    await generateFakeData({ sequelize, models });

    const query = gql`
      query TestQuery {
        projects {
          title
        }
      }
    `;
    const data = await graphql(schema, query, null, contextValue);

    expect(data).toEqual({
      data: {
        projects: [{ title: 'Work' }, { title: 'Private' }],
      },
    });
  });

  describe('Phase', () => {
    beforeEach(async () => {
      contextValue.user = await models.User.create({
        email: 'test',
        password: 'test',
        nickname: 'test',
        firstName: 'test',
        lastName: 'test',
      });
    });

    it('moves task to task group', async () => {
      const { data: { phaseA, phaseB } } = await graphql(
        schema,
        gql`
          mutation {
            phaseA: createPhase(title: "phaseA") {
              id
            }
            phaseB: createPhase(title: "phaseB") {
              id
            }
          }
        `,
        null,
        contextValue,
      );

      const { data: { createTask: oldTask } } = await graphql(
        schema,
        gql`
          mutation {
            createTask(title: "task", phaseId: "${phaseA.id}") {
              id
              phase {
                id
              }
            }
          }
        `,
        null,
        contextValue,
      );

      const {
        data: {
          moveTaskToPhase: {
            task: newTask,
            sourcePhase,
            targetPhase,
          },
        },
      } = await graphql(
        schema,
        gql`
          mutation {
            moveTaskToPhase(taskId: "${oldTask.id}", phaseId: "${phaseB.id}") {
              task {
                id
                phase {
                  id
                }
              }
              sourcePhase {
                id
              }
              targetPhase {
                id
              }
            }
          }
        `,
        null,
        contextValue,
      );

      expect(sourcePhase.id).toEqual(phaseA.id);
      expect(targetPhase.id).toEqual(phaseB.id);
      expect(oldTask.phase.id).toEqual(phaseA.id);
      expect(newTask.phase.id).toEqual(phaseB.id);
    });

    it('adds task group to project', async () => {
      const { data: { phase, oldProject } } = await graphql(
        schema,
        gql`
          mutation {
            phase: createPhase(title: "phase") {
              id
              project {
                id
              }
            }
            oldProject: createProject(title: "project") {
              id
            }
          }
        `,
        null,
        contextValue,
      );

      const { data: { addPhaseToProject: newProject } } = await graphql(
        schema,
        gql`
          mutation {
            addPhaseToProject(
              phaseId: "${phase.id}",
              projectId: "${oldProject.id}"
            ) {
              id
              phases {
                id
              }
            }
          }
        `,
        null,
        contextValue,
      );

      expect(phase.project).toBeNull();
      expect(
        newProject.phases.find(phase => phase.id === phase.id),
      ).toBeTruthy();
    });
  });

  describe('Task', () => {
    let user;

    beforeEach(async () => {
      contextValue.user = user = await models.User.create({
        email: 'test',
        password: 'test',
        nickname: 'test',
        firstName: 'test',
        lastName: 'test',
      });
    });

    it('search tasks', async () => {
      const group = await models.Phase.create({
        ownerId: user.id,
        title: 'group',
      });

      const { data: { task1, task2 } } = await graphql(
        schema,
        gql`
          mutation {
            task2: createTask(title: "task2", phaseId: "${group.id}") {
              id
            }
            task1: createTask(title: "task1", phaseId: "${group.id}") {
              id
            }
          }
        `,
        null,
        contextValue,
      );

      const { data: { tasks: tasksByNameAsc } } = await graphql(
        schema,
        gql`
          query {
            tasks(orderBy: { field: TITLE, direction: ASC }) {
              id
            }
          }
        `,
        null,
        contextValue,
      );
      const { data: { tasks: tasksByNameDesc } } = await graphql(
        schema,
        gql`
          query {
            tasks(orderBy: { field: TITLE, direction: DESC }) {
              id
            }
          }
        `,
        null,
        contextValue,
      );

      expect(tasksByNameAsc).toEqual([{ id: task1.id }, { id: task2.id }]);
      expect(tasksByNameDesc).toEqual([{ id: task2.id }, { id: task1.id }]);
    });

    it('adds task to task group', async () => {
      const [groupA, groupB] = await Promise.all([
        models.Phase.create({ ownerId: user.id, title: 'group a' }),
        models.Phase.create({ ownerId: user.id, title: 'group b' }),
      ]);

      const { data: { oldTask } } = await graphql(
        schema,
        gql`
          mutation {
            oldTask: createTask(title: "task", phaseId: "${groupA.id}") {
              id
              phase {
                id
              }
            }
          }
        `,
        null,
        contextValue,
      );

      const {
        data: {
          addTaskToPhase: { task: newTask, phase: newPhase },
        },
      } = await graphql(
        schema,
        gql`
          mutation {
            addTaskToPhase(
              taskId: "${oldTask.id}",
              phaseId: "${groupB.id}"
            ) {
              task {
                id
                phase {
                  id
                }
              }
              phase {
                id
                tasks {
                  id
                }
              }
            }
          }
        `,
        null,
        contextValue,
      );

      expect(oldTask.phase.id).toEqual(String(groupA.id));
      expect(newTask.phase.id).toEqual(String(groupB.id));
      expect(
        newPhase.tasks.find(task => task.id === newTask.id),
      ).toBeTruthy();
    });
  });

  afterEach(async () => {
    await sequelize.truncate({ cascade: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
