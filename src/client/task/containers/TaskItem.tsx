import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import {
  TaskPageQueryVariables,
  TaskItem_taskFragment,
  TaskItem_projectsFragment,
  TaskActionItem_actionFragment,
} from 'schema';
import { DropTarget, DropTargetSpec, ConnectDropTarget } from 'react-dnd';
import { styled, ThemedProps } from '../../shared/styles';
import {
  Icon,
  TitleInput,
  TitlePlaceholder,
  TitleSelect,
  DoneCheckbox,
} from '../../shared/components';
import {
  CreateTaskAction,
  RemoveTask,
  UpdateTask,
  SetProjectToTask,
  RemoveTaskAction,
  MoveActionToTask,
} from '../mutations';
import { ItemTypes } from '../../shared/constants';
import TaskActionItem from './TaskActionItem';

const Wrapper = styled.div`
  padding: 1.2rem 1.4rem;
  background: ${({ isOver }: ThemedProps<{ isOver: boolean }>) =>
    isOver ? '#c0e3fb' : 'inherit'};
  font-size: 1.6rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const HeaderMain = styled.div`flex-grow: 1;`;

const TaskActionItemWrapper = styled.div`margin-left: 1.6rem;`;

const TrashIcon = styled(Icon)`float: right;`;

const TitleInputWrapper = styled.div`
  margin-left: 5.6rem;
  margin-top: 0.8rem;
`;

interface OwnProps {
  projects: (TaskItem_projectsFragment | null)[] | null;
  task: TaskItem_taskFragment;
  queryVariables: TaskPageQueryVariables;
}

type Props = OwnProps & {
  createAction(title: string): void;
  removeTask: React.MouseEventHandler<HTMLElement>;
  removeAction(action: TaskActionItem_actionFragment): void;
  updateTitle(title: string): void;
  toggleDone(): void;
  setProject(projectId: string | null): void;
  moveActionToTask(actionId: string, taskId: string): void;
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
};

export function TaskItem({
  projects,
  task,
  removeTask,
  removeAction,
  createAction,
  updateTitle,
  toggleDone,
  setProject,
  connectDropTarget,
  queryVariables,
  isOver,
}: Props) {
  return connectDropTarget(
    <div>
      <Wrapper isOver={isOver}>
        <Header>
          <DoneCheckbox done={task.done} onChange={toggleDone} />
          <HeaderMain>
            <TitleSelect
              selectedId={task.project && task.project.id}
              onChange={setProject}
              items={projects || []}
            />
            {'>'}
            <TitleInput
              defaultLabel="Project"
              title={task.title}
              onChange={updateTitle}
            />
          </HeaderMain>
          <TrashIcon large icon="trash" onClick={removeTask} />
        </Header>
        {task.actions &&
          task.actions.map(
            action =>
              action && (
                <TaskActionItemWrapper key={action.id}>
                  <TaskActionItem
                    action={action}
                    taskId={task.id}
                    remove={removeAction}
                    queryVariables={queryVariables}
                  />
                </TaskActionItemWrapper>
              ),
          )}
        <TitleInputWrapper>
          <TitleInput
            defaultLabel="New Action"
            title=""
            fullWidth
            onChange={createAction}
          />
        </TitleInputWrapper>
      </Wrapper>
    </div>,
  );
}

const actionTarget: DropTargetSpec<Props> = {
  drop: ({ task, moveActionToTask }, monitor) => {
    if (!monitor || !task) {
      return;
    }

    if (monitor.didDrop()) {
      return;
    }

    const { actionId } = monitor.getItem() as any;
    if (
      task.actions &&
      task.actions.find(action => !!action && action.id === actionId)
    ) {
      return { canMove: false };
    }

    moveActionToTask(actionId, task.id);

    return { canMove: true, toPeriodId: task.id };
  },
};

const withData = compose(
  graphql<Response, OwnProps, Props>(RemoveTaskAction.mutation, {
    props: ({ mutate, ownProps: { task, queryVariables } }) => ({
      removeAction: (action: TaskActionItem_actionFragment) =>
        mutate &&
        mutate(
          RemoveTaskAction.build({ actionId: action.id }, queryVariables, task),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(CreateTaskAction.mutation, {
    props: ({ mutate, ownProps: { task, queryVariables } }) => ({
      createAction: (title: string) =>
        mutate &&
        mutate(
          CreateTaskAction.build(
            { title, taskId: task.id },
            queryVariables,
            task,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(RemoveTask.mutation, {
    props: ({ mutate, ownProps: { task, queryVariables } }) => ({
      removeTask: () =>
        mutate && mutate(RemoveTask.build({ taskId: task.id }, queryVariables)),
    }),
  }),
  graphql<Response, OwnProps, Props>(UpdateTask.mutation, {
    props: ({ mutate, ownProps: { task, queryVariables } }) => ({
      updateTitle: (title: string) =>
        mutate &&
        mutate(
          UpdateTask.build({ title, taskId: task.id }, queryVariables, task),
        ),
      toggleDone: () =>
        mutate &&
        mutate(
          UpdateTask.build(
            { done: !task.done, taskId: task.id },
            queryVariables,
            task,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(SetProjectToTask.mutation, {
    props: ({ mutate, ownProps: { task, queryVariables } }) => ({
      setProject: (projectId: string | null) =>
        projectId &&
        mutate &&
        mutate(
          SetProjectToTask.build(
            { taskId: task.id, projectId },
            queryVariables,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(MoveActionToTask.mutation, {
    props: ({ mutate, ownProps: { task, queryVariables } }) => ({
      moveActionToTask: (actionId: string, taskId: string) =>
        mutate &&
        mutate(MoveActionToTask.build({ actionId, taskId }, queryVariables)),
    }),
  }),
  DropTarget(ItemTypes.action, actionTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({ shallow: true }),
  })),
);

export default withData(TaskItem);
