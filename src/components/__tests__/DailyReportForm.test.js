import React from 'react';
import { shallow } from 'enzyme';
import DailyReportForm from '../DailyReportForm';

test('renders', () => {
  const wrapper = shallow(<DailyReportForm />);

  expect(wrapper).toBeDefined();
});
