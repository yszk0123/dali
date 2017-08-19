import React from 'react';
import { shallow } from 'enzyme';
import TaskSetItem from '../TaskSetItem';
import { TaskSetList } from '../TaskSetList';
import AddTaskUnitMutation from '../../../graphql/mutations/AddTaskUnitMutation';
jest.mock('../../../graphql/mutations/AddTaskUnitMutation');

const relay = { environment: {} };
const viewer = {
  taskSets: {
    edges: [
      {
        node: {
          id: 'taskSet-1',
          title: 'taskSet one',
        },
      },
    ],
  },
};

test('renders taskSets', () => {
  const taskSetList = shallow(<TaskSetList relay={relay} viewer={viewer} />);

  expect(taskSetList.find(TaskSetItem)).toHaveLength(
    viewer.taskSets.edges.length,
  );
});

test('commits AddTaskUnitMutation when the add button clicked', () => {
  const taskSetList = shallow(<TaskSetList relay={relay} viewer={viewer} />);
  const input = { title: 'foo' };

  taskSetList
    .find('input')
    .simulate('change', { target: { value: input.title } });
  taskSetList.find('button').simulate('click');

  expect(taskSetList.state('title')).toEqual('');
  expect(AddTaskUnitMutation.commit).toHaveBeenCalledWith(
    relay.environment,
    input,
    viewer,
  );
});
