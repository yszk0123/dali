import React from 'react';
import { createRefetchContainer, graphql } from 'react-relay';
import EmptyTimeUnitItem from './EmptyTimeUnitItem';
import TimeUnitItem from './TimeUnitItem';
import Button from './Button';

export class FocusedTimeUnitItem extends React.Component {
  _handlePreviousTimeUnitButtonClick = event => {
    this._goToPreviousTimeUnit();
  };

  _handleNextTimeUnitButtonClick = event => {
    this._goToNextTimeUnit();
  };

  _goToPreviousTimeUnit() {
    const { relay, viewer: { focused: dailySchedule } } = this.props;
    const refetchVariables = ({ position }) => ({
      date: dailySchedule.date,
      position: position - 1,
    });

    relay.refetch(refetchVariables, null);
  }

  _goToNextTimeUnit() {
    const { relay, viewer: { focused: dailySchedule } } = this.props;
    const refetchVariables = ({ position }) => ({
      date: dailySchedule.date,
      position: position + 1,
    });

    relay.refetch(refetchVariables, null);
  }

  render() {
    if (!this.props.viewer || !this.props.viewer.focused) {
      return null;
    }
    const { viewer: { focused: dailySchedule }, viewer } = this.props;
    const { timeUnit } = dailySchedule;

    return (
      <div>
        <h1>Current TimeUnit</h1>
        <Button onClick={this._handlePreviousTimeUnitButtonClick}>
          Previous
        </Button>
        <Button onClick={this._handleNextTimeUnitButtonClick}>Next</Button>
        {timeUnit
          ? <TimeUnitItem
              timeUnit={timeUnit}
              viewer={viewer}
              dailySchedule={dailySchedule}
            />
          : <EmptyTimeUnitItem position={0} dailySchedule={dailySchedule} />}
      </div>
    );
  }
}

export default createRefetchContainer(
  FocusedTimeUnitItem,
  graphql.experimental`
    fragment FocusedTimeUnitItem_viewer on User
      @argumentDefinitions(position: { type: "Int" }) {
      focused: dailySchedule {
        id
        date
        timeUnit(position: $position) {
          id
          position
          ...TimeUnitItem_timeUnit
        }
        ...EmptyTimeUnitItem_dailySchedule
        ...TimeUnitItem_dailySchedule
      }
      ...TimeUnitItem_viewer
    }
  `,
  graphql.experimental`
    query FocusedTimeUnitItemRefetchQuery($position: Int) {
      viewer {
        ...FocusedTimeUnitItem_viewer @arguments(position: $position)
      }
    }
  `,
);
