import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

export function Round({ round }) {
  return <div>{round.title}</div>;
}

export default createFragmentContainer(
  Round,
  graphql`
    fragment Round_round on Round {
      title
    }
  `,
);
