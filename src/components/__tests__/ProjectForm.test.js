import React from 'react';
import { shallow } from 'enzyme';
import ProjectForm from '../ProjectForm';

test('renders', () => {
  const wrapper = shallow(<ProjectForm />);

  expect(wrapper).toBeDefined();
});
