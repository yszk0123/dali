import React from 'react';
import { shallow } from 'enzyme';
import { ProjectsPage } from '../ProjectsPage';
import ProjectList from '../ProjectList';

const relay = { environment: {} };
const viewer = {};

test('renders', () => {
  const wrapper = shallow(<ProjectsPage relay={relay} viewer={viewer} />);

  expect(wrapper.find(ProjectList).exists()).toBeTruthy();
});
