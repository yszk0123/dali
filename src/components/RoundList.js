import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import Round from './Round';

function RoundList({ viewer }) {
  return (
    <div>
      <h1>Rounds</h1>
      <ul>
        {viewer.rounds.edges.map(edge =>
          <li key={edge.node.id}>
            <Round round={edge.node} />
          </li>,
        )}
      </ul>
    </div>
  );
}

export default createFragmentContainer(RoundList, {
  viewer: graphql`
    fragment RoundList_viewer on User {
      rounds(first: 100) {
        edges {
          node {
            id
            ...Round_round
          }
        }
      }
    }
  `,
});
