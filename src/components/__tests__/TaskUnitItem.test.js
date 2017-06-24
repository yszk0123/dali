import React from 'react';
import { shallow } from 'enzyme';
import TaskUnitItem from '../TaskUnitItem';

test('renders', () => {
  const wrapper = shallow(<TaskUnitItem />);

  expect(wrapper).toBeDefined();
});
