import React from 'react';
import { shallow } from 'enzyme';
import TimeUnitItem from '../TimeUnitItem';

test('renders', () => {
  const wrapper = shallow(<TimeUnitItem />);

  expect(wrapper).toBeDefined();
});
