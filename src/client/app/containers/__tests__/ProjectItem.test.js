import React from 'react';
import { shallow } from 'enzyme';
import ProjectItem from '../ProjectItem';

test('renders', () => {
  const wrapper = shallow(<ProjectItem />);

  expect(wrapper).toBeDefined();
});
