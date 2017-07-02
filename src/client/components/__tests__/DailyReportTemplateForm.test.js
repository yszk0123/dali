import React from 'react';
import { shallow } from 'enzyme';
import DailyReportTemplateForm from '../DailyReportTemplateForm';

test('renders', () => {
  const wrapper = shallow(<DailyReportTemplateForm />);

  expect(wrapper).toBeDefined();
});
