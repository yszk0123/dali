import React from 'react';
import { shallow } from 'enzyme';
import { DailyReportPage } from '../DailyReportPage';

const relay = { environment: {} };
const viewer = {};

test('renders', () => {
  const wrapper = shallow(<DailyReportPage relay={relay} viewer={viewer} />);

  expect(wrapper).toBeDefined();
});
