import React from 'react';
import { shallow } from 'enzyme';
import Round from '../Round';
import { RoundList } from '../RoundList';
import AddRoundMutation from '../../mutations/AddRoundMutation';
jest.mock('../../mutations/AddRoundMutation');

const relay = { environment: {} };
const viewer = {
  rounds: {
    edges: [
      {
        node: {
          id: 'round-1',
          title: 'round one',
        },
      },
    ],
  },
};

test('renders rounds', () => {
  const roundList = shallow(<RoundList relay={relay} viewer={viewer} />);

  expect(roundList.find(Round)).toHaveLength(viewer.rounds.edges.length);
});

test('commits AddRoundMutation when the add button clicked', () => {
  const roundList = shallow(<RoundList relay={relay} viewer={viewer} />);
  const input = { title: 'hoge' };

  roundList
    .find('input')
    .simulate('change', { target: { value: input.title } });
  roundList.find('button').simulate('click');

  expect(AddRoundMutation.commit).toHaveBeenCalledWith(
    relay.environment,
    input,
    viewer,
  );
});
