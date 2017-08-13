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
          name
        }
      }
    `;
    const data = await graphql({
      schema,
      source: query,
      contextValue,
    });

    expect(data).toEqual({
      data: {
        projects: [{ name: 'Work' }, { name: 'Private' }],
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
      const { data: { taskGroupA, taskGroupB } } = await graphql({
        schema,
        source: gql`
          mutation {
            taskGroupA: createTaskGroup(name: "taskGroupA") {
              id
            }
            taskGroupB: createTaskGroup(name: "taskGroupB") {
              id
            }
          }
        `,
        contextValue,
      });

      const { data: { createTask: oldTask } } = await graphql({
        schema,
        source: gql`
          mutation {
            createTask(name: "task", taskGroupId: "${taskGroupA.id}") {
              id
              taskGroup {
                id
              }
            }
          }
        `,
        contextValue,
      });

      const {
        data: {
          moveTaskToTaskGroup: {
            task: newTask,
            sourceTaskGroup,
            targetTaskGroup,
          },
        },
      } = await graphql({
        schema,
        source: gql`
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
        contextValue,
      });

      expect(sourceTaskGroup.id).toEqual(taskGroupA.id);
      expect(targetTaskGroup.id).toEqual(taskGroupB.id);
      expect(oldTask.taskGroup.id).toEqual(taskGroupA.id);
      expect(newTask.taskGroup.id).toEqual(taskGroupB.id);
    });

    it('adds task group to project', async () => {
      const { data: { oldTaskGroup, oldProject } } = await graphql({
        schema,
        source: gql`
          mutation {
            oldTaskGroup: createTaskGroup(name: "taskGroup") {
              id
              project {
                id
              }
            }
            oldProject: createProject(name: "project") {
              id
            }
          }
        `,
        contextValue,
      });

      const {
        data: {
          addTaskGroupToProject: {
            taskGroup: newTaskGroup,
            project: newProject,
          },
        },
      } = await graphql({
        schema,
        source: gql`
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
        contextValue,
      });

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
        name: 'group',
      });

      const { data: { task1, task2 } } = await graphql({
        schema,
        source: gql`
          mutation {
            task2: createTask(name: "task2", taskGroupId: "${group.id}") {
              id
            }
            task1: createTask(name: "task1", taskGroupId: "${group.id}") {
              id
            }
          }
        `,
        contextValue,
      });

      const { data: { tasks: tasksByNameAsc } } = await graphql({
        schema,
        source: gql`
          query {
            tasks(orderBy: { field: NAME, direction: ASC }) {
              id
            }
          }
        `,
        contextValue,
      });
      const { data: { tasks: tasksByNameDesc } } = await graphql({
        schema,
        source: gql`
          query {
            tasks(orderBy: { field: NAME, direction: DESC }) {
              id
            }
          }
        `,
        contextValue,
      });

      expect(tasksByNameAsc).toEqual([{ id: task1.id }, { id: task2.id }]);
      expect(tasksByNameDesc).toEqual([{ id: task2.id }, { id: task1.id }]);
    });

    it('adds task to task group', async () => {
      const [groupA, groupB] = await Promise.all([
        models.TaskGroup.create({ ownerId: user.id, name: 'group a' }),
        models.TaskGroup.create({ ownerId: user.id, name: 'group b' }),
      ]);

      const { data: { oldTask } } = await graphql({
        schema,
        source: gql`
          mutation {
            oldTask: createTask(name: "task", taskGroupId: "${groupA.id}") {
              id
              taskGroup {
                id
              }
            }
          }
        `,
        contextValue,
      });

      const {
        data: {
          addTaskToTaskGroup: { task: newTask, taskGroup: newTaskGroup },
        },
      } = await graphql({
        schema,
        source: gql`
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
        contextValue,
      });

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
