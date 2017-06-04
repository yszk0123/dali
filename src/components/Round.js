import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

function Round({ round }) {
  return <div>{round.title}</div>;
}

export default createFragmentContainer(Round, {
  round: graphql`
    fragment Round_round on Round {
      title
    }
  `,
});
