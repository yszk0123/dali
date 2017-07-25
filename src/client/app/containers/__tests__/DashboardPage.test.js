import React from 'react';
import { shallow } from 'enzyme';
import { DashboardPage } from '../DashboardPage';
import TimeUnitList from '../TimeUnitList';

const relay = { environment: {} };
const viewer = {};

test('renders', () => {
  const wrapper = shallow(<DashboardPage relay={relay} viewer={viewer} />);

  expect(wrapper.find(TimeUnitList).exists()).toBeTruthy();
});
