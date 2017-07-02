import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

function mapPositionToTimeRange(position) {
  const odd = position % 2 === 0;
  const startHour = Math.floor(position / 2);
  const endHour = odd ? startHour : startHour + 1;
  const startMinute = odd ? '00' : '30';
  const endMinute = !odd ? '00' : '30';

  return `${startHour}:${startMinute}~${endHour}:${endMinute}`;
}

export function TaskSummary({ tasks }) {
  return <div>{tasks.map(task => task.title).join(', ')}</div>;
}

export function TimeRange({ position }) {
  return <div>{mapPositionToTimeRange(position)}</div>;
}

export function TimeUnitItem({ timeUnit }) {
  const tasks = timeUnit.taskUnits.edges.map(edge => edge.node);

  return (
    <div>
      <TaskSummary tasks={tasks} />
      <TimeRange position={timeUnit.position} />
    </div>
  );
}

export default createFragmentContainer(
  TimeUnitItem,
  graphql`
    fragment TimeUnitItem_timeUnit on TimeUnit {
      position
      taskUnits {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `,
);
