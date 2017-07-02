import React from 'react';
import { shallow } from 'enzyme';
import TimeUnitForm from '../TimeUnitForm';

test('renders', () => {
  const wrapper = shallow(<TimeUnitForm />);

  expect(wrapper).toBeDefined();
});
