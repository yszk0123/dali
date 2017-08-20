/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type AddPhaseToProjectMutationVariables = {
  phaseId: string,
  projectId: string,
};

export type AddPhaseToProjectMutation = {
  addPhaseToProject:  {
    id: string,
    title: string,
  } | null,
};

export type CreatePhaseMutationVariables = {
  title?: string | null,
  description?: string | null,
  done?: boolean | null,
  projectId?: string | null,
};

export type CreatePhaseMutation = {
  createPhase:  {
    id: string,
    done: boolean | null,
    title: string,
    project:  {
      id: string,
      title: string,
    } | null,
    tasks:  Array< {
      id: string,
      title: string,
      done: boolean | null,
    } | null > | null,
  } | null,
};

export type CreateProjectMutationVariables = {
  title: string,
};

export type CreateProjectMutation = {
  createProject:  {
    id: string,
    title: string,
  } | null,
};

export type CreateTaskMutationVariables = {
  title: string,
  description?: string | null,
  done?: boolean | null,
  phaseId?: string | null,
  timeUnitId?: string | null,
};

export type CreateTaskMutation = {
  createTask:  {
    id: string,
    phase:  {
      id: string,
      title: string,
    } | null,
    title: string,
    done: boolean | null,
  } | null,
};

export type CreateTimeUnitMutationVariables = {
  description?: string | null,
  date: string,
  position?: number | null,
};

export type CreateTimeUnitMutation = {
  createTimeUnit:  {
    id: string,
    tasks:  Array< {
      id: string,
      title: string,
      done: boolean | null,
    } | null > | null,
    description: string | null,
    date: string,
    position: number | null,
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

export type LogoutMutation = {
  logout:  {
    id: string,
  } | null,
};

export type RemovePhaseMutationVariables = {
  phaseId: string,
};

export type RemovePhaseMutation = {
  removePhase:  {
    removedPhaseId: string | null,
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

export type RemoveTaskMutationVariables = {
  taskId: string,
};

export type RemoveTaskMutation = {
  removeTask:  {
    removedTaskId: string | null,
  } | null,
};

export type RemoveTimeUnitMutationVariables = {
  timeUnitId: string,
};

export type RemoveTimeUnitMutation = {
  removeTimeUnit:  {
    removedTimeUnitId: string | null,
  } | null,
};

export type SetProjectToPhaseMutationVariables = {
  phaseId: string,
  projectId: string,
};

export type SetProjectToPhaseMutation = {
  setProjectToPhase:  {
    id: string,
    title: string,
    done: boolean | null,
    project:  {
      id: string,
      title: string,
    } | null,
    tasks:  Array< {
      id: string,
      title: string,
      done: boolean | null,
    } | null > | null,
  } | null,
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

export type UpdatePhaseMutationVariables = {
  phaseId: string,
  title?: string | null,
  description?: string | null,
  done?: boolean | null,
  projectId?: string | null,
};

export type UpdatePhaseMutation = {
  updatePhase:  {
    id: string,
    title: string,
    done: boolean | null,
    project:  {
      id: string,
      title: string,
    } | null,
    tasks:  Array< {
      id: string,
      title: string,
      done: boolean | null,
    } | null > | null,
  } | null,
};

export type UpdateProjectMutationVariables = {
  projectId: string,
  title: string,
};

export type UpdateProjectMutation = {
  updateProject:  {
    id: string,
    title: string,
  } | null,
};

export type UpdateTaskMutationVariables = {
  taskId: string,
  title?: string | null,
  description?: string | null,
  done?: boolean | null,
  phaseId?: string | null,
  timeUnitId?: string | null,
};

export type UpdateTaskMutation = {
  updateTask:  {
    id: string,
    title: string,
    done: boolean | null,
  } | null,
};

export type UpdateTimeUnitMutationVariables = {
  description?: string | null,
  date?: string | null,
  position?: number | null,
  timeUnitId: string,
};

export type UpdateTimeUnitMutation = {
  updateTimeUnit:  {
    id: string,
    description: string | null,
    date: string,
    position: number | null,
    tasks:  Array< {
      id: string,
      title: string,
      done: boolean | null,
    } | null > | null,
  } | null,
};

export type AppQuery = {
  currentUser:  {
    id: string,
    nickname: string,
  } | null,
};

export type LoginPageQuery = {
  currentUser:  {
    id: string,
  } | null,
};

export type NavBarQuery = {
  currentUser:  {
    id: string,
  } | null,
};

export type ProjectsPageQuery = {
  projects:  Array< {
    id: string,
    title: string,
  } | null > | null,
  currentUser:  {
    id: string,
  } | null,
};

export type RoutesQuery = {
  currentUser:  {
    id: string,
  } | null,
};

export type SchedulePageQueryVariables = {
  date?: string | null,
};

export type SchedulePageQuery = {
  timeUnits:  Array< {
    id: string,
    description: string | null,
    date: string,
    position: number | null,
    tasks:  Array< {
      id: string,
      title: string,
      done: boolean | null,
    } | null > | null,
  } | null > | null,
};

export type SignupPageQuery = {
  currentUser:  {
    id: string,
  } | null,
};

export type TasksPageQueryVariables = {
  done?: boolean | null,
};

export type TasksPageQuery = {
  phases:  Array< {
    id: string,
    title: string,
    done: boolean | null,
    project:  {
      id: string,
      title: string,
    } | null,
    tasks:  Array< {
      id: string,
      title: string,
      done: boolean | null,
    } | null > | null,
  } | null > | null,
  currentUser:  {
    id: string,
  } | null,
};

export type ProjectItem_projectFragment = {
  id: string,
  title: string,
};

export type TaskItem_taskFragment = {
  id: string,
  title: string,
  done: boolean | null,
};

export type PhaseItem_phaseFragment = {
  id: string,
  title: string,
  done: boolean | null,
  project:  {
    id: string,
    title: string,
  } | null,
  tasks:  Array< {
    id: string,
    title: string,
    done: boolean | null,
  } | null > | null,
};

export type TimeUnitItem_timeUnitFragment = {
  id: string,
  description: string | null,
  date: string,
  position: number | null,
  tasks:  Array< {
    id: string,
    title: string,
    done: boolean | null,
  } | null > | null,
};
/* tslint:enable */
