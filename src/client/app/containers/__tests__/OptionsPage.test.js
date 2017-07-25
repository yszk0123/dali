import React from 'react';
import { shallow } from 'enzyme';
import OptionsPage from '../OptionsPage';

test('renders', () => {
  const wrapper = shallow(<OptionsPage />);

  expect(wrapper).toBeDefined();
});
