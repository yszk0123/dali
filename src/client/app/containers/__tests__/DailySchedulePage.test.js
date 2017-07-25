import React from 'react';
import { shallow } from 'enzyme';
import { DailySchedulePage } from '../DailySchedulePage';
import TimeUnitList from '../TimeUnitList';

const relay = { environment: {} };
const viewer = {};

test('renders', () => {
  const wrapper = shallow(<DailySchedulePage relay={relay} viewer={viewer} />);

  expect(wrapper.find(TimeUnitList).exists()).toBeTruthy();
});
