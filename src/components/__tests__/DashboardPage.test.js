import React from 'react';
import { shallow } from 'enzyme';
import DashboardPage from '../DashboardPage';

test('renders', () => {
  const wrapper = shallow(<DashboardPage />);

  expect(wrapper).toBeDefined();
});
