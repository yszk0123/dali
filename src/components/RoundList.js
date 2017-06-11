import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import Round from './Round';
import AddRoundMutation from '../mutations/AddRoundMutation';

class RoundList extends React.Component {
  _handleAddRoundClick = event => {
    this._addRound();
  };

  _addRound() {
    AddRoundMutation.commit(
      this.props.relay.environment,
      { title: 'hoge' },
      this.props.viewer,
    );
  }

  _renderRounds() {
    const { viewer } = this.props;

    return viewer.rounds.edges.map(edge =>
      <li key={edge.node.id}>
        <Round round={edge.node} />
      </li>,
    );
  }

  render() {
    return (
      <div>
        <h1>Rounds</h1>
        <ul>{this._renderRounds()}</ul>
        <button onClick={this._handleAddRoundClick}>Add</button>
      </div>
    );
  }
}

export default createFragmentContainer(RoundList, {
  viewer: graphql`
    fragment RoundList_viewer on User {
      id
      rounds(first: 100) @connection(key: "RoundList_rounds") {
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
