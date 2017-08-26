import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import { PhaseItem_phaseFragment, PhaseItem_projectsFragment } from 'schema';
import { DropTarget, DropTargetSpec, ConnectDropTarget } from 'react-dnd';
import styled, { ThemedProps } from '../styles/StyledComponents';
import Icon from '../components/Icon';
import TitleInput from '../components/TitleInput';
import * as CreateTaskMutation from '../../graphql/mutations/CreateTaskMutation';
import * as RemovePhaseMutation from '../../graphql/mutations/RemovePhaseMutation';
import * as UpdatePhaseMutation from '../../graphql/mutations/UpdatePhaseMutation';
import * as SetProjectToPhaseMutation from '../../graphql/mutations/SetProjectToPhaseMutation';
import * as MoveTaskToPhaseMutation from '../../graphql/mutations/MoveTaskToPhaseMutation';
import ItemTypes from '../constants/ItemTypes';
import TitlePlaceholder from '../components/TitlePlaceholder';
import TitleSelect from '../components/TitleSelect';
import DoneCheckbox from '../components/DoneCheckbox';
import TaskItem from './TaskItem';

const Wrapper = styled.div`
  padding-top: 0.4rem;
  border-top: 1px solid #e4eaf7;
  background: ${({ isOver }: ThemedProps<{ isOver: boolean }>) =>
    isOver ? '#c0e3fb' : 'inherit'};
`;

interface OwnProps {
  projects: (PhaseItem_projectsFragment | null)[] | null;
  phase: PhaseItem_phaseFragment;
}

type Props = OwnProps & {
  createTask(title: string): void;
  removePhase: React.MouseEventHandler<HTMLElement>;
  updateTitle(_: { title: string }): void;
  toggleDone(): void;
  setProject(projectId: string | null): void;
  moveTaskToPhase(taskId: string, phaseId: string): void;
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
};

export function PhaseItem({
  projects,
  phase,
  removePhase,
  updateTitle,
  toggleDone,
  setProject,
  connectDropTarget,
  isOver,
}: Props) {
  const projectTitle = phase.project && phase.project.title;

  return connectDropTarget(
    <div>
      <Wrapper isOver={isOver}>
        <DoneCheckbox done={phase.done} onChange={toggleDone} />
        <TitleInput title={phase.title} onChange={updateTitle} />
        <span> (</span>
        <TitleSelect
          selectedId={phase.project && phase.project.id}
          onChange={setProject}
          items={projects || []}
        />
        <span>) </span>
        <Icon icon="trash" onClick={removePhase} />
      </Wrapper>
      {phase.tasks &&
        phase.tasks.map(
          task =>
            task && <TaskItem key={task.id} task={task} phaseId={phase.id} />,
        )}
    </div>,
  );
}

const taskTarget: DropTargetSpec<Props> = {
  drop: ({ phase, moveTaskToPhase }, monitor) => {
    if (!monitor || !phase) {
      return;
    }

    if (monitor.didDrop()) {
      return;
    }

    const { taskId } = monitor.getItem() as any;
    if (phase.tasks && phase.tasks.find(task => !!task && task.id === taskId)) {
      return { canMove: false };
    }

    moveTaskToPhase(taskId, phase.id);

    return { canMove: true, toTimeUnitId: phase.id };
  },
};

const withData = compose(
  graphql<Response, OwnProps, Props>(CreateTaskMutation.mutation, {
    props: ({ mutate, ownProps: { phase } }) => ({
      createTask: (title: string) =>
        mutate &&
        mutate(
          CreateTaskMutation.buildMutationOptions(
            { title },
            { done: false },
            { phaseId: phase.id },
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(RemovePhaseMutation.mutation, {
    props: ({ mutate, ownProps: { phase } }) => ({
      removePhase: () =>
        mutate &&
        mutate(
          RemovePhaseMutation.buildMutationOptions(
            { phaseId: phase.id },
            { done: false },
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(UpdatePhaseMutation.mutation, {
    props: ({ mutate, ownProps: { phase } }) => ({
      updateTitle: (input: { title: string }) =>
        mutate &&
        mutate(
          UpdatePhaseMutation.buildMutationOptions(
            { ...input, phaseId: phase.id },
            { done: false },
            phase,
          ),
        ),
      toggleDone: () =>
        mutate &&
        mutate(
          UpdatePhaseMutation.buildMutationOptions(
            { done: !phase.done, phaseId: phase.id },
            { done: false },
            phase,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(SetProjectToPhaseMutation.mutation, {
    props: ({ mutate, ownProps: { phase } }) => ({
      setProject: (projectId: string | null) =>
        projectId &&
        mutate &&
        mutate(
          SetProjectToPhaseMutation.buildMutationOptions(
            { phaseId: phase.id, projectId },
            { done: false },
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(MoveTaskToPhaseMutation.mutation, {
    props: ({ mutate, ownProps: { phase } }) => ({
      moveTaskToPhase: (taskId: string, phaseId: string) =>
        mutate &&
        mutate(
          MoveTaskToPhaseMutation.buildMutationOptions({ taskId, phaseId }, {}),
        ),
    }),
  }),
  DropTarget(ItemTypes.TASK_UNIT, taskTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({ shallow: true }),
  })),
);

export default withData(PhaseItem);
