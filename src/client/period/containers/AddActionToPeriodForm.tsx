import * as React from 'react';
import { withStateHandlers } from 'recompose';
import { graphql, QueryProps, compose, ChildProps } from 'react-apollo';
import {
  AddActionToPeriodFormQuery,
  AddActionToPeriodForm_actionsFragment,
  PeriodItem_periodFragment,
} from 'schema';
import { styled } from '../../shared/styles';
import { TitleInput, TitleSelect } from '../../shared/components';
import * as ADD_action_TO_PERIOD_FORM_QUERY from '../querySchema/AddActionToPeriodForm.graphql';
import { CreatePeriodAction, AddActionToPeriod } from '../mutations';

const Wrapper = styled.div`font-size: 1.6rem;`;

const ErrorMessage = styled.span`
  padding: 0.8rem;
  font-size: 1.4rem;
  color: red;
`;

type Data = Response & AddActionToPeriodFormQuery;

interface OwnProps {
  isActivated: boolean;
  period: PeriodItem_periodFragment;
  onClose?(): void;
}

type Props = AddActionToPeriodFormQuery &
  QueryProps &
  OwnProps & {
    activate(): void;
    deactivate(): void;
    createAction(taskId: string | null, title: string): void;
    addAction(action: AddActionToPeriodForm_actionsFragment): void;
  };

interface State {
  selectedTaskId: string | null;
  error: string | null;
}

export class CreatePeriodActionForm extends React.Component<
  ChildProps<Props, Response>,
  State
> {
  state = {
    selectedTaskId: null,
    error: null,
  };

  private handleTaskSelect = (selectedTaskId: string) => {
    this.setState({ selectedTaskId });
  };

  private handleCreate = (title: string) => {
    const { selectedTaskId } = this.state;

    this.props.createAction(selectedTaskId, title);
    this.close();
  };

  private handleAdd = (actionId: string) => {
    const { addAction, actions } = this.props;
    const action = actions && actions.find(action => !!action && action.id === actionId);
    if (!action) {
      this.setState({ error: 'action not found' });
      return;
    }
    addAction(action);
    this.close();
  };

  private handleBlur = () => {
    this.close();
  };

  private close() {
    const { deactivate, onClose } = this.props;

    this.setState({
      error: null,
    });

    onClose && onClose();
    deactivate();
  }

  render() {
    const { createAction, activate, tasks, actions } = this.props;
    const { selectedTaskId, error } = this.state;

    const mappedTasks = (tasks || []).map(
      item =>
        item && {
          id: item.id,
          title: `${(item.project && item.project.title) ||
            ''} > ${item.title}`,
        },
    );
    const mappedActions =
      selectedTaskId != null
        ? (actions || []).filter(
            item => item && item.task && item.task.id === selectedTaskId,
          )
        : (actions || []).map(
            item =>
              item && {
                id: item.id,
                title: `${(item.task && item.task.title) ||
                  ''} > ${item.title}`,
              },
          );

    return (
      <Wrapper>
        <TitleSelect
          defaultLabel="Task"
          selectedId={selectedTaskId}
          onChange={this.handleTaskSelect}
          onOpen={activate}
          items={mappedTasks}
        />
        <TitleSelect
          defaultLabel="Action"
          selectedId=""
          onOpen={activate}
          onCreate={this.handleCreate}
          onChange={this.handleAdd}
          onBlur={this.handleBlur}
          items={mappedActions}
          resetAfterSelect
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Wrapper>
    );
  }
}

const withData = compose(
  graphql<Data, OwnProps, Props>(ADD_action_TO_PERIOD_FORM_QUERY, {
    options: ({ isActivated }) => ({
      fetchPolicy: 'network-only',
      skip: !isActivated,
    }),
    props: ({ data }) => ({
      ...data,
    }),
  }),
  graphql<Data, OwnProps, Props>(AddActionToPeriod.mutation, {
    props: ({ mutate, ownProps: { period } }) => ({
      addAction: (action: AddActionToPeriodForm_actionsFragment) =>
        mutate &&
        mutate(
          AddActionToPeriod.build(
            { periodId: period.id, actionId: action.id },
            {},
            period,
          ),
        ),
    }),
  }),
  graphql<Data, OwnProps, Props>(CreatePeriodAction.mutation, {
    props: ({ mutate, ownProps: { period } }) => ({
      createAction: (taskId: string | null, title: string) =>
        taskId &&
        mutate &&
        mutate(
          CreatePeriodAction.build(
            { title, taskId, periodId: period.id },
            {},
            period,
          ),
        ),
    }),
  }),
);

export default withStateHandlers(
  ({ isActivated = false }) => ({ isActivated }),
  {
    activate: () => () => ({ isActivated: true }),
    deactivate: () => () => ({ isActivated: false }),
  },
)(withData(CreatePeriodActionForm));
