import React from 'react';
import { shallow } from 'enzyme';
import { TaskSetsPage } from '../TaskSetsPage';
import TaskSetList from '../TaskSetList';

const relay = { environment: {} };
const viewer = {};

test('renders', () => {
  const wrapper = shallow(<TaskSetsPage relay={relay} viewer={viewer} />);

  expect(wrapper.find(TaskSetList).exists()).toBeTruthy();
});
