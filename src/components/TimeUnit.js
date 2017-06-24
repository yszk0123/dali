import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

export function TimeUnit({ timeUnit }) {
  return <div>{timeUnit.title}</div>;
}

export default createFragmentContainer(
  TimeUnit,
  graphql`
    fragment TimeUnit_timeUnit on TimeUnit {
      title
    }
  `,
);
