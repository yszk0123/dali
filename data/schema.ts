/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type CreateProjectMutationMutationVariables = {
  title: string,
};

export type CreateProjectMutationMutation = {
  createProject:  {
    __typename: "Project",
    id: string,
    title: string,
  } | null,
};

export type RemoveProjectMutationMutationVariables = {
  projectId: string,
};

export type RemoveProjectMutationMutation = {
  removeProject:  {
    removedProjectId: string,
  } | null,
};

export type UpdateProjectMutationMutationVariables = {
  projectId: string,
  title: string,
};

export type UpdateProjectMutationMutation = {
  updateProject:  {
    id: string,
    title: string,
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

export type ProjectItem_projectFragment = {
  id: string,
  title: string,
};
/* tslint:enable */
