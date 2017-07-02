import React from 'react';
import { shallow } from 'enzyme';
import DailyReportTemplatePage from '../DailyReportTemplatePage';

test('renders', () => {
  const wrapper = shallow(<DailyReportTemplatePage />);

  expect(wrapper).toBeDefined();
});
