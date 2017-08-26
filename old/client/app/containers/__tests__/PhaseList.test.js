import * as React from 'react';
import { shallow } from 'enzyme';
import PhaseItem from '../PhaseItem';
import { PhaseList } from '../PhaseList';
import AddTaskUnitMutation from '../../../graphql/mutations/AddTaskUnitMutation';
jest.mock('../../../graphql/mutations/AddTaskUnitMutation');

const relay = { environment: {} };
const viewer = {
  phases: {
    edges: [
      {
        node: {
          id: 'phase-1',
          title: 'phase one',
        },
      },
    ],
  },
};

test('renders phases', () => {
  const phaseList = shallow(
    <PhaseList relay={relay} viewer={viewer} />,
  );

  expect(phaseList.find(PhaseItem)).toHaveLength(
    viewer.phases.edges.length,
  );
});

test('commits AddTaskUnitMutation when the add button clicked', () => {
  const phaseList = shallow(
    <PhaseList relay={relay} viewer={viewer} />,
  );
  const input = { title: 'foo' };

  phaseList
    .find('input')
    .simulate('change', { target: { value: input.title } });
  phaseList.find('button').simulate('click');

  expect(phaseList.state('title')).toEqual('');
  expect(AddTaskUnitMutation.commit).toHaveBeenCalledWith(
    relay.environment,
    input,
    viewer,
  );
});
