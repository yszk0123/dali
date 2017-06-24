import React from 'react';
import { shallow } from 'enzyme';
import TomorrowPage from '../TomorrowPage';

test('renders', () => {
  const wrapper = shallow(<TomorrowPage />);

  expect(wrapper).toBeDefined();
});
