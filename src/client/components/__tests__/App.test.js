import React from 'react';
import { shallow } from 'enzyme';
import { App } from '../App';
import { DashboardPage } from '../DashboardPage';
import { ProjectsPage } from '../ProjectsPage';
import { TodayPage } from '../TodayPage';
import { WorkspacePage } from '../WorkspacePage';
import { DailyReportPage } from '../DailyReportPage';

const relay = { environment: {} };
const viewer = {};

test('renders', () => {
  const wrapper = shallow(<App relay={relay} viewer={viewer} />);

  expect(wrapper.find(DashboardPage)).toBeDefined();
  expect(wrapper.find(ProjectsPage)).toBeDefined();
  expect(wrapper.find(TodayPage)).toBeDefined();
  expect(wrapper.find(WorkspacePage)).toBeDefined();
  expect(wrapper.find(DailyReportPage)).toBeDefined();
});
