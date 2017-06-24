import React from 'react';
import { shallow } from 'enzyme';
import DailyReportPage from '../DailyReportPage';

test('renders', () => {
  const wrapper = shallow(<DailyReportPage />);

  expect(wrapper).toBeDefined();
});
