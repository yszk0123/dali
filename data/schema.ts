/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type UpdateActionMutationVariables = {
  actionId: string,
  title?: string | null,
  description?: string | null,
  done?: boolean | null,
  taskId?: string | null,
  periodId?: string | null,
};

export type UpdateActionMutation = {
  updateAction:  {
    id: string,
    title: string,
    task:  {
      id: string,
      title: string,
    } | null,
  } | null,
};

export type ActionPageQueryVariables = {
  actionId: string,
};

export type ActionPageQuery = {
  action:  {
    id: string,
    title: string,
    task:  {
      id: string,
      title: string,
    } | null,
  } | null,
  tasks:  Array< {
    id: string,
    title: string,
    project:  {
      id: string,
      title: string,
    } | null,
  } | null > | null,
  currentUser:  {
    id: string,
  } | null,
};

export type LogoutMutation = {
  logout:  {
    id: string,
  } | null,
};

export type AppQuery = {
  currentUser:  {
    id: string,
    nickname: string,
  } | null,
};

export type NavBarQuery = {
  currentUser:  {
    id: string,
  } | null,
};

export type RoutesQuery = {
  currentUser:  {
    id: string,
  } | null,
};

export type CreateGroupMutationVariables = {
  title: string,
};

export type CreateGroupMutation = {
  createGroup:  {
    id: string,
    title: string,
  } | null,
};

export type RemoveGroupMutationVariables = {
  groupId: string,
};

export type RemoveGroupMutation = {
  removeGroup:  {
    removedGroupId: string,
  } | null,
};

export type UpdateGroupMutationVariables = {
  groupId: string,
  title?: string | null,
};

export type UpdateGroupMutation = {
  updateGroup:  {
    id: string,
    title: string,
  } | null,
};

export type GroupPageQuery = {
  groups:  Array< {
    id: string,
    title: string,
  } | null > | null,
  currentUser:  {
    id: string,
  } | null,
};

export type LoginMutationVariables = {
  email: string,
  password: string,
};

export type LoginMutation = {
  login:  {
    id: string,
  } | null,
};

export type LoginPageQuery = {
  currentUser:  {
    id: string,
  } | null,
};

export type AddActionToPeriodMutationVariables = {
  periodId: string,
  actionId: string,
};

export type AddActionToPeriodMutation = {
  action:  {
    id: string,
    title: string,
    done: boolean,
    task:  {
      id: string,
      title: string,
      project:  {
        id: string,
        title: string,
      } | null,
    } | null,
  } | null,
};

export type CreatePeriodActionMutationVariables = {
  title: string,
  description?: string | null,
  done?: boolean | null,
  taskId: string,
  periodId?: string | null,
};

export type CreatePeriodActionMutation = {
  createAction:  {
    id: string,
    task:  {
      id: string,
      title: string,
      project:  {
        id: string,
        title: string,
      } | null,
    } | null,
    title: string,
    done: boolean,
  } | null,
};

export type CreatePeriodMutationVariables = {
  description?: string | null,
  date: string,
  position?: number | null,
};

export type CreatePeriodMutation = {
  createPeriod:  {
    id: string,
    actions:  Array< {
      id: string,
      title: string,
      done: boolean,
      task:  {
        id: string,
        title: string,
        project:  {
          id: string,
          title: string,
        } | null,
      } | null,
    } | null > | null,
    date: string,
    position: number | null,
  } | null,
};

export type MoveActionToPeriodMutationVariables = {
  actionId: string,
  periodId: string,
};

export type MoveActionToPeriodMutation = {
  moveActionToPeriod:  {
    action:  {
      id: string,
      title: string,
      done: boolean,
      task:  {
        id: string,
        title: string,
        project:  {
          id: string,
          title: string,
        } | null,
      } | null,
    } | null,
    sourcePeriod:  {
      id: string,
    } | null,
    targetPeriod:  {
      id: string,
    } | null,
  } | null,
};

export type RemovePeriodActionMutationVariables = {
  actionId: string,
  periodId?: string | null,
};

export type RemovePeriodActionMutation = {
  action:  {
    id: string,
    title: string,
    done: boolean,
    task:  {
      id: string,
      title: string,
      project:  {
        id: string,
        title: string,
      } | null,
    } | null,
  } | null,
};

export type RemovePeriodMutationVariables = {
  periodId: string,
};

export type RemovePeriodMutation = {
  removePeriod:  {
    removedPeriodId: string | null,
  } | null,
};

export type UpdatePeriodActionMutationVariables = {
  actionId: string,
  title?: string | null,
  description?: string | null,
  done?: boolean | null,
  taskId?: string | null,
  periodId?: string | null,
};

export type UpdatePeriodActionMutation = {
  updateAction:  {
    id: string,
    title: string,
    done: boolean,
    task:  {
      id: string,
      title: string,
      project:  {
        id: string,
        title: string,
      } | null,
    } | null,
  } | null,
};

