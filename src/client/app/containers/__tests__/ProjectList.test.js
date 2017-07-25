import React from 'react';
import { shallow } from 'enzyme';
import ProjectList from '../ProjectList';

test('renders', () => {
  const wrapper = shallow(<ProjectList />);

  expect(wrapper).toBeDefined();
});
