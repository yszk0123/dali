import React from 'react';
import { shallow } from 'enzyme';
import { TodayPage } from '../TodayPage';
import TimeUnitList from '../TimeUnitList';

const relay = { environment: {} };
const viewer = {};

test('renders', () => {
  const wrapper = shallow(<TodayPage relay={relay} viewer={viewer} />);

  expect(wrapper.find(TimeUnitList).exists()).toBeTruthy();
});