export type UpdatePeriodMutationVariables = {
  description?: string | null,
  date?: string | null,
  position?: number | null,
  periodId: string,
};

export type UpdatePeriodMutation = {
  updatePeriod:  {
    id: string,
    date: string,
    position: number | null,
    actions:  Array< {
      id: string,
      title: string,
      done: boolean,
      task:  {
        id: string,
        title: string,
        project:  {
          id: string,
          title: string,
        } | null,
      } | null,
    } | null > | null,
  } | null,
};

export type AddActionToPeriodFormQuery = {
  tasks:  Array< {
    id: string,
    title: string,
    project:  {
      id: string,
      title: string,
    } | null,
    actions:  Array< {
      id: string,
      title: string,
    } | null > | null,
  } | null > | null,
  actions:  Array< {
    id: string,
    title: string,
    task:  {
      id: string,
      title: string,
    } | null,
  } | null > | null,
};

export type PeriodPageQueryVariables = {
  date?: string | null,
};

export type PeriodPageQuery = {
  periods:  Array< {
    id: string,
    date: string,
    position: number | null,
    actions:  Array< {
      id: string,
      title: string,
      done: boolean,
      task:  {
        id: string,
        title: string,
        project:  {
          id: string,
          title: string,
        } | null,
      } | null,
    } | null > | null,
  } | null > | null,
};

export type AddTaskToProjectMutationVariables = {
  taskId: string,
  projectId: string,
};

export type AddTaskToProjectMutation = {
  addTaskToProject:  {
    id: string,
    title: string,
    group:  {
      id: string,
      title: string,
    } | null,
  } | null,
};

export type CreateProjectMutationVariables = {
  title: string,
};

export type CreateProjectMutation = {
  createProject:  {
    id: string,
    title: string,
    group:  {
      id: string,
      title: string,
    } | null,
  } | null,
};

export type RemoveProjectMutationVariables = {
  projectId: string,
};

export type RemoveProjectMutation = {
  removeProject:  {
    removedProjectId: string,
  } | null,
};

export type SetGroupToProjectMutationVariables = {
  groupId: string,
  projectId: string,
};

export type SetGroupToProjectMutation = {
  setGroupToProject:  {
    id: string,
    title: string,
    group:  {
      id: string,
      title: string,
    } | null,
  } | null,
};

export type UpdateProjectMutationVariables = {
  projectId: string,
  title?: string | null,
  groupId?: string | null,
};

export type UpdateProjectMutation = {
  updateProject:  {
    id: string,
    title: string,
    group:  {
      id: string,
      title: string,
    } | null,
  } | null,
};

export type ProjectPageQuery = {
  projects:  Array< {
    id: string,
    title: string,
    group:  {
      id: string,
      title: string,
    } | null,
  } | null > | null,
  groups:  Array< {
    id: string,
    title: string,
  } | null > | null,
  currentUser:  {
    id: string,
  } | null,
};

export type ReportPageQueryVariables = {
  date: string,
};

export type ReportPageQuery = {
  periods:  Array< {
    id: string,
    date: string,
    actions:  Array< {
      id: string,
      title: string,
      done: boolean,
      task:  {
        id: string,
        title: string,
        project:  {
          id: string,
          title: string,
        } | null,
      } | null,
    } | null > | null,
  } | null > | null,
};

export type SignupMutationVariables = {
  email: string,
  password: string,
  nickname: string,
  firstName?: string | null,
  lastName?: string | null,
};

export type SignupMutation = {
  signup:  {
    id: string,
  } | null,
};

export type SignupPageQuery = {
  currentUser:  {
    id: string,
  } | null,
};

export type CreateTaskActionMutationVariables = {
  title: string,
  description?: string | null,
  done?: boolean | null,
  taskId: string,
  periodId?: string | null,
};

export type CreateTaskActionMutation = {
  createAction:  {
    id: string,
    task:  {
      id: string,
      title: string,
    } | null,
    title: string,
    done: boolean,
  } | null,
};

export type CreateTaskMutationVariables = {
  title?: string | null,
  description?: string | null,
  done?: boolean | null,
  projectId?: string | null,
  actionUsed?: boolean | null,
};

export type CreateTaskMutation = {
  createTask:  {
    id: string,
    done: boolean,
    title: string,
    project:  {
      id: string,
      title: string,
    } | null,
    actions:  Array< {
      id: string,
      title: string,
      done: boolean,
      task:  {
        id: string,
      } | null,
    } | null > | null,
  } | null,
};

export type MoveActionToTaskMutationVariables = {
  actionId: string,
  taskId: string,
};

export type MoveActionToTaskMutation = {
  moveActionToTask:  {
    action:  {
      id: string,
      title: string,
      done: boolean,
      task:  {
        id: string,
      } | null,
    } | null,
    sourceTask:  {
      id: string,
    } | null,
    targetTask:  {
      id: string,
    } | null,
  } | null,
};

