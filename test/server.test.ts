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

  describe('TaskGroup', () => {
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
      const { data: { taskGroupA, taskGroupB } } = await graphql(
        schema,
        gql`
          mutation {
            taskGroupA: createTaskGroup(title: "taskGroupA") {
              id
            }
            taskGroupB: createTaskGroup(title: "taskGroupB") {
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
            createTask(title: "task", taskGroupId: "${taskGroupA.id}") {
              id
              taskGroup {
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
          moveTaskToTaskGroup: {
            task: newTask,
            sourceTaskGroup,
            targetTaskGroup,
          },
        },
      } = await graphql(
        schema,
        gql`
          mutation {
            moveTaskToTaskGroup(taskId: "${oldTask.id}", taskGroupId: "${taskGroupB.id}") {
              task {
                id
                taskGroup {
                  id
                }
              }
              sourceTaskGroup {
                id
              }
              targetTaskGroup {
                id
              }
            }
          }
        `,
        null,
        contextValue,
      );

      expect(sourceTaskGroup.id).toEqual(taskGroupA.id);
      expect(targetTaskGroup.id).toEqual(taskGroupB.id);
      expect(oldTask.taskGroup.id).toEqual(taskGroupA.id);
      expect(newTask.taskGroup.id).toEqual(taskGroupB.id);
    });

    it('adds task group to project', async () => {
      const { data: { oldTaskGroup, oldProject } } = await graphql(
        schema,
        gql`
          mutation {
            oldTaskGroup: createTaskGroup(title: "taskGroup") {
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

      const {
        data: {
          addTaskGroupToProject: {
            taskGroup: newTaskGroup,
            project: newProject,
          },
        },
      } = await graphql(
        schema,
        gql`
          mutation {
            addTaskGroupToProject(
              taskGroupId: "${oldTaskGroup.id}",
              projectId: "${oldProject.id}"
            ) {
              taskGroup {
                id
                project {
                  id
                }
              }
              project {
                id
                taskGroups {
                  id
                }
              }
            }
          }
        `,
        null,
        contextValue,
      );

      expect(oldTaskGroup.project).toBeNull();
      expect(
        newProject.taskGroups.find(
          taskGroup => taskGroup.id === newTaskGroup.id,
        ),
      ).toBeTruthy();
      expect(newTaskGroup.project.id).toEqual(newProject.id);
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
      const group = await models.TaskGroup.create({
        ownerId: user.id,
        title: 'group',
      });

      const { data: { task1, task2 } } = await graphql(
        schema,
        gql`
          mutation {
            task2: createTask(title: "task2", taskGroupId: "${group.id}") {
              id
            }
            task1: createTask(title: "task1", taskGroupId: "${group.id}") {
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
        models.TaskGroup.create({ ownerId: user.id, title: 'group a' }),
        models.TaskGroup.create({ ownerId: user.id, title: 'group b' }),
      ]);

      const { data: { oldTask } } = await graphql(
        schema,
        gql`
          mutation {
            oldTask: createTask(title: "task", taskGroupId: "${groupA.id}") {
              id
              taskGroup {
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
          addTaskToTaskGroup: { task: newTask, taskGroup: newTaskGroup },
        },
      } = await graphql(
        schema,
        gql`
          mutation {
            addTaskToTaskGroup(
              taskId: "${oldTask.id}",
              taskGroupId: "${groupB.id}"
            ) {
              task {
                id
                taskGroup {
                  id
                }
              }
              taskGroup {
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

      expect(oldTask.taskGroup.id).toEqual(String(groupA.id));
      expect(newTask.taskGroup.id).toEqual(String(groupB.id));
      expect(
        newTaskGroup.tasks.find(task => task.id === newTask.id),
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
