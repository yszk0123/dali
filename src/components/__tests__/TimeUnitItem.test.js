import React from 'react';
import { shallow } from 'enzyme';
import { TimeUnitItem } from '../TimeUnitItem';

const relay = { environment: {} };
const timeUnit = {
  title: 'foo',
};

test('renders', () => {
  const wrapper = shallow(<TimeUnitItem relay={relay} timeUnit={timeUnit} />);

  expect(wrapper).toBeDefined();
});
