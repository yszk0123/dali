import React from 'react';
import { shallow } from 'enzyme';
import NavBar from '../NavBar';

test('renders', () => {
  const wrapper = shallow(<NavBar />);

  expect(wrapper).toBeDefined();
});
