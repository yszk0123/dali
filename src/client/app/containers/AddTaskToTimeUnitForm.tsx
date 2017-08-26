import * as React from 'react';
import { graphql, compose, ChildProps } from 'react-apollo';
import {
  TimeUnitItem_timeUnitFragment,
  AddTaskToTimeUnitForm_phasesFragment,
} from 'schema';
import styled from '../styles/StyledComponents';
import TitleSelect from '../components/TitleSelect';
import TitleInput from '../components/TitleInput';
import * as CreateTimeUnitTaskMutation from '../../graphql/mutations/CreateTimeUnitTaskMutation';

const List = styled.div`
  minWidth: 300px;
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.div`
  margin-bottom: 1rem;
  align-content: center;
`;

interface OwnProps {
  timeUnit: TimeUnitItem_timeUnitFragment;
  phases: (AddTaskToTimeUnitForm_phasesFragment | null)[];
}

type Props = OwnProps & {
  createTask(phaseId: string | null, title: string): void;
};

interface State {
  selectedPhaseId: string | null;
  title: string;
}

export class AddTaskToTimeUnitForm extends React.Component<
  ChildProps<Props, Response>,
  State
> {
  state = {
    title: '',
    selectedPhaseId: null,
  };

  private handlePhaseSelect = (selectedPhaseId: string) => {
    this.setState({ selectedPhaseId });
  };

  private handleTitleChange = (title: string) => {
    this.setState({ title });
  };

  private handleCreate = () => {
    const { title, selectedPhaseId } = this.state;

    this.props.createTask(selectedPhaseId, title);
  };

  render() {
    const { createTask, phases } = this.props;
    const { selectedPhaseId, title } = this.state;

    return (
      <div>
        <TitleSelect
          selectedId={selectedPhaseId}
          onChange={this.handlePhaseSelect}
          items={phases}
        />
        <TitleInput title={title} onChange={this.handleTitleChange} />
        <button onClick={this.handleCreate}>OK</button>
      </div>
    );
  }
}

const withData = compose(
  graphql<Response, OwnProps, Props>(CreateTimeUnitTaskMutation.mutation, {
    props: ({ mutate, ownProps: { timeUnit } }) => ({
      createTask: (phaseId: string | null, title: string) =>
        phaseId &&
        mutate &&
        mutate(
          CreateTimeUnitTaskMutation.buildMutationOptions(
            { title, phaseId, timeUnitId: timeUnit.id },
            {},
            timeUnit,
          ),
        ),
    }),
  }),
);

export default withData(AddTaskToTimeUnitForm);
