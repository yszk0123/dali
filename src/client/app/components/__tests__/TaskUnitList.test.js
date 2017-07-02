import React from 'react';
import { shallow } from 'enzyme';
import TaskUnitItem from '../TaskUnitItem';
import { TaskUnitList } from '../TaskUnitList';
import AddTaskUnitMutation from '../../../graphql/mutations/AddTaskUnitMutation';
jest.mock('../../../graphql/mutations/AddTaskUnitMutation');

const relay = { environment: {} };
const viewer = {
  taskUnits: {
    edges: [
      {
        node: {
          id: 'taskUnit-1',
          title: 'taskUnit one',
        },
      },
    ],
  },
};

test('renders taskUnits', () => {
  const taskUnitList = shallow(<TaskUnitList relay={relay} viewer={viewer} />);

  expect(taskUnitList.find(TaskUnitItem)).toHaveLength(
    viewer.taskUnits.edges.length,
  );
});

test('commits AddTaskUnitMutation when the add button clicked', () => {
  const taskUnitList = shallow(<TaskUnitList relay={relay} viewer={viewer} />);
  const input = { title: 'foo' };

  taskUnitList
    .find('input')
    .simulate('change', { target: { value: input.title } });
  taskUnitList.find('button').simulate('click');

  expect(taskUnitList.state('title')).toEqual('');
  expect(AddTaskUnitMutation.commit).toHaveBeenCalledWith(
    relay.environment,
    input,
    viewer,
  );
});
