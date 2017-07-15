import React from 'react';
import { shallow } from 'enzyme';
import { App } from '../App';
import { DashboardPage } from '../DashboardPage';
import { ProjectsPage } from '../ProjectsPage';
import { DailySchedulePage } from '../DailySchedulePage';
import { TaskSetsPage } from '../TaskSetsPage';
import { DailyReportPage } from '../DailyReportPage';

const relay = { environment: {} };
const viewer = {};

test('renders', () => {
  const wrapper = shallow(<App relay={relay} viewer={viewer} />);

  expect(wrapper.find(DashboardPage)).toBeDefined();
  expect(wrapper.find(ProjectsPage)).toBeDefined();
  expect(wrapper.find(DailySchedulePage)).toBeDefined();
  expect(wrapper.find(TaskSetsPage)).toBeDefined();
  expect(wrapper.find(DailyReportPage)).toBeDefined();
});