import React from 'react';
import { shallow } from 'enzyme';
import TaskUnitForm from '../TaskUnitForm';

test('renders', () => {
  const wrapper = shallow(<TaskUnitForm />);

  expect(wrapper).toBeDefined();
});
