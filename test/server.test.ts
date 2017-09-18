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

  it('fails before login', async () => {
    const { user } = await generateFakeData({ sequelize, models });

    const query = gql`
      query TestQuery {
        projects {
          title
        }
      }
    `;

    await expect(graphql(schema, query, null, contextValue)).rejects.toEqual(
      new Error('Current user not found'),
    );
  });

  it('succeeds after login', async () => {
    const { user } = await generateFakeData({ sequelize, models });
    contextValue.user = user;

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

  describe('Task', () => {
    beforeEach(async () => {
      contextValue.user = await models.User.create({
        email: 'test',
        password: 'test',
        nickname: 'test',
        firstName: 'test',
        lastName: 'test',
      });
    });

    it('moves action to task', async () => {
      const { data: { taskA, taskB } } = await graphql(
        schema,
        gql`
          mutation {
            taskA: createTask(title: "taskA") {
              id
            }
            taskB: createTask(title: "taskB") {
              id
            }
          }
        `,
        null,
        contextValue,
      );

      const { data: { createAction: oldAction } } = await graphql(
        schema,
        gql`
          mutation {
            createAction(title: "action", taskId: "${taskA.id}") {
              id
              task {
                id
              }
            }
          }
        `,
        null,
        contextValue,
      );

      const {
        data: { moveActionToTask: { action: newAction, sourceTask, targetTask } },
      } = await graphql(
        schema,
        gql`
          mutation {
            moveActionToTask(actionId: "${oldAction.id}", taskId: "${taskB.id}") {
              action {
                id
                task {
                  id
                }
              }
              sourceTask {
                id
              }
              targetTask {
                id
              }
            }
          }
        `,
        null,
        contextValue,
      );

      expect(sourceTask.id).toEqual(taskA.id);
      expect(targetTask.id).toEqual(taskB.id);
      expect(oldAction.task.id).toEqual(taskA.id);
      expect(newAction.task.id).toEqual(taskB.id);
    });

    it('adds task to project', async () => {
      const { data: { task: oldTask, oldProject } } = await graphql(
        schema,
        gql`
          mutation {
            task: createTask(title: "task") {
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

      const { data: { addTaskToProject: newProject } } = await graphql(
        schema,
        gql`
          mutation {
            addTaskToProject(
              taskId: "${oldTask.id}",
              projectId: "${oldProject.id}"
            ) {
              id
              tasks {
                id
              }
            }
          }
        `,
        null,
        contextValue,
      );

      expect(oldTask.project).toBeNull();
      expect(
        newProject.tasks.find(task => task.id === oldTask.id),
      ).toBeTruthy();
    });
  });

  describe('Action', () => {
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

    it('search actions', async () => {
      const task = await models.Task.create({
        ownerId: user.id,
        title: 'task',
      });

      const { data: { action1, action2 } } = await graphql(
        schema,
        gql`
          mutation {
            action2: createAction(title: "action2", taskId: "${task.id}") {
              id
            }
            action1: createAction(title: "action1", taskId: "${task.id}") {
              id
            }
          }
        `,
        null,
        contextValue,
      );

      const { data: { actions: actionsByNameAsc } } = await graphql(
        schema,
        gql`
          query {
            actions(orderBy: { field: TITLE, direction: ASC }) {
              id
            }
          }
        `,
        null,
        contextValue,
      );
      const { data: { actions: actionsByNameDesc } } = await graphql(
        schema,
        gql`
          query {
            actions(orderBy: { field: TITLE, direction: DESC }) {
              id
            }
          }
        `,
        null,
        contextValue,
      );

      expect(actionsByNameAsc).toEqual([{ id: action1.id }, { id: action2.id }]);
      expect(actionsByNameDesc).toEqual([{ id: action2.id }, { id: action1.id }]);
    });

    it('set task to action', async () => {
      const [taskA, taskB] = await Promise.all([
        models.Task.create({ ownerId: user.id, title: 'task a' }),
        models.Task.create({ ownerId: user.id, title: 'task b' }),
      ]);

      const { data: { oldAction } } = await graphql(
        schema,
        gql`
          mutation {
            oldAction: createAction(title: "action", taskId: "${taskA.id}") {
              id
              task {
                id
              }
            }
          }
        `,
        null,
        contextValue,
      );

      const { data: { setTaskToAction: newAction } } = await graphql(
        schema,
        gql`
          mutation {
            setTaskToAction(
              actionId: "${oldAction.id}",
              taskId: "${taskB.id}"
            ) {
              id
              task {
                id
              }
            }
          }
        `,
        null,
        contextValue,
      );

      expect(oldAction.task.id).toEqual(String(taskA.id));
      expect(newAction.task.id).toEqual(String(taskB.id));
    });
  });

  afterEach(async () => {
    await sequelize.truncate({ cascade: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
