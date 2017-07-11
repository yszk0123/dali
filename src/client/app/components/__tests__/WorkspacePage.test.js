import React from 'react';
import { shallow } from 'enzyme';
import { WorkspacePage } from '../WorkspacePage';
import TaskSetList from '../TaskSetList';

const relay = { environment: {} };
const viewer = {};

test('renders', () => {
  const wrapper = shallow(<WorkspacePage relay={relay} viewer={viewer} />);

  expect(wrapper.find(TaskSetList).exists()).toBeTruthy();
});
