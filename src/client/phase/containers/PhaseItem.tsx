import * as React from 'react';
import { graphql, compose, QueryProps, ChildProps } from 'react-apollo';
import {
  PhasePageQueryVariables,
  PhaseItem_phaseFragment,
  PhaseItem_projectsFragment,
  PhaseTaskItem_taskFragment,
} from 'schema';
import { DropTarget, DropTargetSpec, ConnectDropTarget } from 'react-dnd';
import styled, { ThemedProps } from '../../shared/styles/StyledComponents';
import Icon from '../../shared/components/Icon';
import TitleInput from '../../shared/components/TitleInput';
import * as CreatePhaseTaskMutation from '../mutations/CreatePhaseTaskMutation';
import * as RemovePhaseMutation from '../mutations/RemovePhaseMutation';
import * as UpdatePhaseMutation from '../mutations/UpdatePhaseMutation';
import * as SetProjectToPhaseMutation from '../mutations/SetProjectToPhaseMutation';
import * as MoveTaskToPhaseMutation from '../mutations/MoveTaskToPhaseMutation';
import * as RemovePhaseTaskMutation from '../mutations/RemovePhaseTaskMutation';
import ItemTypes from '../../shared/constants/ItemTypes';
import TitlePlaceholder from '../../shared/components/TitlePlaceholder';
import TitleSelect from '../../shared/components/TitleSelect';
import DoneCheckbox from '../../shared/components/DoneCheckbox';
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

const PhaseTaskItemWrapper = styled.div`margin-left: 1.6rem;`;

const TrashIcon = styled(Icon)`float: right;`;

const TitleInputWrapper = styled.div`
  margin-left: 5.6rem;
  margin-top: 0.8rem;
`;

interface OwnProps {
  projects: (PhaseItem_projectsFragment | null)[] | null;
  phase: PhaseItem_phaseFragment;
  queryVariables: PhasePageQueryVariables;
}

type Props = OwnProps & {
  createTask(title: string): void;
  removePhase: React.MouseEventHandler<HTMLElement>;
  removeTask(task: PhaseTaskItem_taskFragment): void;
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
  queryVariables,
  isOver,
}: Props) {
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
              task && (
                <PhaseTaskItemWrapper key={task.id}>
                  <PhaseTaskItem
                    task={task}
                    phaseId={phase.id}
                    remove={removeTask}
                    queryVariables={queryVariables}
                  />
                </PhaseTaskItemWrapper>
              ),
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
    props: ({ mutate, ownProps: { phase, queryVariables } }) => ({
      removeTask: (task: PhaseTaskItem_taskFragment) =>
        mutate &&
        mutate(
          RemovePhaseTaskMutation.buildMutationOptions(
            { taskId: task.id },
            queryVariables,
            phase,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(CreatePhaseTaskMutation.mutation, {
    props: ({ mutate, ownProps: { phase, queryVariables } }) => ({
      createTask: (title: string) =>
        mutate &&
        mutate(
          CreatePhaseTaskMutation.buildMutationOptions(
            { title, phaseId: phase.id },
            queryVariables,
            phase,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(RemovePhaseMutation.mutation, {
    props: ({ mutate, ownProps: { phase, queryVariables } }) => ({
      removePhase: () =>
        mutate &&
        mutate(
          RemovePhaseMutation.buildMutationOptions(
            { phaseId: phase.id },
            queryVariables,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(UpdatePhaseMutation.mutation, {
    props: ({ mutate, ownProps: { phase, queryVariables } }) => ({
      updateTitle: (title: string) =>
        mutate &&
        mutate(
          UpdatePhaseMutation.buildMutationOptions(
            { title, phaseId: phase.id },
            queryVariables,
            phase,
          ),
        ),
      toggleDone: () =>
        mutate &&
        mutate(
          UpdatePhaseMutation.buildMutationOptions(
            { done: !phase.done, phaseId: phase.id },
            queryVariables,
            phase,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(SetProjectToPhaseMutation.mutation, {
    props: ({ mutate, ownProps: { phase, queryVariables } }) => ({
      setProject: (projectId: string | null) =>
        projectId &&
        mutate &&
        mutate(
          SetProjectToPhaseMutation.buildMutationOptions(
            { phaseId: phase.id, projectId },
            queryVariables,
          ),
        ),
    }),
  }),
  graphql<Response, OwnProps, Props>(MoveTaskToPhaseMutation.mutation, {
    props: ({ mutate, ownProps: { phase, queryVariables } }) => ({
      moveTaskToPhase: (taskId: string, phaseId: string) =>
        mutate &&
        mutate(
          MoveTaskToPhaseMutation.buildMutationOptions(
            { taskId, phaseId },
            queryVariables,
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