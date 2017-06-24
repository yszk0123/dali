import React from 'react';
import { shallow } from 'enzyme';
import TodayPage from '../TodayPage';

test('renders', () => {
  const wrapper = shallow(<TodayPage />);

  expect(wrapper).toBeDefined();
});
