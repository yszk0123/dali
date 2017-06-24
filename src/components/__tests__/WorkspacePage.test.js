import React from 'react';
import { shallow } from 'enzyme';
import WorkspacePage from '../WorkspacePage';

test('renders', () => {
  const wrapper = shallow(<WorkspacePage />);

  expect(wrapper).toBeDefined();
});
