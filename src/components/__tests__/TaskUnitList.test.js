import React from 'react';
import { shallow } from 'enzyme';
import TaskUnitList from '../TaskUnitList';

test('renders', () => {
  const wrapper = shallow(<TaskUnitList />);

  expect(wrapper).toBeDefined();
});
