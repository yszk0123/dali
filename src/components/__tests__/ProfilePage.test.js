import React from 'react';
import { shallow } from 'enzyme';
import ProfilePage from '../ProfilePage';

test('renders', () => {
  const wrapper = shallow(<ProfilePage />);

  expect(wrapper).toBeDefined();
});
