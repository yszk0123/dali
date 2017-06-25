import React from 'react';
import { shallow } from 'enzyme';
import { WorkspacePage } from '../WorkspacePage';
import TaskUnitList from '../TaskUnitList';

const relay = { environment: {} };
const viewer = {};

test('renders', () => {
  const wrapper = shallow(<WorkspacePage relay={relay} viewer={viewer} />);

  expect(wrapper.find(TaskUnitList).exists()).toBeTruthy();
});
