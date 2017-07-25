import React from 'react';
import { shallow } from 'enzyme';
import TaskSetForm from '../TaskSetForm';

test('renders', () => {
  const wrapper = shallow(<TaskSetForm />);

  expect(wrapper).toBeDefined();
});
