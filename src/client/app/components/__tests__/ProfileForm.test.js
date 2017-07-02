import React from 'react';
import { shallow } from 'enzyme';
import ProfileForm from '../ProfileForm';

test('renders', () => {
  const wrapper = shallow(<ProfileForm />);

  expect(wrapper).toBeDefined();
});
