import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

export function TimeUnitItem({ timeUnit }) {
  return <div>{timeUnit.title}</div>;
}

export default createFragmentContainer(
  TimeUnitItem,
  graphql`
    fragment TimeUnitItem_timeUnit on TimeUnit {
      title
    }
  `,
);
