import React from 'react';
import { shallow } from 'enzyme';
import TimeUnitItem from '../TimeUnitItem';
import { TimeUnitList } from '../TimeUnitList';
import AddTimeUnitMutation from '../../../graphql/mutations/AddTimeUnitMutation';
jest.mock('../../../graphql/mutations/AddTimeUnitMutation');

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

  expect(timeUnitList.find(TimeUnitItem)).toHaveLength(
    viewer.timeUnits.edges.length,
  );
});

test('commits AddTimeUnitMutation when the add button clicked', () => {
  const timeUnitList = shallow(<TimeUnitList relay={relay} viewer={viewer} />);
  const input = { title: 'foo' };

  timeUnitList
    .find('input')
    .simulate('change', { target: { value: input.title } });
  timeUnitList.find('button').simulate('click');

  expect(timeUnitList.state('title')).toEqual('');
  expect(AddTimeUnitMutation.commit).toHaveBeenCalledWith(
    relay.environment,
    input,
    viewer,
  );
});
