import React from 'react';
import { shallow } from 'enzyme';
import YesterdayPage from '../YesterdayPage';

test('renders', () => {
  const wrapper = shallow(<YesterdayPage />);

  expect(wrapper).toBeDefined();
});
