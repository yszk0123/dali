import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import {
  PhaseItem_phaseFragment,
  PhaseItem_projectsFragment,
  TaskItem_taskFragment,
} from 'schema';
import { DropTarget, DropTargetSpec, ConnectDropTarget } from 'react-dnd';
import styled, { ThemedProps } from '../styles/StyledComponents';
import Icon from '../components/Icon';
import TitleInput from '../components/TitleInput';
import * as CreatePhaseTaskMutation from '../../graphql/mutations/CreatePhaseTaskMutation';
import * as RemovePhaseMutation from '../../graphql/mutations/RemovePhaseMutation';
import * as UpdatePhaseMutation from '../../graphql/mutations/UpdatePhaseMutation';
import * as SetProjectToPhaseMutation from '../../graphql/mutations/SetProjectToPhaseMutation';
import * as MoveTaskToPhaseMutation from '../../graphql/mutations/MoveTaskToPhaseMutation';
import * as RemovePhaseTaskMutation from '../../graphql/mutations/RemovePhaseTaskMutation';
import ItemTypes from '../constants/ItemTypes';
import TitlePlaceholder from '../components/TitlePlaceholder';
import TitleSelect from '../components/TitleSelect';
import DoneCheckbox from '../components/DoneCheckbox';
import PhaseTaskItem from './PhaseTaskItem';

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

const PhaseTaskItemWrapper = styled.div`margin-left: 1rem;`;

const TrashIcon = styled(Icon)`float: right;`;

const TitleInputWrapper = styled.div`margin-top: 0.8rem;`;

interface OwnProps {
  projects: (PhaseItem_projectsFragment | null)[] | null;
  phase: PhaseItem_phaseFragment;
}

type Props = OwnProps & {
  createTask(title: string): void;
  removePhase: React.MouseEventHandler<HTMLElement>;
  removeTask(task: TaskItem_taskFragment): void;
  updateTitle(title: string): void;
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
  removeTask,
  createTask,
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
        <Header>
          <DoneCheckbox done={phase.done} onChange={toggleDone} />
          <HeaderMain>
            <TitleSelect
              selectedId={phase.project && phase.project.id}
              onChange={setProject}
              items={projects || []}
            />
            {'>'}
            <TitleInput
              defaultLabel="Project"
              title={phase.title}
              onChange={updateTitle}
            />
          </HeaderMain>
          <TrashIcon large icon="trash" onClick={removePhase} />
        </Header>
        {phase.tasks &&
          phase.tasks.map(
            task =>
              task &&
              <PhaseTaskItemWrapper key={task.id}>
                <PhaseTaskItem
                  task={task}
                  phaseId={phase.id}
                  remove={removeTask}
                />
              </PhaseTaskItemWrapper>,
          )}
        <TitleInputWrapper>
          <TitleInput
            defaultLabel="New Task"
            title=""
            fullWidth
            onChange={createTask}
          />
        </TitleInputWrapper>
      </Wrapper>
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
  graphql<Response, OwnProps, Props>(RemovePhaseTaskMutation.mutation, {
    props: ({ mutate, ownProps: { phase } }) => ({
      removeTask: (task: TaskItem_taskFragment) =>
        mutate &&
        mutate(
          RemovePhaseTaskMutation.buildMutationOptions(
            { taskId: task.id },
            { phaseDone: false, taskUsed: false },
            phase,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(CreatePhaseTaskMutation.mutation, {
    props: ({ mutate, ownProps: { phase } }) => ({
      createTask: (title: string) =>
        mutate &&
        mutate(
          CreatePhaseTaskMutation.buildMutationOptions(
            { title, phaseId: phase.id },
            { phaseDone: false, taskUsed: false },
            phase,
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
            { phaseDone: false, taskUsed: false },
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(UpdatePhaseMutation.mutation, {
    props: ({ mutate, ownProps: { phase } }) => ({
      updateTitle: (title: string) =>
        mutate &&
        mutate(
          UpdatePhaseMutation.buildMutationOptions(
            { title, phaseId: phase.id },
            { phaseDone: false, taskUsed: false },
            phase,
          ),
        ),
      toggleDone: () =>
        mutate &&
        mutate(
          UpdatePhaseMutation.buildMutationOptions(
            { done: !phase.done, phaseId: phase.id },
            { phaseDone: false, taskUsed: false },
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
            { phaseDone: false, taskUsed: false },
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(MoveTaskToPhaseMutation.mutation, {
    props: ({ mutate, ownProps: { phase } }) => ({
      moveTaskToPhase: (taskId: string, phaseId: string) =>
        mutate &&
        mutate(
          MoveTaskToPhaseMutation.buildMutationOptions(
            { taskId, phaseId },
            { phaseDone: false, taskUsed: false },
          ),
        ),
    }),
  }),
  DropTarget(ItemTypes.TASK, taskTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver({ shallow: true }),
  })),
);

export default withData(PhaseItem);