export type RemoveTaskActionMutationVariables = {
  actionId: string,
};

export type RemoveTaskActionMutation = {
  removeAction:  {
    removedActionId: string | null,
  } | null,
};

export type RemoveTaskMutationVariables = {
  taskId: string,
};

export type RemoveTaskMutation = {
  removeTask:  {
    removedTaskId: string | null,
  } | null,
};

export type SetPeriodToActionMutationVariables = {
  date: string,
  position?: number | null,
  actionId: string,
};

export type SetPeriodToActionMutation = {
  setOrCreatePeriodToAction:  {
    id: string,
    title: string,
    done: boolean,
    task:  {
      id: string,
    } | null,
  } | null,
};

export type SetProjectToTaskMutationVariables = {
  taskId: string,
  projectId: string,
  actionUsed?: boolean | null,
};

export type SetProjectToTaskMutation = {
  setProjectToTask:  {
    id: string,
    title: string,
    done: boolean,
    project:  {
      id: string,
      title: string,
    } | null,
    actions:  Array< {
      id: string,
      title: string,
      done: boolean,
      task:  {
        id: string,
      } | null,
    } | null > | null,
  } | null,
};

export type UpdateTaskActionMutationVariables = {
  actionId: string,
  title?: string | null,
  description?: string | null,
  done?: boolean | null,
  taskId?: string | null,
  periodId?: string | null,
};

export type UpdateTaskActionMutation = {
  updateAction:  {
    id: string,
    title: string,
    done: boolean,
    task:  {
      id: string,
    } | null,
  } | null,
};

export type UpdateTaskMutationVariables = {
  taskId: string,
  title?: string | null,
  description?: string | null,
  done?: boolean | null,
  projectId?: string | null,
  actionUsed?: boolean | null,
};

export type UpdateTaskMutation = {
  updateTask:  {
    id: string,
    title: string,
    done: boolean,
    project:  {
      id: string,
      title: string,
    } | null,
    actions:  Array< {
      id: string,
      title: string,
      done: boolean,
      task:  {
        id: string,
      } | null,
    } | null > | null,
  } | null,
};

export type TaskPageQueryVariables = {
  groupId?: string | null,
  projectId?: string | null,
  taskDone?: boolean | null,
  actionUsed?: boolean | null,
};

export type TaskPageQuery = {
  tasks:  Array< {
    id: string,
    title: string,
    done: boolean,
    project:  {
      id: string,
      title: string,
    } | null,
    actions:  Array< {
      id: string,
      title: string,
      done: boolean,
      task:  {
        id: string,
      } | null,
    } | null > | null,
  } | null > | null,
  projects:  Array< {
    id: string,
    title: string,
  } | null > | null,
  currentUser:  {
    id: string,
  } | null,
};

export type ActionPage_actionFragment = {
  id: string,
  title: string,
  task:  {
    id: string,
    title: string,
  } | null,
};

export type ActionPage_tasksFragment = {
  id: string,
  title: string,
  project:  {
    id: string,
    title: string,
  } | null,
};

export type GroupItem_groupFragment = {
  id: string,
  title: string,
};

export type PeriodActionItem_actionFragment = {
  id: string,
  title: string,
  done: boolean,
  task:  {
    id: string,
    title: string,
    project:  {
      id: string,
      title: string,
    } | null,
  } | null,
};

export type PeriodItem_periodFragment = {
  id: string,
  date: string,
  position: number | null,
  actions:  Array< {
    id: string,
    title: string,
    done: boolean,
    task:  {
      id: string,
      title: string,
      project:  {
        id: string,
        title: string,
      } | null,
    } | null,
  } | null > | null,
};

export type AddActionToPeriodForm_tasksFragment = {
  id: string,
  title: string,
  project:  {
    id: string,
    title: string,
  } | null,
  actions:  Array< {
    id: string,
    title: string,
  } | null > | null,
};

export type AddActionToPeriodForm_actionsFragment = {
  id: string,
  title: string,
  task:  {
    id: string,
    title: string,
  } | null,
};

export type ProjectItem_projectFragment = {
  id: string,
  title: string,
  group:  {
    id: string,
    title: string,
  } | null,
};

export type ProjectItem_groupsFragment = {
  id: string,
  title: string,
};

export type TaskActionItem_actionFragment = {
  id: string,
  title: string,
  done: boolean,
  task:  {
    id: string,
  } | null,
};

export type TaskItem_taskFragment = {
  id: string,
  title: string,
  done: boolean,
  project:  {
    id: string,
    title: string,
  } | null,
  actions:  Array< {
    id: string,
    title: string,
    done: boolean,
    task:  {
      id: string,
    } | null,
  } | null > | null,
};

export type TaskItem_projectsFragment = {
  id: string,
  title: string,
};
/* tslint:enable */
