import React from 'react';
import { shallow } from 'enzyme';
import TimeUnit from '../TimeUnit';
import { TimeUnitList } from '../TimeUnitList';
import AddTimeUnitMutation from '../../mutations/AddTimeUnitMutation';
jest.mock('../../mutations/AddTimeUnitMutation');

const relay = { environment: {} };
const viewer = {
  timeUnits: {
    edges: [
      {
        node: {
          id: 'timeUnit-1',
          title: 'timeUnit one',
        },
      },
    ],
  },
};

test('renders timeUnits', () => {
  const timeUnitList = shallow(<TimeUnitList relay={relay} viewer={viewer} />);

  expect(timeUnitList.find(TimeUnit)).toHaveLength(
    viewer.timeUnits.edges.length,
  );
});

test('commits AddTimeUnitMutation when the add button clicked', () => {
  const timeUnitList = shallow(<TimeUnitList relay={relay} viewer={viewer} />);
  const input = { title: 'hoge' };

  timeUnitList
    .find('input')
    .simulate('change', { target: { value: input.title } });
  timeUnitList.find('button').simulate('click');

  expect(AddTimeUnitMutation.commit).toHaveBeenCalledWith(
    relay.environment,
    input,
    viewer,
  );
});
